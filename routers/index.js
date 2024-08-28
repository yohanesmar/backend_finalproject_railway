const express = require('express');
const AuthController = require('../controllers/AuthController');
const router = express.Router();
const authenticateToken = require('../middlewares/authMiddleware');
const { Movie, Bookmark } = require('../models');

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

router.post('/bookmark/:movieId', authenticateToken, async (req, res) => {
  try {
    const { movieId } = req.params;
    const userId = req.user.id;
    
    const movie = await Movie.findByPk(movieId);
    if (!movie) {
      return res.status(404).json({ message: 'Movie not found' });
    }

    const existingBookmark = await Bookmark.findOne({ where: { movieId, userId } });
    if (existingBookmark) {
      return res.status(409).json({ message: 'Bookmark already exists for this movie and user' });
    }

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
