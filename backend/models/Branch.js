  // models/Branch.js
const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({
  name: { type: String, required: true },
  location: { type: String, required: true }
});

module.exports = mongoose.model('Branch', branchSchema);