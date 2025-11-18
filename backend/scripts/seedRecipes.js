const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Recipe = require('../models/Recipe');

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ Error: MONGODB_URI is not set in .env file');
  process.exit(1);
}

// Dummy recipes data
const dummyRecipes = [
  {
    title: 'Butter Chicken',
    description: 'Creamy tomato-based curry with tender chicken pieces. A classic Indian restaurant favorite with aromatic spices.',
    ingredients: [
      '500g chicken breast, cut into pieces',
      '2 tablespoons butter',
      '1 onion, finely chopped',
      '4 garlic cloves, minced',
      '1 tablespoon ginger paste',
      '400ml tomato puree',
      '200ml heavy cream',
      '2 teaspoons garam masala',
      '1 teaspoon turmeric powder',
      '1 teaspoon chili powder',
      '1 teaspoon cumin seeds',
      'Salt and pepper to taste',
      'Fresh cilantro for garnish'
    ],
    instructions: [
      'Heat butter in a large pan and sauté the onions until golden brown',
      'Add garlic and ginger paste, cook for 1 minute',
      'Add the spices (turmeric, chili powder, garam masala) and stir well',
      'Add tomato puree and simmer for 10 minutes',
      'Add the chicken pieces and cook until they are 3/4 cooked',
      'Stir in the heavy cream and simmer until chicken is fully cooked and tender',
      'Season with salt and pepper to taste',
      'Garnish with fresh cilantro and serve hot'
    ],
    category: 'Dinner',
    prepTime: 15,
    cookTime: 30,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=500'
  },
  {
    title: 'Paneer Tikka Masala',
    description: 'Soft paneer cheese cubes in a rich, creamy tomato sauce with Indian spices. A vegetarian delight.',
    ingredients: [
      '400g paneer, cut into cubes',
      '2 tablespoons tikka paste',
      '200ml yogurt',
      '2 tablespoons oil',
      '1 onion, sliced',
      '4 tomatoes, chopped',
      '200ml heavy cream',
      '2 teaspoons garam masala',
      '1 teaspoon turmeric',
      '1 teaspoon cumin powder',
      'Juice of 1 lemon',
      'Salt and pepper to taste',
      'Fresh cilantro'
    ],
    instructions: [
      'Mix tikka paste with yogurt and marinate paneer for 30 minutes',
      'Heat oil in a skillet and grill the marinated paneer until golden',
      'In the same pan, sauté onions until softened',
      'Add chopped tomatoes and cook until soft',
      'Add the spices and cook for 2 minutes',
      'Add cream and simmer for 10 minutes',
      'Add the grilled paneer and lemon juice',
      'Simmer for 5 more minutes and serve hot with rice or naan'
    ],
    category: 'Dinner',
    prepTime: 35,
    cookTime: 25,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500'
  },
  {
    title: 'Biryani',
    description: 'Aromatic rice dish cooked with meat and spices. A traditional South Asian delicacy.',
    ingredients: [
      '400g basmati rice',
      '500g chicken or mutton, cut into pieces',
      '4 onions, sliced',
      '4 tablespoons ghee',
      '200ml yogurt',
      '4 green cardamom pods',
      '4 black cardamom pods',
      '6 cloves',
      '2 bay leaves',
      '1 teaspoon cumin seeds',
      '1 stick cinnamon',
      'Saffron strands soaked in milk',
      '2 green chilies, sliced',
      'Fresh mint leaves',
      'Salt to taste'
    ],
    instructions: [
      'Soak rice in water for 30 minutes',
      'Marinate meat with yogurt, ginger-garlic paste, and spices for 1 hour',
      'Heat ghee and fry onions until golden brown, set aside half',
      'Fry the marinated meat in ghee until partially cooked',
      'Boil water with whole spices and cook rice until 70% done',
      'In a heavy-bottomed pot, layer the meat, fried onions, and rice',
      'Pour saffron milk on top, scatter mint leaves',
      'Cover with aluminum foil and then with a lid',
      'Cook on high heat for 3-4 minutes, then on low heat for 45 minutes',
      'Let it rest for 5 minutes before serving'
    ],
    category: 'Dinner',
    prepTime: 90,
    cookTime: 60,
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1563379091339-03b21ab4a104?w=500'
  },
  {
    title: 'Samosas',
    description: 'Crispy pastry triangles filled with spiced potato and peas. A popular appetizer and snack.',
    ingredients: [
      '2 cups all-purpose flour',
      '1/2 teaspoon salt',
      '1/4 teaspoon carom seeds',
      '3 tablespoons ghee',
      'Warm water',
      '4 medium potatoes, boiled and mashed',
      '1 cup green peas',
      '2 green chilies, chopped',
      '1 tablespoon ginger, minced',
      '1 teaspoon cumin seeds',
      '1 teaspoon amchur powder',
      '1/2 teaspoon garam masala',
      'Oil for frying'
    ],
    instructions: [
      'Mix flour, salt, and carom seeds. Add ghee and mix until breadcrumb texture',
      'Add water gradually and knead into a stiff dough. Let rest for 30 minutes',
      'Mix boiled potatoes with peas, chilies, ginger, and spices for filling',
      'Divide dough into 8 balls and roll each into a thin circle',
      'Cut each circle in half and roll into a cone shape',
      'Fill each cone with potato mixture and seal edges',
      'Heat oil and deep fry samosas until golden brown and crispy',
      'Drain on paper towels and serve hot with chutney'
    ],
    category: 'Snacks',
    prepTime: 40,
    cookTime: 20,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1599599810694-b3fa7f5b9e1b?w=500'
  },
  {
    title: 'Chole Bhature',
    description: 'Fluffy deep-fried bread served with spicy chickpea curry. A North Indian breakfast favorite.',
    ingredients: [
      '2 cups all-purpose flour',
      '1/2 teaspoon salt',
      '1/4 teaspoon baking soda',
      '1 tablespoon yogurt',
      '1 teaspoon sugar',
      'Warm water',
      '2 cans chickpeas, drained',
      '2 onions, chopped',
      '3 tomatoes, chopped',
      '2 tablespoons oil',
      '1 tablespoon ginger-garlic paste',
      '2 green chilies, chopped',
      '1 teaspoon cumin seeds',
      '2 teaspoons garam masala',
      '1 teaspoon chili powder',
      '1/2 teaspoon turmeric',
      'Oil for frying'
    ],
    instructions: [
      'Mix flour, salt, baking soda, yogurt, and sugar. Add water and knead into soft dough',
      'Cover and let dough rest for 3-4 hours',
      'For curry: Heat oil, add cumin seeds and ginger-garlic paste',
      'Add onions and cook until soft, then add tomatoes',
      'Add all spices and cook for 2 minutes',
      'Add chickpeas and 1 cup water, simmer for 20 minutes',
      'Divide dough into balls and roll into discs',
      'Deep fry each disc in hot oil until puffed and golden',
      'Serve hot bhatures with the spicy chickpea curry'
    ],
    category: 'Breakfast',
    prepTime: 180,
    cookTime: 45,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1585621747f8-e41609a4d41d?w=500'
  },
  {
    title: 'Masala Dosa',
    description: 'Crispy rice crepe filled with spiced potato curry. A popular South Indian breakfast.',
    ingredients: [
      '1 cup rice',
      '1/2 cup urad dal',
      '1/2 teaspoon fenugreek seeds',
      'Salt to taste',
      '4 medium potatoes',
      '2 onions, chopped',
      '2 green chilies, minced',
      '1 tablespoon ginger, minced',
      '1 teaspoon mustard seeds',
      '1 teaspoon cumin seeds',
      '8-10 curry leaves',
      '1/2 teaspoon turmeric',
      'Oil for frying'
    ],
    instructions: [
      'Soak rice, urad dal, and fenugreek seeds for 4 hours',
      'Grind into a smooth batter with little water and salt',
      'Ferment the batter for 6-8 hours until fluffy',
      'Boil and cook potatoes until tender, then cut into cubes',
      'Heat oil and add mustard seeds, cumin seeds, and curry leaves',
      'Add onions and cook until soft, then add potatoes and green chilies',
      'Add turmeric and salt, cook for 2 minutes',
      'Heat oil on a griddle and spread batter to make thin crepes',
      'Add spiced potato mixture on one side and fold',
      'Serve hot with sambar and chutney'
    ],
    category: 'Breakfast',
    prepTime: 30,
    cookTime: 15,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1585521924397-f97d70e40fca?w=500'
  },
  {
    title: 'Gulab Jamun',
    description: 'Soft spongy balls soaked in fragrant sugar syrup. A classic Indian dessert.',
    ingredients: [
      '1 cup milk powder',
      '1/2 cup all-purpose flour',
      '1/4 teaspoon baking soda',
      '2 tablespoons ghee, melted',
      '2-3 tablespoons milk',
      '1 cup sugar',
      '1 cup water',
      '1 teaspoon cardamom powder',
      '4-5 saffron strands',
      '5-6 cloves',
      '1 small cinnamon stick',
      'Rose water',
      'Oil for frying'
    ],
    instructions: [
      'Mix milk powder, flour, and baking soda',
      'Add melted ghee and milk to make a soft dough',
      'Divide into equal portions and roll into smooth balls',
      'Make sugar syrup: boil water with sugar, add cardamom, saffron, cloves, and cinnamon',
      'Keep syrup warm and add a few drops of rose water',
      'Heat oil and deep fry the gulab jamun balls until golden brown',
      'Immediately transfer fried balls into warm sugar syrup',
      'Let them soak for at least 1 hour before serving',
      'Serve at room temperature or slightly warm'
    ],
    category: 'Dessert',
    prepTime: 20,
    cookTime: 15,
    servings: 8,
    imageUrl: 'https://images.unsplash.com/photo-1585675433707-78d83b1fe1cc?w=500'
  },
  {
    title: 'Lassi',
    description: 'Refreshing yogurt-based drink with traditional spices. Perfect for hot summer days.',
    ingredients: [
      '2 cups plain yogurt',
      '1 cup water',
      '2 tablespoons sugar',
      '1/4 teaspoon cardamom powder',
      'Pinch of saffron strands',
      '1/2 teaspoon rose water',
      'Ice cubes',
      'Chopped nuts for garnish (optional)',
      'Dried fruits for garnish (optional)'
    ],
    instructions: [
      'Pour yogurt into a blender',
      'Add water and sugar',
      'Add cardamom powder and saffron strands',
      'Add rose water',
      'Blend until smooth and frothy',
      'Add ice cubes and blend again',
      'Pour into glasses and serve immediately',
      'Garnish with chopped nuts and dried fruits if desired'
    ],
    category: 'Drinks',
    prepTime: 5,
    cookTime: 0,
    servings: 2,
    imageUrl: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=500'
  },
  {
    title: 'Aloo Gobi',
    description: 'Dry curry of potato and cauliflower with aromatic spices. A simple yet flavorful vegetable dish.',
    ingredients: [
      '500g potatoes, cut into cubes',
      '500g cauliflower, cut into florets',
      '3 tablespoons oil',
      '1 onion, chopped',
      '2 green chilies, chopped',
      '1 tablespoon ginger-garlic paste',
      '1 teaspoon cumin seeds',
      '1 teaspoon turmeric powder',
      '1 teaspoon chili powder',
      '1 teaspoon garam masala',
      '1/2 teaspoon amchur powder',
      '2 tomatoes, chopped',
      'Fresh cilantro',
      'Salt to taste'
    ],
    instructions: [
      'Heat oil in a large pan and add cumin seeds',
      'Add onions and cook until soft',
      'Add ginger-garlic paste and green chilies, cook for 1 minute',
      'Add turmeric, chili powder, and garam masala',
      'Add potatoes and cauliflower, stir well to coat with spices',
      'Add chopped tomatoes and salt',
      'Cover and cook on medium heat until vegetables are tender (about 15 minutes)',
      'Sprinkle amchur powder and fresh cilantro',
      'Cook uncovered for 2 more minutes and serve hot'
    ],
    category: 'Dinner',
    prepTime: 15,
    cookTime: 20,
    servings: 4,
    imageUrl: 'https://images.unsplash.com/photo-1585064550170-fad453e05c3f?w=500'
  },
  {
    title: 'Rogan Josh',
    description: 'Aromatic lamb or chicken curry with tomatoes and yogurt. A Kashmiri specialty.',
    ingredients: [
      '700g lamb or chicken, cut into pieces',
      '4 tablespoons oil',
      '4 onions, sliced',
      '5 garlic cloves, minced',
      '1 tablespoon ginger paste',
      '400ml yogurt',
      '400ml tomato puree',
      '4 green cardamom pods',
      '4 black cardamom pods',
      '6 cloves',
      '2 bay leaves',
      '1 stick cinnamon',
      '1 teaspoon cumin seeds',
      '2 teaspoons garam masala',
      '1/2 teaspoon turmeric',
      'Salt and pepper to taste',
      'Fresh cilantro'
    ],
    instructions: [
      'Heat oil and fry half the onions until deep brown, set aside for garnish',
      'In the same oil, fry remaining onions until golden',
      'Add garlic and ginger paste, cook for 1 minute',
      'Add meat pieces and cook until browned',
      'Add yogurt and cook for 5 minutes',
      'Add tomato puree and all spices',
      'Cover and simmer on low heat for 45-50 minutes until meat is tender',
      'Add fried onions and fresh cilantro',
      'Season with salt and pepper to taste',
      'Serve hot with rice or bread'
    ],
    category: 'Dinner',
    prepTime: 15,
    cookTime: 60,
    servings: 6,
    imageUrl: 'https://images.unsplash.com/photo-1572368269881-a6f2b1a2a4f6?w=500'
  }
];

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

