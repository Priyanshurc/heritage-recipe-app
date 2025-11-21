# 📖 Documentation Index

Welcome to Heritage Recipe App! Use this guide to find the right documentation for your needs.

## ✅ Is This Ready for Local Setup?

**Yes!** See **[LOCAL_SETUP_READY.md](LOCAL_SETUP_READY.md)** — Complete verification that your code requires **only MongoDB** as an external dependency. No API keys, no third-party services.

---

## 🚀 I Just Forked This Repo

**Start here:** 👉 **[QUICKSTART.md](QUICKSTART.md)** (2 min read)
- One-liner commands for setup
- Key URLs and commands
- Quick troubleshooting

Then follow: **[SETUP.md](SETUP.md)** (10 min read) for detailed help

---

## 📋 I Want to Understand the Project

Read in this order:

1. **[README.md](README.md)** — Project overview, features, tech stack
2. **[SETUP.md](SETUP.md)** — How to run everything locally
3. **[FORKING.md](FORKING.md)** — Project structure explained

---

## ⚙️ I'm Setting Up the Backend

**[SETUP.md](SETUP.md)** → Section: **"Step 2: Set Up the Backend"**

Covers:
- Installing Node.js dependencies
- Creating `.env` file
- Configuring MongoDB (3 options)
- Starting the server

---

## 🎨 I'm Setting Up the Frontend

**[SETUP.md](SETUP.md)** → Section: **"Step 3: Set Up the Frontend"**

Covers:
- Installing Flutter dependencies
- Configuring API URL
- Building the web app
- Running the dev server

---

## 🗄️ I Need Help with Database Setup

**[SETUP.md](SETUP.md)** → Section: **"Option: Use Docker"** or **"Database Setup Options"**

3 options explained:
1. **MongoDB Atlas** (cloud, FREE, recommended)
2. **Local MongoDB** (on your machine)
3. **Docker MongoDB** (easiest if Docker is installed)

---

## 🤖 I Want to Use the Automated Setup

**Linux/macOS:**
```bash
bash setup-local.sh
```

**Windows:**
```cmd
setup-local.bat
```

See: **[QUICKSTART.md](QUICKSTART.md)** for what these scripts do

---

## 🐛 I'm Getting an Error

**[SETUP.md](SETUP.md)** → Section: **"Troubleshooting"**

Includes:
- "MongoDB connection failed"
- "No recipes appear when I log in"
- "Login fails"
- "Port already in use"
- And more...

Or: **[QUICKSTART.md](QUICKSTART.md)** → "Troubleshooting Checklist"

---

## 🤝 I Want to Contribute

**[FORKING.md](FORKING.md)**

Explains:
- Project structure
- How to fork and set up locally
- Security guidelines
- Contributing guidelines

---

## 🚀 I Want to Deploy This

**[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** (if available)

Or see [README.md](README.md) for deployment options mentioned.

---

## 🛠️ I'm Working on the Backend

See:
- **[backend/BACKEND_SETUP.md](backend/BACKEND_SETUP.md)** — Backend-specific docs
- **[SETUP.md](SETUP.md)** → "API Endpoints" section

Available scripts:
```bash
cd backend

npm install              # Install deps
npm run dev             # Start with auto-reload
npm start               # Start production

# Utility scripts:
node scripts/seedTestUser.js      # Create test@example.com
node scripts/report_import_stats.js  # Show recipe count
node scripts/clear_recipes.js     # Delete all recipes
```

---

## 🎨 I'm Working on the Frontend

```bash
cd heritage_recipes_lite

flutter pub get                 # Install deps
flutter run -d chrome           # Dev mode
flutter build web --release     # Production build
```

Key file to modify: `lib/services/api_service.dart` (baseUrl)

---

## ❓ FAQ

**Q: Do I need to install MongoDB?**
A: No, use MongoDB Atlas (cloud) or Docker. See [SETUP.md](SETUP.md).

**Q: Can I run this on Windows?**
A: Yes! Use `setup-local.bat` and follow [SETUP.md](SETUP.md).

**Q: How do I log in?**
A: Use test@example.com / test1234 (pre-seeded).

**Q: Can I see the imported recipes locally?**
A: Yes, after setup with `bash setup-local.sh` or manual steps in [SETUP.md](SETUP.md).

**Q: Is my `.env` file safe?**
A: Yes, it's in `.gitignore` and never committed to GitHub.

**Q: How do I change the API URL?**
A: Edit `heritage_recipes_lite/lib/services/api_service.dart` → `baseUrl`

---

## 📞 Still Need Help?

- **Technical issue?** → Read [SETUP.md](SETUP.md) Troubleshooting
- **Structure question?** → Read [FORKING.md](FORKING.md)
- **Want to contribute?** → Read [FORKING.md](FORKING.md) Contributing section
- **Found a bug?** → Open a GitHub Issue
- **Quick question?** → Check [QUICKSTART.md](QUICKSTART.md)

---

## 📚 All Documentation Files

| File | Purpose | Audience |
|------|---------|----------|
| **[README.md](README.md)** | Project overview & quick start | Everyone |
| **[SETUP.md](SETUP.md)** | Detailed step-by-step setup for all platforms | First-time users |
| **[QUICKSTART.md](QUICKSTART.md)** | Quick reference & commands | Impatient users |
| **[FORKING.md](FORKING.md)** | Project structure & contributing | Contributors |
| **[LOCAL_SETUP_READY.md](LOCAL_SETUP_READY.md)** | Verification that code is ready for local setup | Everyone interested in dependencies |
| **[DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)** | Production deployment | DevOps/Deployment |
| **[backend/BACKEND_SETUP.md](backend/BACKEND_SETUP.md)** | Backend-specific setup | Backend devs |

---

## 🎯 Recommended Reading Order

1. **Forked the repo?** → QUICKSTART → SETUP → FORKING
2. **Want to understand?** → README → SETUP → FORKING
3. **Just want it running?** → QUICKSTART → Run scripts
4. **Want to contribute?** → README → FORKING → SETUP
5. **Want to deploy?** → DEPLOYMENT_GUIDE

---

**Happy coding!** 🚀

