
const mongoose = require("mongoose");

const LogSchema = new mongoose.Schema({
  action: String,
  taskTitle: String,
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Log', LogSchema);
