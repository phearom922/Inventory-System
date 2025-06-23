// backend/server.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const lotRoutes = require('./routes/lotRoutes');
const warehouseRoutes = require('./routes/warehouseRoutes');
const wasteRoutes = require('./routes/wasteRoutes');
const transactionRoutes = require('./routes/transactionRoutes');
const branchRoutes = require('./routes/branchRoutes');

dotenv.config();
const app = express();

// Middleware CORS
const corsOptions = {
  origin: 'http://localhost:5173', // ปรับให้ตรงกับ port Frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Authorization', 'Content-Type'],
  credentials: true
};
app.use(cors(corsOptions));
app.options('*', cors(corsOptions));

app.use(express.json());

// Routes
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/lots', lotRoutes);
app.use('/api/warehouses', warehouseRoutes);
app.use('/api/waste', wasteRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/branches', branchRoutes);

// Error Handling
app.use((err, req, res, next) => {
  console.error('[Server Error]:', err.stack);
  res.status(500).json({ message: 'Internal server error' });
});

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));