# Local Setup Guide — Heritage Recipe App

This guide helps you run the entire app locally (backend + frontend) on **any platform** (Linux, macOS, Windows).

## TL;DR — Quick Start (Linux/macOS)

```bash
# Clone the project
git clone https://github.com/Priyanshurc/heritage-recipe-app.git
cd heritage-recipe-app

# Run the setup script (installs deps, starts MongoDB + backend + frontend)
bash setup-local.sh
```

Then open **http://localhost:8000** in your browser and log in with:
- Email: `test@example.com`
- Password: `test1234`

---

## Prerequisites

### Required for all platforms:
- **Git** — to clone the repo
- **Node.js 18+** — for the backend
  - Download: https://nodejs.org
  - Verify: `node --version` and `npm --version`
- **Flutter SDK** — for the frontend
  - Download: https://flutter.dev/docs/get-started/install
  - Verify: `flutter --version`

### Database (pick one):
- **MongoDB Atlas** (cloud, FREE) — easiest, no installation needed
  - Sign up: https://www.mongodb.com/cloud/atlas
  - Create a free cluster
  - Get connection string (will look like: `mongodb+srv://username:password@cluster.mongodb.net/dbname`)
- **OR local MongoDB** — if you prefer on-device
  - Linux: `sudo apt install mongodb-org` or use Docker (see Docker section below)
  - macOS: `brew install mongodb-community`
  - Windows: Download installer from https://www.mongodb.com/try/download/community
  - OR use **Docker** (easiest, works on all platforms — see "Option: Use Docker" below)

### Optional (recommended for Windows):
- **Python 3** — to serve the web frontend
  - Windows: included in many distros, or download from python.org

---

## Step 1: Clone the Repository

```bash
git clone https://github.com/Priyanshurc/heritage-recipe-app.git
cd heritage-recipe-app
```

---

## Step 2: Set Up the Backend

### 2a. Install dependencies

```bash
cd backend
npm install
cd ..
```

### 2b. Configure `.env` file

Copy the template and fill in your database credentials:

```bash
cp backend/.env.example backend/.env
```

Open `backend/.env` in your text editor and update these values:

**Option A: MongoDB Atlas (recommended)**
```
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/YOUR_DB_NAME?retryWrites=true&w=majority
JWT_SECRET=any_random_long_string_here_at_least_20_chars
PORT=5000
```

Replace:
- `YOUR_USERNAME` and `YOUR_PASSWORD` — from your MongoDB Atlas account
- `YOUR_CLUSTER` — your cluster name (e.g., `cluster0`)
- `YOUR_DB_NAME` — the database name (e.g., `test`, `heritage_recipes`, etc.)

**Option B: Local MongoDB**
```
MONGODB_URI=mongodb://localhost:27017/heritage-recipe-db
JWT_SECRET=any_random_long_string_here_at_least_20_chars
PORT=5000
```

### 2c. Start the backend

```bash
cd backend
npm run dev
# or: npm start
```

You should see:
```
Server running on port 5000
MongoDB connected successfully
```

Leave this terminal open. The backend is now running at `http://localhost:5000`.

---

## Step 3: Set Up the Frontend

Open a **new terminal** and:

### 3a. Install dependencies

```bash
cd heritage_recipes_lite
flutter pub get
```

### 3b. Configure API URL (optional, already set to localhost:5000)

Open `heritage_recipes_lite/lib/services/api_service.dart` and verify `baseUrl`:

```dart
static const String baseUrl = 'http://localhost:5000/api';
```

This is already set for local development. Change it only if your backend is on a different URL.

### 3c. Build the web version

```bash
flutter build web
```

This creates a production-ready web bundle in `heritage_recipes_lite/build/web/`.

### 3d. Serve the web frontend locally

```bash
cd heritage_recipes_lite/build/web
python3 -m http.server 8000
# On Windows, use: py -3 -m http.server 8000
```

You should see:
```
Serving HTTP on 0.0.0.0 port 8000 (http://0.0.0.0:8000/) ...
```

---

## Step 4: Open and Test the App

Open your browser and go to: **http://localhost:8000**

Log in with:
- Email: `test@example.com`
- Password: `test1234`

If you see recipes displayed — **you're done!** 🎉

If you see "No recipes" — see the Troubleshooting section below.

---

## Option: Use Docker (Easiest MongoDB Setup)

If you don't want to install MongoDB locally, use Docker to run it:

### Install Docker:
- https://docs.docker.com/get-docker

### Start MongoDB in Docker:

```bash
docker run --name heritage-mongodb \
  -e MONGO_INITDB_ROOT_USERNAME=root \
  -e MONGO_INITDB_ROOT_PASSWORD=password123 \
  -p 27017:27017 \
  -d mongo:7.0
```

Then update `backend/.env`:
```
MONGODB_URI=mongodb://root:password123@localhost:27017/heritage-recipe-db?authSource=admin
```

That's it! MongoDB is now running in the background.

To stop it later:
```bash
docker stop heritage-mongodb
docker rm heritage-mongodb
```

---

## Option: Use Docker Compose (Even Easier)

If you have Docker installed, simply run:

```bash
docker-compose up -d
```

This will:
- Start MongoDB on port 27017
- Automatically create the database
- Set up credentials in `.env` (update if you changed docker-compose.yml)

Then just follow Steps 2c onward (backend and frontend).

To stop:
```bash
docker-compose down
```

---

## Automated Setup (Linux/macOS Only)

We've provided a `setup-local.sh` script that does everything above automatically:

