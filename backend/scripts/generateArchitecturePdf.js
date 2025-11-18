const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outPath = path.resolve(__dirname, '..', 'Architecture_Report.pdf');
const doc = new PDFDocument({ margin: 50, size: 'A4' });
const stream = fs.createWriteStream(outPath);
doc.pipe(stream);

function h1(text) {
  doc.moveDown(0.5);
  doc.font('Helvetica-Bold').fontSize(16).text(text);
  doc.moveDown(0.2);
}

function h2(text) {
  doc.moveDown(0.25);
  doc.font('Helvetica-Bold').fontSize(13).text(text);
  doc.moveDown(0.1);
}

function para(text) {
  doc.font('Helvetica').fontSize(11).text(text, { align: 'left' });
  doc.moveDown(0.5);
}

function list(items) {
  items.forEach(i => {
    doc.font('Helvetica').fontSize(11).text(`• ${i}`);
  });
  doc.moveDown(0.5);
}

// Metadata
doc.info.Title = 'Project Architecture - Heritage Recipes Lite';
doc.info.Author = 'Paramveer Gupta';

// Title page
doc.font('Helvetica-Bold').fontSize(18).text('Heritage Recipes Lite', { align: 'center' });
doc.moveDown(0.2);
doc.font('Helvetica').fontSize(14).text('Project Architecture and Technical Documentation', { align: 'center' });
doc.moveDown(1.0);
doc.font('Helvetica').fontSize(11).text('Author: Paramveer Gupta', { align: 'center' });
doc.moveDown(0.2);
doc.text('Date: 2025-11-17', { align: 'center' });

// Add a page for overview
doc.addPage();

h1('1. Project Overview');
para('Heritage Recipes Lite is a simple recipe-finder mobile application built with Flutter for Android and a Node.js + Express backend using MongoDB for data persistence. The app allows users to register and log in, browse and search recipes, view recipe details, save favorites, and add/edit recipes. The backend exposes RESTful APIs for authentication and recipe CRUD operations.');

h2('Main Goals');
list([
  'Provide a minimal, reliable mobile UI for browsing and saving traditional recipes.',
  'Allow authenticated users to add, edit, and manage recipes.',
  'Keep the architecture simple and well-documented for the IB Computer Science IA.'
]);

// Frontend section
doc.addPage();

h1('2. Frontend (Flutter)');

h2('Tech stack & tools');
list([
  'Flutter (Dart) for UI and app logic',
  'http package for REST API calls',
  'shared_preferences for token storage',
  'StatefulWidget-based screens for simplicity',
]);

h2('Project structure (key files)');
para('The Flutter project is in `heritage_recipes_lite/` with key paths:');
list([
  '`lib/main.dart` - app entry and route definitions',
  '`lib/screens/` - pages (login, home, add recipe, recipe details)',
  '`lib/models/recipe_model.dart` - Recipe model and JSON parsing',
  '`lib/services/api_service.dart` - REST client and token management',
  '`lib/widgets/` - UI components (e.g., recipe card)'
]);

h2('Data flow');
para('The app communicates with the backend via JSON REST APIs. `ApiService` manages token storage and attaches the Authorization header. Responses are parsed into `Recipe` model objects. UI screens call service methods, await results, and update the widgets via setState.');

h2('Important implementation notes');
list([
  'Recipe model handles populated userId objects and converts them into string IDs.',
  'Error handling in `ApiService` prints parsing errors to help debugging.',
  'Add/Edit recipe flow uses the same screen; route arguments indicate edit mode.',
]);

h2('How to run (development)');
para('Ensure the backend API is reachable (use 10.0.2.2 for Android emulator or a LAN/ngrok URL for devices). Then:');
para('1. Install Flutter SDK and dependencies: `flutter pub get`\n2. Run on emulator: `flutter run`\n3. Build release APK: `flutter build apk --release`');

// Backend section
doc.addPage();

h1('3. Backend (Node.js + Express)');

h2('Tech stack & tools');
list([
  'Node.js + Express for REST API',
  'MongoDB (Mongoose) for data storage',
  'bcryptjs for password hashing',
  'jsonwebtoken for JWT authentication',
  'nodemon for development auto-reload'
]);

