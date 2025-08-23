const fs = require('fs').promises;
const path = require('path');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');

const DATA_FILE = path.join(__dirname, '../data/users.json');

class User {
    constructor(data) {
        this.id = data.id || uuidv4();
        this.email = data.email;
        this.password = data.password; // Will be hashed
        this.firstName = data.firstName;
        this.lastName = data.lastName;
        this.phone = data.phone || null;
        this.role = data.role || 'guest'; // 'guest' or 'admin'
        this.isActive = data.isActive !== undefined ? data.isActive : true;
        this.createdAt = data.createdAt || new Date().toISOString();
        this.updatedAt = new Date().toISOString();
        this.lastLogin = data.lastLogin || null;
    }

    // Initialize data file if it doesn't exist
    static async initializeData() {
        try {
            await fs.access(DATA_FILE);
        } catch (error) {
            // File doesn't exist, create it with default admin user
            const hashedPassword = await bcrypt.hash('admin123', 12);
            const defaultUsers = [
                {
                    id: uuidv4(),
                    email: 'admin@hotel.com',
                    password: hashedPassword,
                    firstName: 'Admin',
                    lastName: 'User',
                    phone: '+1-555-0123',
                    role: 'admin',
                    isActive: true,
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString(),
                    lastLogin: null
                }
            ];

            // Ensure data directory exists
            await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
            await fs.writeFile(DATA_FILE, JSON.stringify(defaultUsers, null, 2));
        }
    }

    // Get all users
    static async findAll() {
        await User.initializeData();
        try {
            const data = await fs.readFile(DATA_FILE, 'utf8');
            return JSON.parse(data);
        } catch (error) {
            throw new Error('Error reading users data');
        }
    }

    // Find user by ID
    static async findById(id) {
        const users = await User.findAll();
        return users.find(user => user.id === id);
    }

    // Find user by email
    static async findByEmail(email) {
        const users = await User.findAll();
        return users.find(user => user.email.toLowerCase() === email.toLowerCase());
    }

    // Hash password before saving
    async hashPassword() {
        if (this.password) {
            this.password = await bcrypt.hash(this.password, 12);
        }
    }

    // Compare password
    async comparePassword(candidatePassword) {
        return await bcrypt.compare(candidatePassword, this.password);
    }

    // Save user (create or update)
    async save() {
        const users = await User.findAll();
        const existingIndex = users.findIndex(user => user.id === this.id);

        this.updatedAt = new Date().toISOString();

        if (existingIndex !== -1) {
            users[existingIndex] = { ...this };
        } else {
            // Hash password for new users
            if (this.password && !this.password.startsWith('$2a$')) {
                await this.hashPassword();
            }
            users.push({ ...this });
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(users, null, 2));
        return this;
    }

    // Update last login
    async updateLastLogin() {
        this.lastLogin = new Date().toISOString();
        await this.save();
    }

    // Delete user
    static async deleteById(id) {
        const users = await User.findAll();
        const filteredUsers = users.filter(user => user.id !== id);

        if (users.length === filteredUsers.length) {
            return false; // User not found
        }

        await fs.writeFile(DATA_FILE, JSON.stringify(filteredUsers, null, 2));
        return true;
    }

    // Get user stats
    static async getUserStats() {
        const users = await User.findAll();
        const total = users.length;
        const active = users.filter(user => user.isActive).length;
        const admins = users.filter(user => user.role === 'admin').length;
        const guests = users.filter(user => user.role === 'guest').length;

        return {
            total,
            active,
            inactive: total - active,
            admins,
            guests
        };
    }

    // Convert to safe object (without password)
    toSafeObject() {
        const { password, ...safeUser } = this;
        return safeUser;
    }
}

module.exports = User;