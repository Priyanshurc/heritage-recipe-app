const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('../models/Recipe');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  try {
    const doc = await Recipe.findOne({}).sort({ createdAt: -1 }).lean();
    console.log('Sample recipe:');
    console.log('title:', doc.title);
    console.log('imageUrl:', doc.imageUrl);
    console.log('category:', doc.category);
    console.log('prepTime:', doc.prepTime, 'cookTime:', doc.cookTime, 'servings:', doc.servings);
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    mongoose.connection.close();
  }
});
