Recipe App - Flutter + MongoDB

A full-stack recipe application built with Flutter for the frontend and Node.js/Express with MongoDB for the backend.
Features

    ✅ User authentication (login/register)
    ✅ Create, read, update, delete recipes
    ✅ Search recipes by title/description
    ✅ Filter recipes by category
    ✅ Favorite recipes
    ✅ Responsive UI with images
    ✅ CSV import for bulk recipe data

Tech Stack

Frontend:

    Flutter
    HTTP package for API calls
    SharedPreferences for token storage

Backend:

    Node.js & Express
    MongoDB & Mongoose
    JWT authentication
    Bcrypt for password hashing

Setup Instructions
Backend Setup

    Navigate to backend folder:

bash

cd backend

    Install dependencies:

bash

npm install

    Setup MongoDB:
        Install MongoDB locally or use MongoDB Atlas
        Update MONGODB_URI in .env file
    Configure environment variables:
        Copy .env file and update values:
            MONGODB_URI: Your MongoDB connection string
            JWT_SECRET: A secure random string
            PORT: Server port (default: 5000)
    Start the server:

bash

# Development mode with auto-reload
npm run dev

# Production mode
npm start

The server will run on http://localhost:5000
CSV Import (Optional)

To import recipes from a CSV file:

    Create a CSV file with the following format:

csv

title,description,ingredients,instructions,category,prepTime,cookTime,servings,imageUrl
"Pasta Carbonara","Classic Italian pasta","Spaghetti|Eggs|Bacon|Parmesan","Boil pasta|Cook bacon|Combine","Dinner",10,20,4,"https://example.com/pasta.jpg"

Note: Use | (pipe) to separate multiple ingredients or instructions

    Run the import script:

bash

npm run import-csv path/to/your/recipes.csv

This will create a default user (import@recipes.com) and import all recipes.
Flutter Setup

    Navigate to Flutter project:

bash

cd lib

    Install Flutter dependencies:

bash

flutter pub get

    Update API URL:
        Open lib/services/api_service.dart
        Update baseUrl to your backend URL:
            For Android Emulator: http://10.0.2.2:5000/api
            For iOS Simulator: http://localhost:5000/api
            For physical device: http://YOUR_IP:5000/api
    Run the app:

bash

# For development
flutter run

# For specific device
flutter run -d chrome  # Web
flutter run -d android # Android
flutter run -d ios     # iOS

API Endpoints
Authentication

    POST /api/auth/register - Register new user
    POST /api/auth/login - Login user

Recipes

    GET /api/recipes - Get all recipes (with search & filter)
    GET /api/recipes/:id - Get single recipe
    POST /api/recipes - Create new recipe
    PUT /api/recipes/:id - Update recipe
    DELETE /api/recipes/:id - Delete recipe
    POST /api/recipes/:id/favorite - Toggle favorite
    GET /api/recipes/favorites - Get user's favorite recipes

Project Structure
Backend

backend/
├── server.js           # Entry point
├── config/
│   └── db.js          # MongoDB connection
├── models/
│   ├── User.js        # User schema
│   └── Recipe.js      # Recipe schema
├── routes/
│   ├── auth.js        # Auth routes
│   └── recipes.js     # Recipe routes
├── scripts/
│   └── importCSV.js   # CSV import script
└── .env               # Environment variables

Flutter

lib/
├── main.dart
├── screens/
│   ├── login_screen.dart
│   ├── home_screen.dart
│   ├── add_recipe_screen.dart
│   └── recipe_details_screen.dart
├── widgets/
│   └── recipe_card.dart
├── models/
│   └── recipe_model.dart
└── services/
    └── api_service.dart

CSV Import Format

Your CSV should have these columns (all required except imageUrl):

Column	Description	Example
title	Recipe name	"Chocolate Cake"
description	Short description	"Rich and moist chocolate cake"
ingredients	Pipe-separated list	"Flour|Sugar|Cocoa|Eggs"
instructions	Pipe-separated steps	"Mix dry ingredients|Add wet|Bake 30min"
category	Category name	"Dessert"
prepTime	Prep time in minutes	15
cookTime	Cook time in minutes	30
servings	Number of servings	8
imageUrl	Image URL (optional)	"https://example.com/cake.jpg"

Testing

    Start the backend server
    Test API endpoints using Postman or curl
    Run the Flutter app and test all features

Common Issues

Issue: Connection refused

    Make sure MongoDB is running
    Check if backend server is running on correct port
    Verify API URL in Flutter app matches backend URL

Issue: CSV import fails

    Check CSV format matches the example
    Ensure all required columns are present
    Use | (pipe) to separate array values

Issue: Authentication errors

    Verify JWT_SECRET is set in .env
    Check token is being saved in SharedPreferences
    Ensure Authorization header is being sent

License

MIT License
