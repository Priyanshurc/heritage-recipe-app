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

    // Update image URLs: replace 10.0.2.2:5000 with localhost:5000
    const result = await Recipe.updateMany(
      { imageUrl: /^http:\/\/10\.0\.2\.2:5000/ },
      [
        {
          $set: {
            imageUrl: {
              $replaceAll: { input: '$imageUrl', find: '10.0.2.2:5000', replacement: 'localhost:5000' }
            }
          }
        }
      ]
    );

    console.log(`Updated ${result.modifiedCount} recipes with corrected image URLs`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error updating image URLs:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
})();
