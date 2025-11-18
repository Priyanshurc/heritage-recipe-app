const fs = require('fs');
const path = require('path');
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
  console.log('Connected to MongoDB');

  const archiveFolder = process.argv[2] || path.join(__dirname, '..', 'archive', 'image_for _cuisines');
  const publicImages = path.join(__dirname, '..', 'public', 'images');
  fs.mkdirSync(publicImages, { recursive: true });

  if (!fs.existsSync(archiveFolder)) {
    console.error('Archive images folder not found at', archiveFolder);
    process.exit(1);
  }

  const serverBase = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;

  try {
    const cursor = Recipe.find({ imageUrl: { $exists: true, $ne: null } }).cursor();
    let updated = 0;
    for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
      try {
        const img = doc.imageUrl;
        if (!img) continue;
        // skip if already points to our /images
        if (img.includes('/images/')) continue;

        const basename = path.basename(img.split('?')[0]);
        // Try exact match first
        let candidate = path.join(archiveFolder, basename);
        let foundFile = null;
        if (fs.existsSync(candidate)) {
          foundFile = candidate;
        } else {
          // Fallback: find any file in archiveFolder that ends with the basename (handles prefixed filenames)
          const files = fs.readdirSync(archiveFolder);
          const match = files.find(f => f.endsWith(basename));
          if (match) foundFile = path.join(archiveFolder, match);
        }

        if (foundFile) {
          const destName = path.basename(foundFile);
          const dest = path.join(publicImages, destName);
          if (!fs.existsSync(dest)) fs.copyFileSync(foundFile, dest);
          const newUrl = `${serverBase}/images/${encodeURIComponent(destName)}`;
          doc.imageUrl = newUrl;
          await doc.save();
          updated += 1;
          if (updated % 100 === 0) console.log(`Updated ${updated} recipes so far...`);
        }
      } catch (err) {
        console.warn('Row update error:', err.message);
      }
    }

    console.log('Image fix complete. Recipes updated:', updated);
  } catch (err) {
    console.error('Fatal:', err.message);
  } finally {
    mongoose.connection.close();
  }
});

// Usage: node scripts/fix_images_from_archive.js /absolute/path/to/archive/image_folder