h2('Project structure (key files)');
list([
  '`server.js` - starts server and mounts routes',
  '`config/db.js` - connects to MongoDB using `process.env.MONGODB_URI`',
  '`models/User.js` - user schema and password hashing',
  '`models/Recipe.js` - recipe schema and text index for search',
  '`routes/auth.js` - register/login endpoints',
  '`routes/recipes.js` - recipe CRUD and favorite endpoints',
  '`scripts/seedTestUser.js` / `seedRecipes.js` - helper scripts to create test data'
]);

h2('Environment & configuration');
para('Environment variables are stored in `.env` (not committed). Use `.env.example` as a template. Required variables include: `MONGODB_URI`, `JWT_SECRET`, `JWT_EXPIRE`, and `PORT`. For stable hosting, use MongoDB Atlas and set `MONGODB_URI` to the atlas connection string.');

h2('Key API endpoints');
list([
  'POST /api/auth/register - register a new user',
  'POST /api/auth/login - login and receive JWT',
  'GET /api/recipes - list recipes (supports search and category query)',
  'GET /api/recipes/:id - get recipe details',
  'POST /api/recipes - create recipe (authenticated)',
  'PUT /api/recipes/:id - update recipe (authenticated, owner only)',
  'DELETE /api/recipes/:id - delete recipe (authenticated, owner only)',
  'POST /api/recipes/:id/favorite - toggle favorite'
]);

h2('Data models');
para('User schema fields: name, email, password (hashed), favorites array');
para('Recipe schema fields: title, description, ingredients (array of strings), instructions (array of strings), imageUrl, category, prepTime, cookTime, servings, userId (ObjectId ref to User)');

h2('Seeding and developer scripts');
para('The `scripts/` folder includes helpers:');
list([
  '`seedTestUser.js` - creates `test@example.com` / `test1234` user',
  '`seedRecipes.js` - inserts sample recipes and links them to the test user',
  '`manageUsers.js` - interactive CLI to create/list/delete users',
  '`importCSV.js` - import recipes from CSV into the DB'
]);

h2('How to run backend locally');
para('1. Install dependencies: `npm install`\n2. Copy `.env.example` to `.env` and set `MONGODB_URI`\n3. Seed data: `npm run seed-test-user` and `npm run seed-recipes`\n4. Start dev server: `npm run dev`');

// Deployment notes

h1('4. Deployment & Hosting Options');

h2('Backend hosting (simple)');
para('Use Render, Railway, or Heroku-like services for easy Node.js deployment. Connect the GitHub repo, set environment variables in the platform, and deploy. Use MongoDB Atlas for the database and point `MONGODB_URI` to the cluster.');

h2('Mobile distribution');
list([
  'Build a release AAB/APK and publish to Google Play (requires a developer account)',
  'Use Firebase App Distribution for private testing groups',
  'Use CI providers (GitHub Actions / Codemagic) to automate builds and releases'
]);

h2('Security & production considerations');
list([
  'Keep `.env` out of source control',
  'Use strong `JWT_SECRET` and rotate credentials if needed',
  'Enforce HTTPS in production',
  'Validate and sanitize user inputs on the backend',
  'Add rate limiting and logging for production readiness'
]);

// Appendix: local file references

doc.addPage();

h1('5. Appendix - Important files and commands');

h2('Frontend quick commands');
list([
  'flutter pub get',
  'flutter run',
  'flutter build apk --release',
  'Edit API URL: lib/services/api_service.dart'
]);

h2('Backend quick commands');
list([
  'npm install',
  'npm run dev',
  'npm run seed-test-user',
  'npm run seed-recipes',
  'npm run generate-ia-pdf',
  'npm run generate-arch-pdf'
]);

para('Generated files are placed in the `backend/` directory: `IA_Report.pdf` and `Architecture_Report.pdf`.');

// end

doc.moveDown(1);
doc.font('Helvetica').fontSize(10).text('Generated by project tooling. Author: Paramveer Gupta', { align: 'left' });

doc.end();

stream.on('finish', () => {
  console.log('Architecture PDF generated at:', outPath);
});

stream.on('error', (err) => {
  console.error('Error writing Architecture PDF:', err);
});
