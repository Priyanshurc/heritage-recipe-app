const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');

dotenv.config();

// Test credentials
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'test1234';
const TEST_NAME = 'Test User';

// Connect to MongoDB
const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ Error: MONGODB_URI is not set in .env file');
  console.log('\n📋 Setup Instructions:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Update MONGODB_URI with your MongoDB connection string');
  console.log('   - For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/dbname');
  console.log('   - For local MongoDB: mongodb://localhost:27017/heritage-recipe-db');
  console.log('3. Run: npm run seed-test-user');
  process.exit(1);
}

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const db = mongoose.connection;

db.on('error', (error) => {
  console.error('❌ MongoDB connection error:', error.message);
  console.log('\n📋 Troubleshooting:');
  console.log('1. Verify MONGODB_URI in .env file is correct');
  console.log('2. For MongoDB Atlas: Make sure your IP is whitelisted');
  console.log('3. For local MongoDB: Ensure mongod service is running');
  process.exit(1);
});

db.once('open', async () => {
  console.log('✅ Connected to MongoDB');

  try {
    // Check if test user already exists
    const existingUser = await User.findOne({ email: TEST_EMAIL });
    
    if (existingUser) {
      console.log('\n⚠️  Test user already exists!');
      console.log('\n📧 Login Credentials:');
      console.log(`   Email: ${TEST_EMAIL}`);
      console.log(`   Password: ${TEST_PASSWORD}`);
    } else {
      // Create test user
      const testUser = new User({
        name: TEST_NAME,
        email: TEST_EMAIL,
        password: TEST_PASSWORD, // This will be hashed automatically
      });
      
      await testUser.save();
      console.log('\n✅ Test user created successfully!');
      console.log('\n📧 Login Credentials:');
      console.log(`   Email: ${TEST_EMAIL}`);
      console.log(`   Password: ${TEST_PASSWORD}`);
    }
    
    console.log('\n💡 Next Steps:');
    console.log('1. Start the backend: npm run dev');
    console.log('2. Start the Flutter app');
    console.log('3. Use the credentials above to login');
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
    process.exit(1);
  } finally {
    mongoose.connection.close();
    console.log('\n🔌 Database connection closed');
  }
});
