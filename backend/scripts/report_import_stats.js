const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env');
  process.exit(1);
}

const Recipe = require('../models/Recipe');
const User = require('../models/User');

(async () => {
  try {
    await mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const total = await Recipe.countDocuments();
    const importUser = await User.findOne({ email: 'import@recipes.com' });
    let importUserCount = 0;
    if (importUser) importUserCount = await Recipe.countDocuments({ userId: importUser._id });

    const imagesDir = path.join(__dirname, '..', 'public', 'images');
    let imagesCount = 0;
    if (fs.existsSync(imagesDir)) {
      imagesCount = fs.readdirSync(imagesDir).filter(f => !f.startsWith('.')).length;
    }

    console.log('Total recipes in collection:', total);
    console.log(`Recipes with user import@recipes.com: ${importUserCount}`);
    console.log('Files in public/images:', imagesCount);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error reporting stats:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
})();
