const express = require('express');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const bcrypt = require('bcrypt');
const db = require('../db'); // Assuming you have a centralized database connection
require('dotenv').config();

const router = express.Router();

// Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: 'Outlook', // Replace with your email service
    auth: {
        user: process.env.EMAIL, // Add this to your .env
        pass: process.env.EMAIL_PASSWORD, // Add this to your .env
    },
});

// 1. Request Password Reset
router.post('/request-reset', (req, res) => {
    const { email } = req.body;

    // Generate reset token and expiration time
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + 3600000); // Token expires in 1 hour

    // Store token in the database
    const query = `
        INSERT INTO password_reset_tokens (user_id, token, expires_at)
        VALUES ((SELECT id FROM users WHERE username = ?), ?, ?)
    `;

    db.query(query, [email, token, expiresAt], (err, result) => {
        if (err) {
            console.error('Error creating reset token:', err.message);
            return res.status(500).json({ success: false, message: 'Error creating reset token' });
        }

        // Send reset email
        const mailOptions = {
            from: process.env.EMAIL, // Sender email address
            to: email, // Recipient email address
            subject: 'Password Reset Request',
            text: `You requested a password reset. Use this token: ${token}. This token expires in 1 hour.`,
        };

        transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Error sending email:', error.message);
            return res.status(500).json({ success: false, message: 'Error sending email' });
        }

        res.json({ success: true, message: 'Reset token sent to email' });
        });
    });
});

// 2. Reset Password
router.post('/reset-password', async (req, res) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
        return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    try {
        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Validate token and update password
        const selectQuery = 'SELECT user_id FROM password_reset_tokens WHERE token = ? AND expires_at > NOW()';
        db.query(selectQuery, [token], (err, results) => {
        if (err || results.length === 0) {
            return res.status(400).json({ success: false, message: 'Invalid or expired token' });
        }

        const userId = results[0].user_id;
        const updateQuery = 'UPDATE users SET password = ? WHERE id = ?';

        db.query(updateQuery, [hashedPassword, userId], (err, result) => {
                if (err) {
                    console.error('Error updating password:', err.message);
                    return res.status(500).json({ success: false, message: 'Error updating password' });
                }

                res.json({ success: true, message: 'Password updated successfully' });
            });
        });
    } catch (err) {
        console.error('Error resetting password:', err.message);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
});

module.exports = router;
