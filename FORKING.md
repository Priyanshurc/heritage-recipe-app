# For Forks & Contributors

This document explains how the project is organized so anyone can fork and run it locally.

## You Forked the Project — Now What?

### 1. Clone Your Fork
```bash
git clone https://github.com/YOUR_USERNAME/heritage-recipe-app.git
cd heritage-recipe-app
```

### 2. Run One of These Setup Options

**Option A: Automated Setup (Recommended)**

Linux/macOS:
```bash
bash setup-local.sh
```

Windows:
```cmd
setup-local.bat
```

The script will:
- Check prerequisites (Node.js, Flutter)
- Ask which MongoDB to use (Atlas / Local / Docker)
- Install backend & frontend dependencies
- Build the Flutter web app
- Create `.env` with your MongoDB connection string
- Show next steps

**Option B: Manual Setup**

Follow step-by-step instructions in **[SETUP.md](SETUP.md)**

### 3. Start the App

Terminal 1 (Backend):
```bash
cd backend
npm run dev
```

Terminal 2 (Frontend):
```bash
cd heritage_recipes_lite/build/web
python3 -m http.server 8000
```

Open http://localhost:8000 in your browser.

---

## Project Organization

### Why This Structure Works for Forks

**Monorepo approach** — Backend + Frontend in one repo makes it easy to clone and run together.

```
heritage-recipe-app/
├── backend/                          # Completely self-contained
│   ├── package.json                  # Deps (npm install)
│   ├── server.js                     # Entry point
│   ├── .env.example                  # Template (copy to .env, don't commit)
│   └── scripts/
│       ├── seedTestUser.js           # Pre-fill test user
│       └── ...other utilities
│
├── heritage_recipes_lite/            # Completely self-contained
│   ├── pubspec.yaml                  # Deps (flutter pub get)
│   ├── lib/
│   │   ├── services/api_service.dart # Connects to backend
│   │   └── ...rest of app
│   └── build/web/                    # Built app (after flutter build web)
│
├── SETUP.md                          # Beginner-friendly setup guide
├── setup-local.sh                    # Auto-setup (Linux/macOS)
├── setup-local.bat                   # Auto-setup (Windows)
├── docker-compose.yml                # One-command MongoDB
├── .env.example                      # (deprecated, use backend/.env.example)
└── README.md                         # Quick overview
```

### What Each File Does

| File | Purpose |
|------|---------|
| `SETUP.md` | **START HERE** — Detailed guide for all platforms |
| `setup-local.sh` | Auto-setup for Linux/macOS (asks for MongoDB choice) |
| `setup-local.bat` | Auto-setup for Windows (asks for MongoDB choice) |
| `docker-compose.yml` | Run `docker-compose up -d` to start MongoDB automatically |
| `backend/.env.example` | Template showing what config is needed (don't commit real `.env`) |
| `backend/scripts/seedTestUser.js` | Creates test@example.com / test1234 for quick testing |

---

## Database Options (Choose One)

### MongoDB Atlas (Cloud, FREE, Recommended)
- ✅ No installation
- ✅ Always available (internet required)
- ✅ Free tier: 512 MB storage (plenty for testing)
- 📝 Sign up: https://www.mongodb.com/cloud/atlas

### Local MongoDB (On Your Machine)
- ✅ Works offline
- ✅ No size limits for testing
- ❌ Must install first
- 📝 Install: https://www.mongodb.com/try/download/community

### Docker MongoDB (If Docker Is Installed)
- ✅ No separate MongoDB install
- ✅ Identical to local
- ❌ Requires Docker
- 📝 Run: `docker-compose up -d`

**Setup scripts support all three** — they'll ask you to choose.

---

## Common Tasks for Contributors

### Run Backend Tests
```bash
cd backend
npm test
```

### Import CSV Recipes (Optional)
```bash
cd backend
node scripts/import_archive_csv.js path/to/recipes.csv --limit=100
```

### Reset Database (Delete All Data)
```bash
cd backend
node scripts/clear_recipes.js
node scripts/seedTestUser.js  # Recreate test user
```

### Serve Frontend Locally (Dev Mode)
```bash
cd heritage_recipes_lite
flutter run -d chrome  # or: -d android, etc
```

### Build Flutter Web (Production)
```bash
cd heritage_recipes_lite
flutter build web --release
```

---

## Security for Forks

### `.env` File Rules
- **Never commit** `.env` (it's in `.gitignore` for good reason)
- **Always commit** `.env.example` (shows what vars are needed, without real values)
- Generate a new `JWT_SECRET` for your fork:
  - Linux/macOS: `openssl rand -hex 32`
  - Windows: Visit https://generate-random.org and pick 32 hex chars

### Credentials
- Test user (`test@example.com / test1234`) is hardcoded in `seedTestUser.js`
- Real MongoDB credentials are in your `.env` (not committed)
- JWT secret is in `.env` (not committed)

---

## Before Deploying (If You Want To)

See **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** (if available) for production deployment.

Key points:
- Update `lib/services/api_service.dart` baseUrl to your deployed backend
- Set environment variables on your hosting platform (Render, Heroku, etc.)
- Never commit real `.env` to GitHub

---

## Troubleshooting

### "Command not found"
- Node.js: Install from https://nodejs.org
- Flutter: Install from https://flutter.dev/docs/get-started/install
- Python: Most systems have it; if not, install from https://python.org

### "MongoDB connection failed"
- Check `backend/.env` `MONGODB_URI` is correct
- Verify MongoDB is running:
  - Atlas: Are you online and credentials correct?
  - Local: Run `mongod` in another terminal
  - Docker: Run `docker-compose up -d`

### "Port 5000 already in use"
- Change `PORT` in `backend/.env` to something else (e.g., `3001`)
- Also update `baseUrl` in `lib/services/api_service.dart`

### "No recipes appear"
- Run: `node backend/scripts/report_import_stats.js`
- If count is 0, create recipes via the UI or import a CSV

---

## Contributing Guidelines

1. **Make a feature branch**
   ```bash
   git checkout -b feature/my-feature
   ```

2. **Make changes** and test locally

3. **Commit with clear messages**
   ```bash
   git commit -am "Add cool new feature"
   ```

4. **Push** to your fork
   ```bash
   git push origin feature/my-feature
   ```

5. **Open a Pull Request** to the original repo

---

## Questions?

- 📚 Read [SETUP.md](SETUP.md) for detailed help
- 🐛 Check GitHub Issues for known problems
- 💡 Open an issue or discussion if stuck
- 🤝 Contribute improvements back!

---

Happy coding! 🚀

