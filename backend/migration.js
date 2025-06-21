const mongoose = require('mongoose');
     const Branch = require('./models/Branch');
     const User = require('./models/User');
     const Warehouse = require('./models/Warehouse');
     const Product = require('./models/Product');

     mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory', {
       useNewUrlParser: true,
       useUnifiedTopology: true
     }).then(async () => {
       console.log('Connected to MongoDB for migration');

       const branches = await Branch.insertMany([
         { branchId: 'PNH01', name: 'Phnom Penh Branch', location: 'Phnom Penh, Cambodia' },
         { branchId: 'KCM01', name: 'Kuching Branch', location: 'Kuching, Malaysia' }
       ]);
       const branchMap = {};
       branches.forEach(branch => {
         branchMap[branch.branchId] = branch._id;
       });
       console.log('Branches created:', branchMap);

       await User.updateMany({ role: 'admin' }, { branchId: [branchMap['PNH01'], branchMap['KCM01']] }, { upsert: true });
       await User.updateMany({ username: 'pnh01-user' }, { branchId: [branchMap['PNH01']] }, { upsert: true });
       await User.updateMany({ username: 'kcm01-user' }, { branchId: [branchMap['KCM01']] }, { upsert: true });
       console.log('Users updated');

       console.log('Migration completed');
       mongoose.connection.close();
     }).catch(err => {
       console.error('Migration failed:', err);
       mongoose.connection.close();
     });