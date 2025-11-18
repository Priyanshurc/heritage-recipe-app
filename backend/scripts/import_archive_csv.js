const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;
if (!MONGODB_URI) {
  console.error('Please set MONGODB_URI in your .env');
  process.exit(1);
}

mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');

  const csvFilePath = process.argv[2];
  const imagesFolderArg = process.argv[3];

  if (!csvFilePath) {
    console.error('Usage: node scripts/import_archive_csv.js path/to/cuisines.csv [path/to/image_folder] [--limit=N] [--max-mb=M] [--no-images] [--upsert] [--dry-run]');
    process.exit(1);
  }

  // Determine images folder (optional) and flags
  let imagesFolder = imagesFolderArg || path.join(__dirname, '..', 'archive', 'image_for _cuisines');
  const rawArgs = process.argv.slice(3);
  if (imagesFolderArg && imagesFolderArg.startsWith('--')) {
    imagesFolder = path.join(__dirname, '..', 'archive', 'image_for _cuisines');
  }

  // Parse flags
  let limitCount = null;
  let maxMB = null;
  let noImages = false;
  let upsert = false;
  let dryRun = false;

  rawArgs.forEach(arg => {
    if (arg.startsWith('--limit=')) limitCount = parseInt(arg.split('=')[1], 10);
    if (arg.startsWith('--max-mb=')) maxMB = parseFloat(arg.split('=')[1]);
    if (arg === '--no-images') noImages = true;
    if (arg === '--upsert') upsert = true;
    if (arg === '--dry-run') dryRun = true;
    if (!arg.startsWith('--') && rawArgs.indexOf(arg) === 0 && fs.existsSync(arg)) imagesFolder = arg;
  });

  const maxBytes = maxMB ? Math.floor(maxMB * 1024 * 1024) : null;

  if (!fs.existsSync(csvFilePath)) {
    console.error(`CSV file not found: ${csvFilePath}`);
    process.exit(1);
  }

  if (!fs.existsSync(imagesFolder)) {
    console.warn(`Images folder not found at ${imagesFolder}. Images will be left as remote URLs if present in CSV.`);
  }

  // Ensure public images folder exists
  const publicImages = path.join(__dirname, '..', 'public', 'images');
  fs.mkdirSync(publicImages, { recursive: true });

  try {
    let defaultUser = await User.findOne({ email: 'import@recipes.com' });
    if (!defaultUser) {
      defaultUser = new User({ name: 'CSV Import', email: 'import@recipes.com', password: 'import123456' });
      await defaultUser.save();
      console.log('Created default import user import@recipes.com');
    }

    let processed = 0;
    let bytesAcc = 0;
    const batch = [];
    const bulkOps = [];
    const BATCH_SIZE = 300;

    const flushInsertBatch = async () => {
      if (batch.length === 0) return;
      if (dryRun) {
        processed += batch.length;
        console.log(`Dry-run: would insert ${batch.length} recipes (total ${processed})`);
        batch.length = 0;
        return;
      }
      try {
        const res = await Recipe.insertMany(batch);
        processed += res.length;
        console.log(`Inserted ${res.length} recipes (total ${processed})`);
      } catch (err) {
        console.error('Error inserting batch:', err);
      }
      batch.length = 0;
    };

    const flushBulkOps = async () => {
      if (bulkOps.length === 0) return;
      if (dryRun) {
        console.log(`Dry-run: would run ${bulkOps.length} bulk ops`);
        bulkOps.length = 0;
        return;
      }
      try {
        const res = await Recipe.bulkWrite(bulkOps, { ordered: false });
        console.log('Executed bulkWrite');
      } catch (err) {
        console.error('bulkWrite error:', err.message || err);
      }
      bulkOps.length = 0;
    };

    const stream = fs.createReadStream(csvFilePath).pipe(csv());

    stream.on('data', async (row) => {
      try {
        // Respect limitCount
        if (limitCount && processed >= limitCount) {
          stream.destroy();
          return;
        }

        const title = (row.name || row.title || '').trim();
        const description = (row.description || '').trim();

        let ingredients = [];
        if (row.ingredients) {
          ingredients = row.ingredients
            .split(/\r?\n/)
            .map(s => s.replace(/\s{2,}/g, ' ').trim())
            .filter(Boolean);
          if (ingredients.length === 1 && ingredients[0].length > 200) {
            const alt = ingredients[0].split(/\s{2,}|,\s|\|/).map(s => s.trim()).filter(Boolean);
            if (alt.length > 1) ingredients = alt;
          }
        }

        let instructions = [];
        if (row.instructions) {
          instructions = row.instructions
            .split(/\n\s*\n|\r\n\s*\r\n|\r?\n/)
            .map(s => s.replace(/\s{2,}/g, ' ').trim())
            .filter(Boolean);
          if (instructions.length === 0 && row.instructions.trim()) instructions = [row.instructions.trim()];
        } else {
          instructions = ['No instructions provided'];
        }

        // Original CSV image URL (may be remote). We will decide whether to copy a local image
        // and replace this value with a server-hosted path depending on --no-images and --max-mb.
        const csvImageUrl = (row.imageUrl || row.image_url || '').trim() || null;
        let imageUrl = csvImageUrl;
        let localImageSize = 0;
        let willCopyImage = false;
        let copyBasename = null;

        if (!noImages && csvImageUrl && fs.existsSync(imagesFolder)) {
          const parsed = csvImageUrl.split('?')[0];
          const basename = path.basename(parsed);
          
          // Try exact match first
          let localPath = path.join(imagesFolder, basename);
          let matchedFile = basename;
          
          if (!fs.existsSync(localPath)) {
            // Try suffix matching: find a file in archive that ends with the CSV basename
            // This handles cases like "1234.Thayir_Curd_Semiya_recipe...jpg" matching "Thayir_Curd_Semiya_recipe...jpg"
            try {
              const files = fs.readdirSync(imagesFolder);
              const suffixMatch = files.find(f => 
                f.endsWith(basename) && !f.endsWith('.Identifier')
              );
              if (suffixMatch) {
                matchedFile = suffixMatch;
                localPath = path.join(imagesFolder, suffixMatch);
              }
            } catch (err) {
              // Ignore readdir errors
            }
          }
          
          if (fs.existsSync(localPath)) {
            try {
              const stat = fs.statSync(localPath);
              localImageSize = stat.size || 0;
              copyBasename = matchedFile;
              // We'll decide to copy after we estimate JSON size below and check maxBytes.
              willCopyImage = true;
            } catch (err) {
              console.warn(`Failed to stat image ${matchedFile}:`, err.message);
              willCopyImage = false;
            }
          }
        }

        const category = (row.category || row.course || 'Dinner');
        const rawPrep = (row.prep_time || row.prepTime || row.prep || '').toString();
        const matchPrep = rawPrep.match(/(\d+)/);
        const prepTime = matchPrep ? parseInt(matchPrep[1], 10) : 15;
        const rawCook = (row.cook_time || row.cookTime || row.cook || '').toString();
        const matchCook = rawCook.match(/(\d+)/);
        const cookTime = matchCook ? parseInt(matchCook[1], 10) : 0;
        let servings = 4;
        if (row.servings) {
          const s = row.servings.toString().match(/(\d+)/);
          if (s) servings = parseInt(s[1], 10);
        }

        const recipeObj = {
          title: title || 'Untitled Recipe',
          description: description || 'No description',
          ingredients: ingredients.length ? ingredients : ['Ingredients not provided'],
          instructions: instructions.length ? instructions : ['Instructions not provided'],
          imageUrl: imageUrl || null,
          category: (function(raw){
            const r = raw.toString().toLowerCase();
            if (/breakfast/.test(r)) return 'Breakfast';
            if (/lunch/.test(r)) return 'Lunch';
            if (/dinner/.test(r)) return 'Dinner';
            if (/dessert|sweet/.test(r)) return 'Dessert';
            if (/snack|appetizer|starter|side/.test(r)) return 'Snacks';
            if (/drink|beverage/.test(r)) return 'Drinks';
            return 'Dinner';
          })(category),
          prepTime: isNaN(prepTime) ? 15 : prepTime,
          cookTime: isNaN(cookTime) ? 0 : cookTime,
          servings: isNaN(servings) ? 4 : servings,
          cuisine: (row.cuisine || '').trim() || null,
          diet: (row.diet || '').trim() || null,
          userId: defaultUser._id,
        };

        // Estimate JSON size and (optionally) local image size. If --max-mb is set we include
        // the local image file size in the accounting only if we will copy it.
        if (maxBytes) {
          const jsonSize = Buffer.byteLength(JSON.stringify(recipeObj), 'utf8');
          // If we plan to copy a local image, compute total needed (json + image)
          const totalIfCopy = bytesAcc + jsonSize + (willCopyImage ? localImageSize : 0);
          if (totalIfCopy > maxBytes) {
            // We cannot copy the image without exceeding cap. Skip copying the image and
            // keep the remote URL (or null if --no-images). Do not add localImageSize.
            if (willCopyImage) {
              willCopyImage = false;
              localImageSize = 0;
            }
            // Still count the JSON size for this document
            bytesAcc += jsonSize;
          } else {
            // We can include the image (if any) and the JSON
            bytesAcc = totalIfCopy;
          }

          if (bytesAcc > maxBytes) {
            console.log(`Reached max bytes limit (${maxMB} MB). Stopping import.`);
            stream.destroy();
            return;
          }
        }

        // If we determined we should copy the image, do it now and replace imageUrl with server path.
        if (willCopyImage && copyBasename) {
          if (dryRun) {
            // In dry-run we don't actually copy files; we already accounted for their sizes above.
          } else {
            try {
              const dest = path.join(publicImages, copyBasename);
              if (!fs.existsSync(dest)) fs.copyFileSync(path.join(imagesFolder, copyBasename), dest);
              const serverBase = process.env.SERVER_BASE_URL || `http://localhost:${process.env.PORT || 5000}`;
              imageUrl = `${serverBase}/images/${encodeURIComponent(copyBasename)}`;
              // Update recipeObj imageUrl (it was already counted in the JSON estimate), keep as-is.
              recipeObj.imageUrl = imageUrl;
            } catch (err) {
              console.warn(`Failed to copy image ${copyBasename}:`, err.message);
            }
          }
        }

        if (upsert) {
          // prepare bulk op: match by title + userId
          bulkOps.push({
            updateOne: {
              filter: { title: recipeObj.title, userId: defaultUser._id },
              update: { $set: recipeObj },
              upsert: true,
            }
          });
          if (bulkOps.length >= BATCH_SIZE) {
            stream.pause();
            await flushBulkOps();
            stream.resume();
          }
        } else {
          batch.push(recipeObj);
          if (batch.length >= BATCH_SIZE) {
            stream.pause();
            await flushInsertBatch();
            stream.resume();
          }
        }

      } catch (err) {
        console.error('Error processing row:', err.message);
      }
    });

    stream.on('end', async () => {
      await flushInsertBatch();
      await flushBulkOps();
      console.log('CSV import complete. Total recipes processed:', processed);
      mongoose.connection.close();
    });

    stream.on('error', (err) => {
      console.error('CSV read error:', err.message);
      mongoose.connection.close();
    });

  } catch (err) {
    console.error('Fatal error:', err);
    mongoose.connection.close();
  }
});

// Example usage:
// node scripts/import_archive_csv.js backend/archive/cuisines.csv --limit=500 --no-images --upsert
