#!/usr/bin/env node

const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const readline = require('readline');

dotenv.config();

const mongoURI = process.env.MONGODB_URI;

if (!mongoURI) {
  console.error('❌ Error: MONGODB_URI is not set in .env file');
  console.log('\n📋 Setup Instructions:');
  console.log('1. Copy .env.example to .env');
  console.log('2. Update MONGODB_URI with your MongoDB connection string');
  process.exit(1);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const question = (query) => new Promise((resolve) => rl.question(query, resolve));

async function connectDB() {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Connected to MongoDB\n');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    return false;
  }
}

async function createTestUser() {
  const name = await question('📝 Name (default: Test User): ');
  const email = await question('📧 Email (default: test@example.com): ');
  const password = await question('🔒 Password (default: test1234): ');

  const testName = name || 'Test User';
  const testEmail = email || 'test@example.com';
  const testPassword = password || 'test1234';

  try {
    const existingUser = await User.findOne({ email: testEmail });
    
    if (existingUser) {
      console.log(`\n⚠️  User with email "${testEmail}" already exists!`);
      return;
    }

    const testUser = new User({
      name: testName,
      email: testEmail,
      password: testPassword,
    });
    
    await testUser.save();
    console.log('\n✅ Test user created successfully!');
    console.log(`📧 Email: ${testEmail}`);
    console.log(`🔒 Password: ${testPassword}`);
  } catch (error) {
    console.error('❌ Error creating test user:', error.message);
  }
}

async function listUsers() {
  try {
    const users = await User.find({}).select('-password');
    if (users.length === 0) {
      console.log('\n📭 No users found');
      return;
    }
    console.log('\n📋 Users in database:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });
  } catch (error) {
    console.error('❌ Error listing users:', error.message);
  }
}

async function deleteUser() {
  try {
    const users = await User.find({}).select('-password');
    if (users.length === 0) {
      console.log('\n📭 No users found');
      return;
    }
    
    console.log('\n📋 Users:');
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.name} (${user.email})`);
    });
    
    const choice = await question('\n🗑️  Enter user number to delete: ');
    const index = parseInt(choice) - 1;
    
    if (index < 0 || index >= users.length) {
      console.log('❌ Invalid selection');
      return;
    }
    
    const confirm = await question(`⚠️  Delete "${users[index].name}"? (yes/no): `);
    if (confirm.toLowerCase() === 'yes') {
      await User.deleteOne({ _id: users[index]._id });
      console.log('✅ User deleted successfully');
    } else {
      console.log('❌ Deletion cancelled');
    }
  } catch (error) {
    console.error('❌ Error deleting user:', error.message);
  }
}

async function main() {
  const connected = await connectDB();
  if (!connected) {
    rl.close();
    process.exit(1);
  }

  console.log('🍽️  Heritage Recipe App - User Management\n');
  console.log('1. Create test user');
  console.log('2. List all users');
  console.log('3. Delete user');
  console.log('4. Exit\n');

  const choice = await question('Choose an option: ');

  switch (choice) {
    case '1':
      await createTestUser();
      break;
    case '2':
      await listUsers();
      break;
    case '3':
      await deleteUser();
      break;
    case '4':
      console.log('\n👋 Goodbye!');
      break;
    default:
      console.log('❌ Invalid option');
  }

  rl.close();
  mongoose.connection.close();
}

main().catch((error) => {
  console.error('❌ Error:', error);
  process.exit(1);
});
