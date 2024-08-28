const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { Movie, Bookmark } = require('../models');

// Route to register a new user
router.post('/register', AuthController.register);

// Route to login a user
router.post('/login', AuthController.login);

// Route to fetch all movies (requires authentication)
router.get('/movies', authenticateToken, async (req, res) => {
  try {
    const movies = await Movie.findAll();
    res.status(200).json(movies);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

// Route to add a bookmark for a movie (requires authentication)
router.post('/bookmark/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;
    
    // Check if the movie exists
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    // Check if the bookmark already exists
    const existingBookmark = await Bookmark.findOne({ where: { movieId, userId } });
    if (existingBookmark) {
      return res.status(409).json({ message: 'Bookmark already exists for this movie and user' });
    }

    // Create the bookmark
    const bookmark = await Bookmark.create({ movieId, userId });
    res.status(201).json({
      message: "Success adding new bookmark",
      id: bookmark.id,
      userId: bookmark.userId,
      movieId: bookmark.movieId,
      movieTitle: movie.title
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

// Route to get all bookmarks for the logged-in user (requires authentication)
router.get('/mybookmark', authenticateToken, async (req, res) => {
  try {
    const userId = req.user.id;
    const bookmarks = await Bookmark.findAll({
      where: { userId },
      include: [{ model: Movie }]
    });

    res.status(200).json(bookmarks);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", message: error.message });
  }
});

module.exports = router;
