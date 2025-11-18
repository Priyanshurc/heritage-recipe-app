# Heritage Recipe App - Deployment Guide

## 📱 Quick Summary

Your Flutter web app is built and ready! Follow these 3 steps to make it live:

1. **Deploy Backend** (Render.com + MongoDB Atlas) — 10 minutes
2. **Update API URL** in your app — 2 minutes  
3. **Deploy Web App** (Netlify) — 5 minutes

---

## STEP 1: Deploy Backend (Render.com + MongoDB Atlas)

### Part A: Create MongoDB Atlas Connection (FREE - 512 MB)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Start Free"
3. Create account with email
4. Create a new organization & project
5. Click "Create a Deployment" → Select "Free Tier M0" → Create
6. Wait for cluster to deploy (2-5 minutes)
7. Click "Connect" → "Drivers" → Copy the connection string
   - Format: `mongodb+srv://username:password@cluster.mongodb.net/dbname`
   - Replace `<username>`, `<password>`, and `dbname` with your details
8. **SAVE THIS CONNECTION STRING** — you'll need it in next step

### Part B: Deploy Backend to Render.com (FREE)

#### Step 1: Push code to GitHub

```bash
cd /home/priyanshu/Projects/heritage-recipe-app

# Initialize git if not already done
git init
git add .
git commit -m "Initial commit: heritage recipe app"

# Create repo on GitHub.com first, then:
git remote add origin https://github.com/YOUR_USERNAME/heritage-recipe-app.git
git branch -M main
git push -u origin main
```

#### Step 2: Deploy to Render

1. Go to https://render.com
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Select your repository
5. Fill in settings:
   - **Name**: heritage-recipe-app (or any name)
   - **Environment**: Node
   - **Build Command**: `cd backend && npm install`
   - **Start Command**: `cd backend && npm start`
   - **Plan**: Free
6. Add Environment Variables:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/recipes
   JWT_SECRET=your_secret_key_here_use_something_long
   PORT=5000
   ```
7. Click "Create Web Service"
8. Wait for deployment (3-5 minutes)
9. **SAVE YOUR URL** — will look like: `https://heritage-recipe-app.onrender.com`

---

## STEP 2: Update Flutter App API URL

Edit: `lib/services/api_service.dart`

Change this line:
```dart
static const String baseUrl = 'http://localhost:5000/api';
```

To this (replace with your Render URL):
```dart
static const String baseUrl = 'https://heritage-recipe-app.onrender.com/api';
```

Then rebuild web:
```bash
cd /home/priyanshu/Projects/heritage-recipe-app/heritage_recipes_lite
flutter build web
```

---

## STEP 3: Deploy Web App (Netlify - FREE)

1. Go to https://netlify.com
2. Sign up with GitHub
3. Click "Deploy manually"
4. Drag and drop the folder:
   `/home/priyanshu/Projects/heritage-recipe-app/heritage_recipes_lite/build/web/`
5. Wait for deployment (1-2 minutes)
6. Get your live URL! 🎉

---

## ✅ You're Done!

Your app is now live! Access it from anywhere:
- **Web**: https://your-app.netlify.app
- **Phone Browser**: Same URL works on phone
- **Backend API**: https://heritage-recipe-app.onrender.com/api

---

## 💰 Cost Breakdown

| Service | Cost | Includes |
|---------|------|----------|
| Render Backend | FREE | Node.js server, auto-deploys from GitHub |
| MongoDB Atlas | FREE | 512 MB database (enough for your app) |
| Netlify Web | FREE | Unlimited bandwidth, CDN, HTTPS |
| **Total** | **$0/month** | ✅ Completely free! |

---

## 🔄 Future Updates

Every time you make changes:

1. Rebuild web:
   ```bash
   flutter build web
   ```
2. Push to GitHub:
   ```bash
   git add .
   git commit -m "Update description"
   git push
   ```
3. On Netlify: Auto-redeploys from web folder
4. On Render: Auto-redeploys from GitHub

---

## 🆘 Troubleshooting

**"App can't connect to backend"**
- Check Render logs: https://dashboard.render.com
- Verify MongoDB Atlas whitelist allows all IPs (0.0.0.0/0)
- Check API URL in `lib/services/api_service.dart`

**"Login not working"**
- Check MongoDB is connected (test@example.com should exist)
- Run seed script on Render if needed

**"Images not loading"**
- Images are served from Render backend at `/images`
- Verify images exist in `backend/public/images/`

---

## 📖 Next Steps

1. Create GitHub account (if you don't have one)
2. Follow STEP 1 (MongoDB Atlas + Render)
3. Follow STEP 2 (Update API URL)
4. Follow STEP 3 (Deploy to Netlify)

Need help? Check the troubleshooting section or let me know which step you're stuck on!
