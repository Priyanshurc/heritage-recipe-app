# Quick Start Guide

## One-Time Setup

```bash
# 1. Navigate to backend
cd backend

# 2. Install dependencies
npm install

# 3. Create .env file
cp .env.example .env

# 4. Edit .env with your MongoDB connection string
nano .env
# Update MONGODB_URI with your connection details
```

## Using the App

### Method 1: Create Test User Quickly
```bash
npm run seed-test-user
```
This creates a test user with:
- Email: `test@example.com`
- Password: `test1234`

### Method 2: Interactive User Management
```bash
npm run manage-users
```
This opens an interactive menu where you can:
- Create custom test users
- List all users
- Delete users

### Start the Server
```bash
npm run dev
```

Then use the credentials from above to login in the app!

---

## For Open Source Contributors

1. Fork/Clone the repository
2. Follow "One-Time Setup" above
3. Create your test user
4. Start developing!

**No API keys or credentials needed in the repo!** Everything is configured via `.env.example`
