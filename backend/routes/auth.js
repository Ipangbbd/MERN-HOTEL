const express = require('express');
const jwt = require('jsonwebtoken');
const Joi = require('joi');
const User = require('../models/User');
const { validateRequest } = require('../middleware/validation');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-in-production';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

// Validation schemas
const registerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    firstName: Joi.string().required().min(2).max(50),
    lastName: Joi.string().required().min(2).max(50),
    phone: Joi.string().optional().allow(''),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });
};

// POST /api/auth/register - Register new user
router.post('/register', validateRequest(registerSchema), async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        // Check if user already exists
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User with this email already exists'
            });
        }

        // Create new user
        const user = new User({
            email,
            password,
            firstName,
            lastName,
            phone,
            role: 'guest'
        });

        await user.save();

        // Generate token
        const token = generateToken(user.id);

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(201).json({
            success: true,
            message: 'User registered successfully',
            data: {
                user: user.toSafeObject(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/login - Login user
router.post('/login', validateRequest(loginSchema), async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Find user by email
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Check if user is active
        if (!user.isActive) {
            return res.status(401).json({
                success: false,
                message: 'Account is deactivated. Please contact support.'
            });
        }

        // Verify password
        const userInstance = new User(user);
        const isPasswordValid = await userInstance.comparePassword(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        // Update last login
        await userInstance.updateLastLogin();

        // Generate token
        const token = generateToken(user.id);

        // Set HTTP-only cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
        });

        res.status(200).json({
            success: true,
            message: 'Login successful',
            data: {
                user: userInstance.toSafeObject(),
                token
            }
        });
    } catch (error) {
        next(error);
    }
});

// POST /api/auth/logout - Logout user
router.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.status(200).json({
        success: true,
        message: 'Logout successful'
    });
});

// GET /api/auth/me - Get current user
router.get('/me', authenticateToken, async (req, res, next) => {
    try {
        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userInstance = new User(user);
        res.status(200).json({
            success: true,
            data: userInstance.toSafeObject()
        });
    } catch (error) {
        next(error);
    }
});

// PUT /api/auth/profile - Update user profile
router.put('/profile', authenticateToken, async (req, res, next) => {
    try {
        const { firstName, lastName, phone } = req.body;

        const user = await User.findById(req.user.userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        const userInstance = new User({
            ...user,
            firstName: firstName || user.firstName,
            lastName: lastName || user.lastName,
            phone: phone || user.phone
        });

        await userInstance.save();

        res.status(200).json({
            success: true,
            message: 'Profile updated successfully',
            data: userInstance.toSafeObject()
        });
    } catch (error) {
        next(error);
    }
});

module.exports = router;