```bash
bash setup-local.sh
```

This script will:
1. Check if Node.js and Flutter are installed
2. Install backend dependencies
3. Ask for your MongoDB connection string (or use default local)
4. Create `.env` file
5. Start MongoDB in Docker (if you choose)
6. Start the backend
7. Build and serve the frontend on port 8000

---

## Project Structure

```
heritage-recipe-app/
├── backend/
│   ├── server.js              # Express entry point
│   ├── config/
│   │   └── db.js              # MongoDB connection
│   ├── models/
│   │   ├── User.js            # User schema
│   │   └── Recipe.js          # Recipe schema
│   ├── routes/
│   │   ├── auth.js            # Login/register
│   │   └── recipes.js         # Recipe CRUD & favorites
│   ├── scripts/
│   │   ├── seedTestUser.js    # Create test@example.com user
│   │   └── import_archive_csv.js # CSV bulk import (optional)
│   ├── .env.example           # Template (rename to .env)
│   └── package.json
├── heritage_recipes_lite/     # Flutter app
│   ├── lib/
│   │   ├── main.dart
│   │   ├── services/
│   │   │   └── api_service.dart # Update baseUrl here if needed
│   │   ├── screens/
│   │   ├── models/
│   │   └── widgets/
│   ├── pubspec.yaml
│   └── build/web/            # Built web app (after `flutter build web`)
├── docker-compose.yml        # Optional MongoDB via Docker
├── setup-local.sh            # Automated Linux/macOS setup
└── README.md
```

---

## API Endpoints

Backend exposes these endpoints (all require login token in `Authorization: Bearer <token>` header):

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login (returns JWT) |
| GET | /api/recipes | List all recipes |
| GET | /api/recipes/:id | Get one recipe |
| POST | /api/recipes | Create recipe |
| PUT | /api/recipes/:id | Update recipe |
| DELETE | /api/recipes/:id | Delete recipe |
| POST | /api/recipes/:id/favorite | Toggle favorite |
| GET | /api/recipes/favorites | Get user's favorites |

---

## Troubleshooting

### **"MongoDB connection failed"**
- Verify MongoDB is running:
  - **Atlas:** Check you're online and connection string is correct in `.env`
  - **Local:** Run `mongod` or `docker run mongo:7.0 ...`
  - **Docker Compose:** Run `docker-compose up -d`
- Check `backend/.env` has correct `MONGODB_URI`
- Look at backend console for detailed error

### **"No recipes appear when I log in"**
- Run `node backend/scripts/report_import_stats.js` to check if recipes exist in your database
- If count is 0, the database is empty (expected for new setup)
  - Create recipes via the app UI, OR
  - Ask in issues if you want to import our sample 1,494 recipes
- Verify backend logs show "MongoDB connected successfully"

### **"Login fails"**
- Make sure `JWT_SECRET` in `.env` is set and not empty
- Clear browser cache or use incognito mode
- Check backend logs for specific error

### **"Can't connect to localhost:8000"**
- Make sure `python3 -m http.server 8000` is still running
- Try a different port: `python3 -m http.server 9000`, then open `http://localhost:9000`

### **"Port 5000 already in use"**
- Change `PORT` in `backend/.env` to something else (e.g., `3001`)
- Also update `api_service.dart` baseUrl to match

### **"Android emulator can't reach backend"**
- Change baseUrl in `lib/services/api_service.dart` to: `http://10.0.2.2:5000/api`
  - (Emulator sees host via 10.0.2.2, not localhost)

### **"Flutter: Command not found"**
- Install Flutter: https://flutter.dev/docs/get-started/install
- Add Flutter to PATH, then restart terminal

### **Windows-specific: "python not found"**
- Use `py -3 -m http.server 8000` instead of `python3`
- Or install Python from python.org

---

## Common Tasks

### Create a test recipe via curl

```bash
TOKEN="<your-jwt-token-here>"
curl -X POST http://localhost:5000/api/recipes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Pasta",
    "description": "Quick pasta recipe",
    "ingredients": ["Pasta", "Tomato", "Garlic"],
    "instructions": ["Boil pasta", "Add sauce"],
    "category": "Lunch",
    "prepTime": 10,
    "cookTime": 15,
    "servings": 2
  }'
```

### Import a CSV of recipes (advanced)

```bash
node backend/scripts/import_archive_csv.js path/to/recipes.csv
```

See `backend/scripts/import_archive_csv.js` for flags like `--limit` and `--max-mb`.

### Reset database (delete all recipes and users)

```bash
node backend/scripts/clear_recipes.js
node backend/scripts/seedTestUser.js  # recreate test@example.com
```

---

## Security Notes

- **`.env` is ignored by git** — never commit real passwords
- **`.env.example` has placeholders** — it's safe to commit and shows what vars are needed
- Use strong `JWT_SECRET` (20+ characters) in production
- Don't use MongoDB Atlas free tier credentials in commits

---

## Next Steps

- ✅ App running locally? Create recipes via the UI
- 🚀 Want to deploy? See `DEPLOYMENT.md` (if available)
- 🐛 Found a bug? Open an issue on GitHub
- 💡 Want to contribute? Fork and submit a PR

---

## Help & Support

- Backend won't start? Check the console output in the backend terminal
- Frontend won't load? Check http://localhost:8000 in browser dev tools (F12)
- MongoDB issues? Verify connection string in `backend/.env`
- Still stuck? Check GitHub issues or open a new one

**Happy coding!** 🚀

