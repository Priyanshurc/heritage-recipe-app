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

    const result = await Recipe.deleteMany({});
    console.log(`Deleted ${result.deletedCount} recipes from collection`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('Error deleting recipes:', err);
    try { await mongoose.disconnect(); } catch (e) {}
    process.exit(2);
  }
})();
