# Heritage Recipe App - Flutter + MongoDB

> A full-stack recipe application celebrating heritage recipes through a modern Flutter interface, powered by Node.js/Express and MongoDB.

## 📖 **NEW? Start Here → [DOCS.md](DOCS.md)** 

Not sure which docs to read? **[DOCS.md](DOCS.md)** is your navigation hub with links to the right guide for your needs.

---

## ✨ Features
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