async function seedRecipes() {
  const connected = await connectDB();
  if (!connected) {
    process.exit(1);
  }

  try {
    // Find the test user
    const testUser = await User.findOne({ email: 'test@example.com' });
    
    if (!testUser) {
      console.log('⚠️  Test user not found!');
      console.log('📋 Please run: npm run seed-test-user');
      mongoose.connection.close();
      process.exit(1);
    }

    console.log(`📧 Using test user: ${testUser.email}`);

    // Check if recipes already exist
    const existingRecipes = await Recipe.countDocuments();
    
    if (existingRecipes > 0) {
      console.log(`⚠️  Found ${existingRecipes} existing recipes in database`);
      const deleteExisting = process.argv[2] === '--force';
      
      if (!deleteExisting) {
        console.log('\n💡 Tip: Run with --force to replace existing recipes:');
        console.log('   npm run seed-recipes -- --force\n');
        console.log('Skipping recipe creation...');
        mongoose.connection.close();
        process.exit(0);
      } else {
        console.log('🗑️  Deleting existing recipes...');
        await Recipe.deleteMany({});
      }
    }

    // Add userId to all dummy recipes
    const recipesWithUser = dummyRecipes.map(recipe => ({
      ...recipe,
      userId: testUser._id
    }));

    // Insert recipes
    const result = await Recipe.insertMany(recipesWithUser);
    
    console.log(`\n✅ Successfully added ${result.length} recipes!\n`);
    console.log('📚 Recipes added:');
    result.forEach((recipe, index) => {
      console.log(`${index + 1}. ${recipe.title} (${recipe.category})`);
    });

    console.log('\n🎉 Your recipe app now has sample data!');
    console.log('💡 You can now login and view all these recipes in your app.');

  } catch (error) {
    console.error('❌ Error seeding recipes:', error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
}

seedRecipes();
