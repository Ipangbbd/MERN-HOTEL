const express = require('express');
const Joi = require('joi');
const Room = require('../models/Room');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken, optionalAuth } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const roomSchema = Joi.object({
  roomNumber: Joi.string().required().min(1).max(10),
  type: Joi.string().valid('single', 'double', 'suite', 'deluxe').required(),
  price: Joi.number().positive().required(),
  amenities: Joi.array().items(Joi.string()),
  description: Joi.string().required().min(10).max(500),
  imageUrl: Joi.string().uri().optional().allow('')
});

const bookingSchema = Joi.object({
  guestName: Joi.string().required().min(2).max(100),
  checkInDate: Joi.date().iso().required(),
  checkOutDate: Joi.date().iso().greater(Joi.ref('checkInDate')).required()
});

// GET /api/rooms - Get all rooms with optional filtering
router.get('/', async (req, res, next) => {
  try {
    const { type, available, minPrice, maxPrice, search } = req.query;
    
    let rooms = await Room.findAll();
    
    // Apply filters
    if (type) {
      rooms = rooms.filter(room => room.type === type);
    }
    
    if (available !== undefined) {
      const isAvailable = available === 'true';
      rooms = rooms.filter(room => !room.isBooked === isAvailable);
    }
    
    if (minPrice) {
      rooms = rooms.filter(room => room.price >= parseFloat(minPrice));
    }
    
    if (maxPrice) {
      rooms = rooms.filter(room => room.price <= parseFloat(maxPrice));
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      rooms = rooms.filter(room => 
        room.roomNumber.toLowerCase().includes(searchLower) ||
        room.type.toLowerCase().includes(searchLower) ||
        room.description.toLowerCase().includes(searchLower)
      );
    }
    
    res.status(200).json({
      success: true,
      data: rooms,
      count: rooms.length
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms/stats - Get availability statistics
router.get('/stats', async (req, res, next) => {
  try {
    const stats = await Room.getAvailabilityStats();
    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/rooms/:id - Get specific room
router.get('/:id', async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rooms - Create new room
router.post('/', validateRequest(roomSchema), async (req, res, next) => {
  try {
    // Check if room number already exists
    const existingRoom = await Room.findByRoomNumber(req.body.roomNumber);
    if (existingRoom) {
      return res.status(400).json({
        success: false,
        message: 'Room number already exists'
      });
    }
    
    const room = new Room(req.body);
    await room.save();
    
    res.status(201).json({
      success: true,
      message: 'Room created successfully',
      data: room
    });
  } catch (error) {
    next(error);
  }
});

// PUT /api/rooms/:id - Update room
router.put('/:id', validateRequest(roomSchema), async (req, res, next) => {
  try {
    const existingRoom = await Room.findById(req.params.id);
    if (!existingRoom) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if room number is being changed and if it already exists
    if (req.body.roomNumber !== existingRoom.roomNumber) {
      const roomWithNumber = await Room.findByRoomNumber(req.body.roomNumber);
      if (roomWithNumber) {
        return res.status(400).json({
          success: false,
          message: 'Room number already exists'
        });
      }
    }
    
    const updatedRoom = new Room({
      ...existingRoom,
      ...req.body,
      id: req.params.id
    });
    
    await updatedRoom.save();
    
    res.status(200).json({
      success: true,
      message: 'Room updated successfully',
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
});

// DELETE /api/rooms/:id - Delete room
router.delete('/:id', async (req, res, next) => {
  try {
    const deleted = await Room.deleteById(req.params.id);
    
    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    res.status(200).json({
      success: true,
      message: 'Room deleted successfully'
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rooms/:id/book - Book a room
router.post('/:id/book', authenticateToken, validateRequest(bookingSchema), async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    if (room.isBooked) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked'
      });
    }
    
    const updatedRoom = new Room({
      ...room,
      isBooked: true,
      guestName: req.body.guestName,
      guestId: req.user.userId,
      checkInDate: req.body.checkInDate,
      checkOutDate: req.body.checkOutDate
    });
    
    await updatedRoom.save();
    
    res.status(200).json({
      success: true,
      message: 'Room booked successfully',
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/rooms/:id/checkout - Check out from room
router.post('/:id/checkout', authenticateToken, async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    if (!room.isBooked) {
      return res.status(400).json({
        success: false,
        message: 'Room is not currently booked'
      });
    }

    // Check if the current user is the one who booked the room OR if user is admin
    if (room.guestId !== req.user.userId && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'You can only check out from rooms you have booked. Admins can check out any room.'
      });
    }
    
    const updatedRoom = new Room({
      ...room,
      isBooked: false,
      guestName: null,
      guestId: null,
      checkInDate: null,
      checkOutDate: null
    });
    
    await updatedRoom.save();
    
    res.status(200).json({
      success: true,
      message: req.user.role === 'admin' ? 'Admin checkout completed successfully' : 'Checkout completed successfully',
      data: updatedRoom
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;