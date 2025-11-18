# Heritage Recipe App - Backend Setup

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- MongoDB (either local or MongoDB Atlas)

## Installation Steps

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file by copying `.env.example`:
```bash
cp .env.example .env
```

Edit `.env` and update the `MONGODB_URI`:

**Option A: Use MongoDB Atlas (Cloud)**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database_name
```
⚠️ **Important**: Make sure your IP address is whitelisted in MongoDB Atlas Security settings.

**Option B: Use Local MongoDB**
```env
MONGODB_URI=mongodb://localhost:27017/heritage-recipe-db
```
Make sure MongoDB is running: `mongod`

### 3. Update Other Environment Variables
```env
JWT_SECRET=your_super_secret_key_12345  # Change this to something random
JWT_EXPIRE=7d
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### 4. Seed Test User (Optional)
To create a test user for login testing:
```bash
npm run seed-test-user
```

This will create:
- **Email**: `test@example.com`
- **Password**: `test1234`

You can run this command anytime to recreate the test user (if it already exists, it will just display the credentials).

## Running the Server

### Development Mode (with auto-reload)
```bash
npm run dev
```

### Production Mode
```bash
npm start
```

The server will be available at `http://localhost:5000`

## API Endpoints

### Health Check
```
GET /health
```

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Recipes
- `GET /api/recipes` - Get all recipes
- `POST /api/recipes` - Create new recipe
- `GET /api/recipes/:id` - Get recipe details
- `PUT /api/recipes/:id` - Update recipe
- `DELETE /api/recipes/:id` - Delete recipe

## Available NPM Scripts

```bash
npm run dev              # Start in development mode with nodemon
npm start               # Start in production mode
npm run import-csv      # Import recipes from CSV file
npm run seed-test-user  # Create test user for login testing
```

## Troubleshooting

### MongoDB Connection Error
**Error**: "Could not connect to any servers in your MongoDB Atlas cluster"

**Solutions**:
1. Check your IP address is whitelisted in MongoDB Atlas:
   - Go to Atlas → Security → Network Access
   - Add your current IP address
   
2. Verify MONGODB_URI is correct in `.env`

3. For local MongoDB, ensure `mongod` service is running

### Port Already in Use
If port 5000 is already in use:
```bash
# Change PORT in .env file
PORT=5001
```

## Open Source Notes

This project is designed to be open-source friendly:
- All environment variables are in `.env.example`
- Test user setup is automated via npm script
- No hardcoded credentials in the codebase
- Easy to set up with local or cloud MongoDB

## Development Tips

1. Always use `.env.example` as reference for required variables
2. Never commit `.env` file to version control
3. Test user credentials are for development only
4. Create additional test users as needed using the seed script
