const express = require('express');
const Joi = require('joi');
const User = require('../models/User');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Validation schemas
const createUserSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    phone: Joi.string().optional().allow(''),
    role: Joi.string().valid('guest', 'admin').default('guest'),
    isActive: Joi.boolean().default(true)
});

const updateUserSchema = Joi.object({
    email: Joi.string().email().optional(),
    firstName: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    phone: Joi.string().optional().allow(''),
    role: Joi.string().valid('guest', 'admin').optional(),
    isActive: Joi.boolean().optional()
});

// GET /api/users - Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const { role, active, search } = req.query;

        let users = await User.findAll();

        // Apply filters
        if (role) {
            users = users.filter(user => user.role === role);
        }

        if (active !== undefined) {
            const isActive = active === 'true';
            users = users.filter(user => user.isActive === isActive);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            users = users.filter(user =>
                user.firstName.toLowerCase().includes(searchLower) ||
                user.lastName.toLowerCase().includes(searchLower) ||
                user.email.toLowerCase().includes(searchLower)
            );
        }

        // Remove passwords from response
        const safeUsers = users.map(user => {
            const { password, ...safeUser } = user;
            return safeUser;
        });

        res.status(200).json({
            success: true,
            data: safeUsers,
            count: safeUsers.length
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/users/stats - Get user statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const stats = await User.getUserStats();
        res.status(200).json({
            success: true,
            data: stats
        });
    } catch (error) {
        next(error);
    }
});

// GET /api/users/:id - Get specific user (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const { password, ...safeUser } = user;
        res.status(200).json({
            success: true,
            data: safeUser
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/users - Create new user (Admin only)
router.post('/', authenticateToken, requireAdmin, validateRequest(createUserSchema), async (req, res, next) => {
    try {
        // Check if user already exists
        const existingUser = await User.findByEmail(req.body.email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        const user = new User(req.body);
        await user.save();

        res.status(201).json({
            success: true,
            message: 'User created successfully',
            data: user.toSafeObject()
        });
    } catch (error) {
        next(error);
    }
});

// PUT /api/users/:id - Update user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, validateRequest(updateUserSchema), async (req, res, next) => {
    try {
        const existingUser = await User.findById(req.params.id);
        if (!existingUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if email is being changed and if it already exists
        if (req.body.email && req.body.email !== existingUser.email) {
            const userWithEmail = await User.findByEmail(req.body.email);
            if (userWithEmail) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already exists'
                });
            }
        }

        const updatedUser = new User({
            ...existingUser,
            ...req.body,
            id: req.params.id
        });

        await updatedUser.save();

        res.status(200).json({
            success: true,
            message: 'User updated successfully',
            data: updatedUser.toSafeObject()
        });
    } catch (error) {
        next(error);
    }
});

// DELETE /api/users/:id - Delete user (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res, next) => {
    try {
        // Prevent admin from deleting themselves
        if (req.params.id === req.user.userId) {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete your own account'
            });
        }

        const deleted = await User.deleteById(req.params.id);

        if (!deleted) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.status(200).json({
            success: true,
            message: 'User deleted successfully'
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;