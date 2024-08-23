const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { Movie } = require('../models');

router.post('/register', AuthController.register);
router.post('/login', AuthController.login);

router.get('/movies', authenticateToken, async (req, res) => {
  try {
    const movies = await Movie.findAll(); 
    res.status(200).json(movies); 
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

module.exports = router;

