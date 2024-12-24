import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const PublicTaskView = () => {
    const { id } = useParams();
    const [task, setTask] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    useEffect(() => {
      const fetchTask = async () => {
        try {
          const response = await axios.get(`https://task-app-4-q1f0.onrender.com/api/tasks/${id}/public`);
          setTask(response.data);
        } catch (error) {
          console.error('Error fetching task:', error);
          setError('Error fetching task.');
        } finally {
          setLoading(false);
        }
      };
  
      fetchTask();
    }, [id]);
  
    if (loading) {
      return <div>Loading...</div>;
    }
  
    if (error) {
      return <div>{error}</div>;
    }
  
    if (!task) {
      return <div>Task not found.</div>;
    }
  
    return (
      <div>
        <h2>{task.title}</h2>
        <p>Priority: {task.priority}</p>
        <p>Due Date: {task.dueDate}</p>
        <h3>Checklist:</h3>
        <ul>
          {task.checklist.map((item) => (
            <li key={item._id}>
              <input type="checkbox" checked={item.checked} readOnly />
              {item.text}
            </li>
          ))}
        </ul>
        <p>Created by: {task.creator}</p>
      </div>
    );
  };
  
  export default PublicTaskView;
  
