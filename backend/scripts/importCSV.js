const fs = require('fs');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Recipe = require('../models/Recipe');
const User = require('../models/User');

dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'Connection error:'));
db.once('open', async () => {
  console.log('Connected to MongoDB');
  
  // Get CSV file path from command line arguments
  const csvFilePath = process.argv[2];
  
  if (!csvFilePath) {
    console.error('Please provide CSV file path as argument');
    console.log('Usage: npm run import-csv path/to/file.csv');
    process.exit(1);
  }

  // Check if file exists
  if (!fs.existsSync(csvFilePath)) {
    console.error(`File not found: ${csvFilePath}`);
    process.exit(1);
  }

  try {
    // Create a default user for imported recipes if doesn't exist
    let defaultUser = await User.findOne({ email: 'import@recipes.com' });
    
    if (!defaultUser) {
      defaultUser = new User({
        name: 'CSV Import',
        email: 'import@recipes.com',
        password: 'import123456', // This will be hashed automatically
      });
      await defaultUser.save();
      console.log('Created default import user');
    }

    const recipes = [];
    
    // Read and parse CSV file
    fs.createReadStream(csvFilePath)
      .pipe(csv())
      .on('data', (row) => {
        // Parse ingredients and instructions (assuming they're comma-separated in CSV)
        const ingredients = row.ingredients 
          ? row.ingredients.split('|').map(i => i.trim())
          : [];
        
        const instructions = row.instructions 
          ? row.instructions.split('|').map(i => i.trim())
          : [];

        const recipe = {
          title: row.title || row.name,
          description: row.description || '',
          ingredients: ingredients,
          instructions: instructions,
          imageUrl: row.imageUrl || row.image_url || null,
          category: row.category || 'Dinner',
          prepTime: parseInt(row.prepTime || row.prep_time) || 15,
          cookTime: parseInt(row.cookTime || row.cook_time) || 30,
          servings: parseInt(row.servings) || 4,
          userId: defaultUser._id,
        };

        recipes.push(recipe);
      })
      .on('end', async () => {
        console.log(`Parsed ${recipes.length} recipes from CSV`);
        
        try {
          // Insert recipes into database
          const result = await Recipe.insertMany(recipes);
          console.log(`Successfully imported ${result.length} recipes`);
          
          // Show sample of imported data
          console.log('\nSample imported recipe:');
          console.log(JSON.stringify(result[0], null, 2));
          
        } catch (error) {
          console.error('Error importing recipes:', error);
        } finally {
          mongoose.connection.close();
          console.log('\nDatabase connection closed');
        }
      })
      .on('error', (error) => {
        console.error('Error reading CSV file:', error);
        mongoose.connection.close();
      });

  } catch (error) {
    console.error('Error:', error);
    mongoose.connection.close();
  }
});

// CSV Format Example:
// title,description,ingredients,instructions,category,prepTime,cookTime,servings,imageUrl
// "Pasta Carbonara","Classic Italian pasta dish","Spaghetti|Eggs|Bacon|Parmesan|Black pepper","Boil pasta|Cook bacon|Mix eggs and cheese|Combine all","Dinner",10,20,4,"https://example.com/image.jpg"