const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], required: true },
  branchId: { type: [mongoose.Schema.Types.ObjectId], ref: 'Branch', required: true }
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);