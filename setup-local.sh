#!/bin/bash

# Heritage Recipe App — Local Setup Script (Linux/macOS)
# This script sets up the entire app locally with minimal user input

set -e  # Exit on error

echo "🚀 Heritage Recipe App — Local Setup"
echo "===================================="

# Check prerequisites
echo "📋 Checking prerequisites..."

if ! command -v node &> /dev/null; then
  echo "❌ Node.js not found. Please install from https://nodejs.org"
  exit 1
fi

if ! command -v npm &> /dev/null; then
  echo "❌ npm not found. Please install Node.js from https://nodejs.org"
  exit 1
fi

if ! command -v flutter &> /dev/null; then
  echo "❌ Flutter not found. Please install from https://flutter.dev/docs/get-started/install"
  exit 1
fi

echo "✅ Node.js $(node --version)"
echo "✅ npm $(npm --version)"
echo "✅ Flutter $(flutter --version | head -1)"

# Check if Docker is available (optional)
HAS_DOCKER=false
if command -v docker &> /dev/null; then
  HAS_DOCKER=true
  echo "✅ Docker found (can use for MongoDB)"
else
  echo "⚠️  Docker not found (MongoDB setup will be manual)"
fi

# Step 1: Install backend dependencies
echo ""
echo "📦 Installing backend dependencies..."
cd backend
npm install > /dev/null 2>&1
cd ..
echo "✅ Backend dependencies installed"

# Step 2: Configure MongoDB and .env
echo ""
echo "🗄️  Database Configuration"
echo "========================"
echo "Choose your MongoDB setup:"
echo "1) MongoDB Atlas (cloud, recommended, needs manual connection string)"
echo "2) Local MongoDB (must be running on localhost:27017)"
if [ "$HAS_DOCKER" = true ]; then
  echo "3) Docker (starts MongoDB automatically in background)"
  read -p "Choose (1-3): " db_choice
else
  read -p "Choose (1-2): " db_choice
fi

case $db_choice in
  1)
    echo ""
    echo "📝 Get your MongoDB Atlas connection string:"
    echo "   1. Go to https://www.mongodb.com/cloud/atlas"
    echo "   2. Create a free cluster"
    echo "   3. Click 'Connect' → 'Drivers' → 'Node.js'"
    echo "   4. Copy the connection string"
    echo ""
    read -p "Enter your MongoDB Atlas connection string: " MONGODB_URI
    ;;
  2)
    echo "Make sure MongoDB is running locally (mongod on port 27017)"
    MONGODB_URI="mongodb://localhost:27017/heritage-recipe-db"
    ;;
  3)
    if [ "$HAS_DOCKER" = false ]; then
      echo "Docker not available. Please choose option 1 or 2."
      exit 1
    fi
    echo "Starting MongoDB in Docker..."
    docker-compose up -d > /dev/null 2>&1
    sleep 3
    MONGODB_URI="mongodb://admin:password123@localhost:27017/heritage-recipe-db?authSource=admin"
    echo "✅ MongoDB started in Docker"
    ;;
  *)
    echo "Invalid choice"
    exit 1
    ;;
esac

# Step 3: Create .env file
echo ""
echo "🔐 Creating backend/.env..."
cat > backend/.env << EOF
MONGODB_URI=$MONGODB_URI
JWT_SECRET=$(openssl rand -hex 32)
PORT=5000
FRONTEND_URL=http://localhost:8000
EOF
echo "✅ .env created with secure JWT_SECRET"

# Step 4: Install Flutter dependencies
echo ""
echo "📦 Installing Flutter dependencies..."
cd heritage_recipes_lite
flutter pub get > /dev/null 2>&1
cd ..
echo "✅ Flutter dependencies installed"

# Step 5: Build Flutter web
echo ""
echo "🏗️  Building Flutter web app..."
cd heritage_recipes_lite
flutter build web --release > /dev/null 2>&1
cd ..
echo "✅ Flutter web built"

# Step 6: Instructions
echo ""
echo "✨ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "==============>"
echo ""
echo "1️⃣  Start the backend (Terminal 1):"
echo "   cd backend && npm run dev"
echo ""
echo "2️⃣  Start the frontend web server (Terminal 2):"
echo "   cd heritage_recipes_lite/build/web && python3 -m http.server 8000"
echo ""
echo "3️⃣  Open your browser:"
echo "   http://localhost:8000"
echo ""
echo "4️⃣  Login with:"
echo "   Email: test@example.com"
echo "   Password: test1234"
echo ""
echo "📚 For detailed setup help, see: SETUP.md"
echo ""
