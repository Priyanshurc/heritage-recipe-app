# Quick Reference — Getting Started

## For the Impatient 🚀

```bash
# Clone
git clone https://github.com/YOUR_FORK/heritage-recipe-app.git
cd heritage-recipe-app

# Auto-setup (Linux/macOS)
bash setup-local.sh

# OR auto-setup (Windows)
setup-local.bat

# Then follow the prompts, then in two terminals:
# Terminal 1:
cd backend && npm run dev

# Terminal 2:
cd heritage_recipes_lite/build/web && python3 -m http.server 8000

# Open browser:
# http://localhost:8000
# Login: test@example.com / test1234
```

---

## Files You Need to Know

| File | Purpose | Audience |
|------|---------|----------|
| **README.md** | Project overview | Everyone |
| **SETUP.md** | Step-by-step setup for all platforms | First-time users |
| **FORKING.md** | Explains project structure for contributors | Contributors/Forks |
| **setup-local.sh** | Auto-setup (Linux/macOS) | Linux/macOS users |
| **setup-local.bat** | Auto-setup (Windows) | Windows users |
| **docker-compose.yml** | One-command MongoDB | Docker users |
| **backend/.env.example** | Config template | Backend devs |

---

## MongoDB Options (Pick One)

```bash
# Option 1: MongoDB Atlas (Cloud, Easiest)
# Sign up at https://www.mongodb.com/cloud/atlas
# Copy connection string → paste into setup script

# Option 2: Local MongoDB
# Linux: sudo apt install mongodb-org && sudo systemctl start mongod
# macOS: brew install mongodb-community && brew services start mongodb-community
# Windows: Download installer from mongodb.com

# Option 3: Docker (If installed)
docker-compose up -d
# Uses: mongodb://admin:password123@localhost:27017/heritage-recipe-db?authSource=admin
```

---

## Key Commands

**Backend:**
```bash
cd backend
npm install          # One-time: install deps
npm run dev          # Start with auto-reload
npm start            # Start without auto-reload
node scripts/seedTestUser.js        # Create test user
node scripts/clear_recipes.js       # Delete all recipes
node scripts/report_import_stats.js # Show recipe count
```

**Frontend:**
```bash
cd heritage_recipes_lite
flutter pub get              # One-time: install deps
flutter run -d chrome        # Dev mode (auto-reload on save)
flutter build web --release  # Production build
cd build/web && python3 -m http.server 8000  # Serve locally
```

---

## URLs

| Service | URL | Notes |
|---------|-----|-------|
| Frontend (Web) | http://localhost:8000 | After running http.server |
| Backend (API) | http://localhost:5000/api | After running npm run dev |
| Health Check | http://localhost:5000/health | Verify backend is running |
| MongoDB Atlas | https://www.mongodb.com/cloud/atlas | Get connection string |

---

## Troubleshooting Checklist

- [ ] Node.js installed? (`node --version`)
- [ ] Flutter installed? (`flutter --version`)
- [ ] MongoDB running? (Check `docker ps` or `mongod` process)
- [ ] `.env` file created in `backend/`? (`cp backend/.env.example backend/.env`)
- [ ] Backend running? (Check http://localhost:5000/health)
- [ ] Frontend served? (Check http://localhost:8000)
- [ ] Can log in? (test@example.com / test1234)
- [ ] See recipes? (Run `node scripts/report_import_stats.js`)

---

## Next Steps

- ✅ **Setup done?** → Create recipes via UI or import a CSV
- 🐛 **Find a bug?** → Open GitHub issue
- 💡 **Want to contribute?** → Read FORKING.md, make a branch, submit PR
- 🚀 **Want to deploy?** → See README.md for deployment options

---

**Still stuck?** → Read SETUP.md or open a GitHub issue.

