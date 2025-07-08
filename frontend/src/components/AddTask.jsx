import React, { useState, useEffect } from 'react';
import './AddTask.css';
import axios from 'axios';

const AddTask = ({ onTaskCreated }) => {
  const [status, setStatus] = useState('Todo');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [users, setUsers] = useState([]);
  const [priority, setPriority] = useState('Medium');
  const forbiddenTitles = ['Todo', 'In Progress', 'Done'];

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:4000/api/auth/users', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUsers(res.data);
    };
    fetchUsers();
  }, []);

  const handleSmartAssign = async () => {
    if (forbiddenTitles.includes(title)) {
      alert("Title cannot match column names.");
      return;
    }

    const token = localStorage.getItem('token');
    const taskData = { title, description, priority, status };
    try {
      const res = await axios.post('http://localhost:4000/api/tasks/smart-assign', taskData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onTaskCreated(res.data);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Smart assign failed:', err);
      alert('Smart assign failed');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (forbiddenTitles.includes(title)) {
      alert("Title cannot match column names.");
      return;
    }

    const token = localStorage.getItem('token');
    const newTask = { title, description, assignedTo, priority, status };

    try {
      const res = await axios.post('http://localhost:4000/api/tasks', newTask, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onTaskCreated(res.data);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error('Error creating task:', err);
      alert('Failed to create task');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="add-task-form">
      <input
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        placeholder="Title"
        required
      />
      <input
        type="text"
        value={description}
        onChange={e => setDescription(e.target.value)}
        placeholder="Description"
        required
      />
      <select value={assignedTo} onChange={e => setAssignedTo(e.target.value)} required>
        <option value="">Select user</option>
        {users.map(user => (
          <option key={user._id} value={user._id}>{user.username}</option>
        ))}
      </select>
      <select value={priority} onChange={e => setPriority(e.target.value)}>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select value={status} onChange={e => setStatus(e.target.value)} required>
        <option value="Todo">Todo</option>
        <option value="In Progress">In Progress</option>
        <option value="Done">Done</option>
      </select>

      <div className="form-buttons">
        <button type="button" onClick={handleSmartAssign}>Smart Assign</button>
        <button type="submit">Add Task</button>
      </div>

    </form>
  );
};

export default AddTask;
