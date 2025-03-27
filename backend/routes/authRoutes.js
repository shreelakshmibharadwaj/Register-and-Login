import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';

const router = express.Router();

// User Registration
router.post('/register', async (req, res) => {
    const { name, dob, email, password } = req.body;

    // Validate input fields
    if (!name || !dob || !email || !password) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: 'User already exists' });

        // Hash password before saving
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const newUser = new User({ name, dob, email, password: hashedPassword });
        await newUser.save();

        // Generate JWT token
        const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(201).json({
            message: 'User registered successfully',
            user: { id: newUser._id, name: newUser.name, email: newUser.email },
            token
        });
    } catch (error) {
        console.error("Registration error:", error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// User Login
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    // Validate input fields
    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

        // Generate JWT token
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });
    } catch (error) {
        console.error("Login error:", error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// Forgot Password
router.post('/forgot-password', async (req, res) => {
    const { email } = req.body;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Generate reset token (valid for 15 minutes)
        const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        // Configure nodemailer transporter
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email content
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Password Reset Request',
            text: `Click the link below to reset your password:\n\n http://localhost:3000/reset-password/${resetToken} \n\n This link will expire in 15 minutes.`,
        };

        await transporter.sendMail(mailOptions);

        res.json({ message: 'Password reset link has been sent to your email' });
    } catch (error) {
        console.error("Forgot password error:", error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

export default router;
