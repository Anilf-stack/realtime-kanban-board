import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Register from './pages/Register';
import KanbanBoard from './components/KanbanBoard';


const App = () => (
  <Routes>
    <Route path="/" element={<Login />} />
    <Route path="/register" element={<Register />} />
    <Route path="/KanbanBoard" element={<KanbanBoard/>} />
  </Routes>
);

export default App;

