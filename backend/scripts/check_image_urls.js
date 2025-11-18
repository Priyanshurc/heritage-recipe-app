const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env');
  process.exit(1);
}

const Recipe = require('../models/Recipe');

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    // Check recipes with local imageUrl (served from backend)
    const localImages = await Recipe.find({ imageUrl: /^http:\/\/10\.0\.2\.2:5000\/images\// }).limit(10);
    console.log(`\nRecipes with LOCAL imageUrl (backend-served): ${localImages.length} found (showing first 10)`);
    localImages.forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.title}`);
      console.log(`     imageUrl: ${r.imageUrl}`);
    });

    // Check total with any imageUrl
    const withImages = await Recipe.countDocuments({ imageUrl: { $ne: null } });
    console.log(`\nTotal recipes with imageUrl field: ${withImages}`);

    // Check recipes with remote imageUrl (external URLs)
    const remoteImages = await Recipe.find({ imageUrl: /^https?:\/\/(?!10\.0\.2\.2)/ }).limit(5);
    console.log(`\nRecipes with REMOTE imageUrl (external): ${remoteImages.length} found (showing first 5)`);
    remoteImages.forEach((r, idx) => {
      console.log(`  ${idx + 1}. ${r.title}`);
      console.log(`     imageUrl: ${r.imageUrl.substring(0, 80)}...`);
    });

    // Check recipes with null imageUrl
    const noImages = await Recipe.countDocuments({ imageUrl: null });
    console.log(`\nRecipes with NULL imageUrl: ${noImages}`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error checking image URLs:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
})();
