import React, { useEffect, useState } from 'react';
import './ActivityLog.css';
import axios from 'axios';
import io from 'socket.io-client';

const socket = io('http://localhost:4000');

const ActivityLog = () => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    axios.get('http://localhost:4000/api/logs', {
      headers: { Authorization: `Bearer ${token}` }
    }).then(res => {
      if (Array.isArray(res.data)) {
        console.log("Fetched logs:", res.data);
        setLogs(res.data);
      } else {
        console.error('Unexpected logs response:', res.data);
      }
    }).catch(err => {
      console.error("Failed to fetch logs", err);
    });

    socket.on('log-updated', newLog => {
      setLogs(prev => [newLog, ...prev.slice(0, 19)]);
    });

    return () => socket.off('log-updated'); 
  }, []);

  return (
    <div className="log-panel">
      <h4>Activity Log</h4>
      <ul>
        {logs.length > 0 ? (
          logs.map((log, i) => (
           <li key={i}>{`${log.user} ${log.action} ${log.taskTitle}`}</li>
          ))
        ) : (
          <li>No activity yet</li>
        )}
      </ul>
    </div>
  );
};

export default ActivityLog;
