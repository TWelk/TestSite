const express = require('express');
const authenticateToken = require('../middleware/auth');

const router = express.Router();

router.get('/profile', authenticateToken, (req, res) => {
    res.json({ success: true, user: req.user });
});

module.exports = router;