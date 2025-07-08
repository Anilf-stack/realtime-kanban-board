import React, { useEffect, useState } from 'react';
import './KanbanBoard.css';
import EditTaskModal from './EditTaskModal';
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import axios from 'axios';
import io from 'socket.io-client';
import TaskCard from './TaskCard';
import AddTask from './AddTask';
import ActivityLog from './ActivityLog';

const socket = io('http://localhost:4000');

const KanbanBoard = () => {
  const [columns, setColumns] = useState({ Todo: [], 'In Progress': [], Done: [] });
  const [editingTask, setEditingTask] = useState(null);


  const handleEdit = (task) => {
  setEditingTask(task);
};

const handleSaveEdit = async (updatedTask) => {
  const token = localStorage.getItem('token');
  await axios.put(`http://localhost:4000/api/tasks/${updatedTask._id}`, updatedTask, {
    headers: { Authorization: `Bearer ${token}` }
  });

  setEditingTask(null);
};

  const handleTaskCreated = (newTask) => {
    setColumns(prev => {
      const updated = { ...prev };
      updated[newTask.status].push(newTask);
      return updated;
    });
  };

  const handleDelete = async (taskId) => {
  const token = localStorage.getItem('token');
  try {
    await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    setColumns(prev => {
      const updated = { ...prev };
      for (const col in updated) {
        updated[col] = updated[col].filter(t => t._id !== taskId);
      }
      return updated;
    });
  } catch (err) {
    console.error("Failed to delete task:", err);
  }
};


  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/api/tasks', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (Array.isArray(res.data)) {
        const tasks = { Todo: [], 'In Progress': [], Done: [] };
        res.data.forEach(task => tasks[task.status].push(task));
        setColumns(tasks);
      } else {
        console.error('Unexpected tasks response:', res.data);
      }
    }).catch(err => {
      console.error("Failed to fetch tasks", err);
    });
  }, []);

  useEffect(() => {
    socket.on('task-updated', task => {
      setColumns(prev => {
        const tasks = { Todo: [], 'In Progress': [], Done: [] };
        Object.values(prev).flat().forEach(t => {
          if (t._id !== task._id) tasks[t.status].push(t);
        });
        tasks[task.status].push(task);
        return tasks;
      });
    });
  }, []);

  const onDragEnd = async ({ source, destination }) => {
    if (!destination || source.droppableId === destination.droppableId) return;
    const task = columns[source.droppableId][source.index];
    const updatedTask = { ...task, status: destination.droppableId };
    const token = localStorage.getItem('token');
    await axios.put(`http://localhost:4000/api/tasks/${task._id}`, updatedTask, {
      headers: { Authorization: `Bearer ${token}` }
    });
  };

return (
  <div className="board-wrapper">
    <div className="top-section">
      <AddTask onTaskCreated={handleTaskCreated} />
    </div>

    <DragDropContext onDragEnd={onDragEnd}>
      <div className="columns-container">
        {Object.entries(columns).map(([col, tasks]) => (
          <Droppable droppableId={col} key={col}>
            {(provided) => (
              <div className="column" ref={provided.innerRef} {...provided.droppableProps}>
                <h3>{col}</h3>
                {tasks.map((task, i) => (
                  <Draggable key={task._id} draggableId={task._id} index={i}>
                    {(provided) => (
                      <TaskCard
                        task={task}
                        provided={provided}
                        onEdit={handleEdit}        
                        onDelete={handleDelete}    
                      />
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        ))}
      </div>
    </DragDropContext>

    <div className="log-section">
      <ActivityLog />
    </div>
    {editingTask && (
      <EditTaskModal
        task={editingTask}
        onSave={handleSaveEdit}
        onClose={() => setEditingTask(null)}
      />
    )}
  </div>
);

};

export default KanbanBoard;
