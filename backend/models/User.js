// -------------------- models/User.js --------------------
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  files: [String], // changed from `photos` to more generic `files`
});

module.exports = mongoose.model('User', userSchema);
