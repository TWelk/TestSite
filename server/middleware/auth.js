const jwt = require('jsonwebtoken');
require('dotenv').config();

const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Extract token

    if (!token) {
        return res.status(401).json({ success: false, message: 'Access denied. Token missing.' });
    }

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Invalid token.' });
        }

        req.user = user; // Add user info from the token to the request object
        next(); // Proceed to the next middleware or route handler
    });
};

module.exports = authenticateToken;