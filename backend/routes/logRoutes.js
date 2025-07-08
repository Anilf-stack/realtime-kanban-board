const express = require('express');
const router = express.Router();
const Log = require('../models/Log');

router.get('/', async (req, res) => {
  const logs = await Log.find()
    .sort({ timestamp: -1 })
    .limit(20)
    .populate('user', 'username');

  const formatted = logs.map(log => ({
    user: log.user?.username || 'Unknown',
    action: log.action,
    taskTitle: log.taskTitle,
    timestamp: log.timestamp
  }));

  res.json(formatted);
});

module.exports = router;
