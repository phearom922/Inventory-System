const mongoose = require('mongoose');
  const bcrypt = require('bcryptjs');
  const User = require('./models/User');
  const Branch = require('./models/Branch');

  mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory', {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }).then(async () => {
    console.log('Connected to MongoDB for seeding users');

    // สร้าง Branch ถ้ายังไม่มี
    const [pnh01, kcm01] = await Branch.find().lean() || await Branch.insertMany([
      { branchId: 'PNH01', name: 'Phnom Penh Branch', location: 'Phnom Penh, Cambodia' },
      { branchId: 'KCM01', name: 'Kuching Branch', location: 'Kuching, Malaysia' }
    ]);

    // สร้าง Admin
    const adminPassword = await bcrypt.hash('admin123', 10);
    await User.create({
      username: 'Admin',
      password: adminPassword,
      role: 'admin',
      branchId: [pnh01._id, kcm01._id]
    });

    // สร้าง User
    const userPassword = await bcrypt.hash('user123', 10);
    await User.create({
      username: 'pnh01-user',
      password: userPassword,
      role: 'user',
      branchId: [pnh01._id]
    });
    await User.create({
      username: 'kcm01-user',
      password: userPassword,
      role: 'user',
      branchId: [kcm01._id]
    });

    console.log('Users seeded successfully');
    mongoose.connection.close();
  }).catch(err => {
    console.error('Seeding failed:', err);
    mongoose.connection.close();
  });