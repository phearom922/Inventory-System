const mongoose = require('mongoose');
   const User = require('./models/User');
   const Warehouse = require('./models/Warehouse');
   const Product = require('./models/Product');
   const Lot = require('./models/Lot');
   const Branch = require('./models/Branch');

   mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/inventory', {
     useNewUrlParser: true,
     useUnifiedTopology: true
   }).then(async () => {
     console.log('Connected to MongoDB for clearing data');

     await User.deleteMany({});
     await Warehouse.deleteMany({});
     await Product.deleteMany({});
     await Lot.deleteMany({});
     await Branch.deleteMany({});

     console.log('All data cleared successfully');
     mongoose.connection.close();
   }).catch(err => {
     console.error('Error clearing data:', err);
     mongoose.connection.close();
   });