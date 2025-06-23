// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, default: 'user' },
  branchId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Branch' }] // ใช้ branchId เป็น array
});

module.exports = mongoose.model('User', userSchema);