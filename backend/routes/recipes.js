const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

// Middleware to verify token
const authMiddleware = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

// Get all recipes (with search and filter)
router.get('/', authMiddleware, async (req, res) => {
  try {
    const { search, category } = req.query;
    let query = {};

    if (search) {
      query.$text = { $search: search };
    }

    if (category) {
      query.category = category;
    }

    const recipes = await Recipe.find(query)
      .populate('userId', 'name')
      .sort({ createdAt: -1 });

    res.json(recipes);
  } catch (error) {
    console.error('Get recipes error:', error);
    res.status(500).json({ error: 'Failed to fetch recipes' });
  }
});

// Get favorites (MUST come before /:id route to avoid matching 'favorites' as an ID)
router.get('/favorites', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate({
      path: 'favorites',
      populate: { path: 'userId', select: 'name' },
    });

    res.json(user.favorites);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ error: 'Failed to fetch favorites' });
  }
});

// Get single recipe
router.get('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id)
      .populate('userId', 'name');

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    res.json(recipe);
  } catch (error) {
    console.error('Get recipe error:', error);
    res.status(500).json({ error: 'Failed to fetch recipe' });
  }
});

// Create recipe
router.post('/', authMiddleware, async (req, res) => {
  try {
    const recipe = new Recipe({
      ...req.body,
      userId: req.userId,
    });

    await recipe.save();
    await recipe.populate('userId', 'name');

    res.status(201).json(recipe);
  } catch (error) {
    console.error('Create recipe error:', error);
    res.status(500).json({ error: 'Failed to create recipe' });
  }
});

// Update recipe
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    Object.assign(recipe, req.body);
    await recipe.save();
    await recipe.populate('userId', 'name');

    res.json(recipe);
  } catch (error) {
    console.error('Update recipe error:', error);
    res.status(500).json({ error: 'Failed to update recipe' });
  }
});

// Delete recipe
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const recipe = await Recipe.findById(req.params.id);

    if (!recipe) {
      return res.status(404).json({ error: 'Recipe not found' });
    }

    // Check if user owns the recipe
    if (recipe.userId.toString() !== req.userId) {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    await recipe.deleteOne();
    res.json({ message: 'Recipe deleted successfully' });
  } catch (error) {
    console.error('Delete recipe error:', error);
    res.status(500).json({ error: 'Failed to delete recipe' });
  }
});

// Toggle favorite
router.post('/:id/favorite', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    const recipeId = req.params.id;

    const index = user.favorites.indexOf(recipeId);
    
    if (index > -1) {
      user.favorites.splice(index, 1);
    } else {
      user.favorites.push(recipeId);
    }

    await user.save();
    res.json({ message: 'Favorite toggled', isFavorite: index === -1 });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ error: 'Failed to toggle favorite' });
  }
});

module.exports = router;