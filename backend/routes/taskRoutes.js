
// routes/taskRoutes.js
const express = require('express');
const Task = require('../models/Task');
const Log = require('../models/Log');
const router = express.Router();
const User = require('../models/User');


module.exports = (io) => {

  router.get('/', async (req, res) => {
    const tasks = await Task.find().populate('assignedTo');
    res.json(tasks);
  });

  router.post('/', async (req, res) => {
  try {
    const forbidden = ['Todo', 'In Progress', 'Done'];
    const existing = await Task.findOne({ title: req.body.title });

    if (existing || forbidden.includes(req.body.title)) {
      return res.status(400).json({ message: 'Title must be unique and not match column names' });
    }

    const task = await Task.create(req.body);
    await Log.create({
      action: 'Created',
      taskTitle: task.title,
      user: task.assignedTo
    });

    io.emit('task-created', task);
    res.status(201).json(task);
  } catch (err) {
    console.error('Error creating task:', err);
    res.status(500).json({ message: 'Server error' });
  }
});


  router.put('/:id', async (req, res) => {
    const { updatedAt: clientTimestamp } = req.body;
    const existingTask = await Task.findById(req.params.id);

    if (new Date(clientTimestamp).getTime() !== new Date(existingTask.updatedAt).getTime()) {
      return res.status(409).json({
        message: 'Conflict detected',
        current: existingTask,
        attempted: req.body
      });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    await Log.create({
      action: 'Updated',
      taskTitle: updatedTask.title,
      user: updatedTask.assignedTo
    });
    io.emit('task-updated', updatedTask);
    res.json(updatedTask);
  });


  router.delete('/:id', async (req, res) => {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    await Log.create({
      action: 'Deleted',
      taskTitle: task.title,
      user: task.assignedTo
    });

    io.emit('task-deleted', task);
    res.status(204).end();
  });

  router.post('/smart-assign', async (req, res) => {
    try {
      const forbidden = ['Todo', 'In Progress', 'Done'];
      if (forbidden.includes(req.body.title)) {
        return res.status(400).json({ message: 'Invalid title' });
      }

      const existing = await Task.findOne({ title: req.body.title });
      if (existing) {
        return res.status(400).json({ message: 'Task title already exists' });
      }

      const users = await User.find();
      const taskCounts = await Promise.all(users.map(async user => {
        const count = await Task.countDocuments({ assignedTo: user._id, status: { $ne: 'Done' } });
        return { userId: user._id, count };
      }));

      const leastBusy = taskCounts.reduce((min, u) => u.count < min.count ? u : min, taskCounts[0]);
      const task = await Task.create({ ...req.body, assignedTo: leastBusy.userId });

      await Log.create({
        action: 'Smart Assigned',
        taskTitle: task.title,
        user: leastBusy.userId
      });

      io.emit('task-created', task);
      res.status(201).json(task);
    } catch (error) {
      console.error("Smart assign error:", error);
      res.status(500).json({ message: "Smart assign failed" });
    }
  });

  return router;
};
