const express = require('express');
const User = require('../models/User');
const Recipe = require('../models/Recipe');
const auth = require('../middleware/auth');

const router = express.Router();

// Get user's favorites
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId)
      .populate('favorites');

    res.json({ favorites: user.favorites });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to favorites
router.post('/:recipeId', auth, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.recipeId);
    
    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    const user = await User.findById(req.userId);

    if (user.favorites.includes(req.params.recipeId)) {
      return res.status(400).json({ error: 'Recipe already in favorites' });
    }

    user.favorites.push(req.params.recipeId);
    await user.save();

    res.json({ message: 'Added to favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from favorites
router.delete('/:recipeId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    user.favorites = user.favorites.filter(
      id => id.toString() !== req.params.recipeId
    );
    await user.save();

    res.json({ message: 'Removed from favorites' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;