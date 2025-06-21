// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const lotRoutes = require('./routes/lotRoutes'); // ตรวจสอบว่า import ถูกต้อง
const warehouseRoutes = require('./routes/warehouseRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const transactionRoutes = require('./routes/transactionRoutes');

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lots', lotRoutes); // ตรวจสอบว่า row นี้มี
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/transactions', transactionRoutes);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));