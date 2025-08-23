const fs = require('fs').promises;
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/rooms.json');

class Room {
  constructor(data) {
    this.id = data.id || uuidv4();
    this.roomNumber = data.roomNumber;
    this.type = data.type;
    this.price = data.price;
    this.isBooked = data.isBooked || false;
    this.guestName = data.guestName || null;
    this.guestId = data.guestId || null;
    this.checkInDate = data.checkInDate || null;
    this.checkOutDate = data.checkOutDate || null;
    this.amenities = data.amenities || [];
    this.description = data.description;
    this.imageUrl = data.imageUrl || null;
    this.createdAt = data.createdAt || new Date().toISOString();
    this.updatedAt = new Date().toISOString();
  }

  // Initialize data file if it doesn't exist
  static async initializeData() {
    try {
      await fs.access(DATA_FILE);
    } catch (error) {
      // File doesn't exist, create it with sample data
      const sampleRooms = [
        {
          id: uuidv4(),
          roomNumber: "101",
          type: "single",
          price: 99,
          isBooked: false,
          amenities: ["Wi-Fi", "TV", "Air Conditioning"],
          description: "Comfortable single room with city view",
          imageUrl: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          roomNumber: "102",
          type: "double",
          price: 149,
          isBooked: true,
          guestName: "John Smith",
          checkInDate: "2024-01-15",
          checkOutDate: "2024-01-18",
          amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar"],
          description: "Spacious double room with garden view",
          imageUrl: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          roomNumber: "201",
          type: "suite",
          price: 299,
          isBooked: false,
          amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Balcony"],
          description: "Luxury suite with panoramic city view",
          imageUrl: "https://images.pexels.com/photos/1457842/pexels-photo-1457842.jpeg",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        },
        {
          id: uuidv4(),
          roomNumber: "202",
          type: "deluxe",
          price: 399,
          isBooked: false,
          amenities: ["Wi-Fi", "TV", "Air Conditioning", "Mini Bar", "Jacuzzi", "Balcony", "Room Service"],
          description: "Premium deluxe room with ocean view",
          imageUrl: "https://images.pexels.com/photos/1743229/pexels-photo-1743229.jpeg",
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        }
      ];

      // Ensure data directory exists
      await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
      await fs.writeFile(DATA_FILE, JSON.stringify(sampleRooms, null, 2));
    }
  }

  // Get all rooms
  static async findAll() {
    await Room.initializeData();
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      throw new Error('Error reading rooms data');
    }
  }

  // Find room by ID
  static async findById(id) {
    const rooms = await Room.findAll();
    return rooms.find(room => room.id === id);
  }

  // Find room by room number
  static async findByRoomNumber(roomNumber) {
    const rooms = await Room.findAll();
    return rooms.find(room => room.roomNumber === roomNumber);
  }

  // Save room (create or update)
  async save() {
    const rooms = await Room.findAll();
    const existingIndex = rooms.findIndex(room => room.id === this.id);
    
    this.updatedAt = new Date().toISOString();
    
    if (existingIndex !== -1) {
      rooms[existingIndex] = { ...this };
    } else {
      rooms.push({ ...this });
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(rooms, null, 2));
    return this;
  }

  // Delete room
  static async deleteById(id) {
    const rooms = await Room.findAll();
    const filteredRooms = rooms.filter(room => room.id !== id);
    
    if (rooms.length === filteredRooms.length) {
      return false; // Room not found
    }
    
    await fs.writeFile(DATA_FILE, JSON.stringify(filteredRooms, null, 2));
    return true;
  }

  // Get availability statistics
  static async getAvailabilityStats() {
    const rooms = await Room.findAll();
    const total = rooms.length;
    const booked = rooms.filter(room => room.isBooked).length;
    const available = total - booked;
    
    return {
      total,
      available,
      booked,
      occupancyRate: total > 0 ? Math.round((booked / total) * 100) : 0
    };
  }
}

module.exports = Room;