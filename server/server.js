require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const db = require('./db');
const logger = require('./utils/logger');
const authMiddleware = require('./middleware/auth');
const errorHandler = require('./middleware/errorHandler');
const resetRoutes = require('./routes/reset');
const profileRoutes = require('./routes/profile');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());

// Logging
app.use((req, res, next) => {
    logger.info(`Incoming request: ${req.method} ${req.url}`);
    next();
});

// Routes
app.use('/api/reset', resetRoutes);
app.use('/api/profile', authMiddleware, profileRoutes);

// Error Handling
app.use(errorHandler);

// Start Server
app.listen(PORT, () => {
    logger.info(`Server running on http://localhost:${PORT}`);
});
