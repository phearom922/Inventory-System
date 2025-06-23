// backend/seedUsers.js
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User');
const Branch = require('./models/Branch');

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(async () => {
  console.log('Connected to MongoDB for seeding users');

  // ตรวจสอบและสร้าง Branch
  const existingBranches = await Branch.find().lean();
  let branches;
  if (existingBranches.length === 0) {
    branches = await Branch.insertMany([
      { name: 'Phnom Penh Branch', location: 'Phnom Penh, Cambodia' },
      { name: 'Kuching Branch', location: 'Kuching, Malaysia' }
    ]);
    console.log('Branches created:', branches);
  } else {
    branches = existingBranches;
    console.log('Branches already exist:', branches);
  }

  // สร้าง Admin
  const adminPassword = await bcrypt.hash('admin123', 10);
  await User.create({
    username: 'Admin',
    password: adminPassword,
    role: 'admin',
    branchIds: branches.map(branch => branch._id) // ใช้ branchIds เป็น array ของ _id
  });

  // สร้าง User
  const userPassword = await bcrypt.hash('user123', 10);
  await User.create({
    username: 'pnh01-user',
    password: userPassword,
    role: 'user',
    branchIds: [branches.find(b => b.name === 'Phnom Penh Branch')._id]
  });
  await User.create({
    username: 'kcm01-user',
    password: userPassword,
    role: 'user',
    branchIds: [branches.find(b => b.name === 'Kuching Branch')._id]
  });

  console.log('Users seeded successfully');
  mongoose.connection.close();
}).catch(err => {
  console.error('Seeding failed:', err);
  mongoose.connection.close();
});