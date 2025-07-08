
import React from 'react';
import './TaskCard.css';

const TaskCard = ({ task, provided, onEdit, onDelete }) => {
  return (
    <div
      className="task-card"
      ref={provided.innerRef}
      {...provided.draggableProps}
      {...provided.dragHandleProps}
    >
      <h4>{task.title}</h4>
      <p>{task.description}</p>
      <p><strong>Status:</strong> {task.status}</p>
      <p><strong>Priority:</strong> {task.priority}</p>
      <p><strong>Assigned to:</strong> {task.assignedTo?.username || 'Unassigned'}</p>
       <div className="task-actions">
        <button onClick={() => onEdit(task)}> Edit</button>
        <button onClick={() => onDelete(task._id)}> Delete</button>
      </div>
    </div>
  );
};

export default TaskCard;
