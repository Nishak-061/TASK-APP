import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Ellipse from "../Image/Ellipse.png";
import "./Analytics.css";

const Analytics = () => {
  const [taskCounts, setTaskCounts] = useState({
    backlog: 0,
    todo: 0,
    inProgress: 0,
    done: 0,
    lowPriority: 0,
    moderatePriority: 0,
    highPriority: 0,
    dueDateTasks: 0,
  });

  // Function to fetch tasks from the backend
  const fetchTasks = async () => {
    try {
      // Retrieve userId and token from localStorage
      const userId = localStorage.getItem('userId');
      const token = localStorage.getItem('token');
  
      if (!userId || !token) {
        console.error("User ID or token missing");
        return;
      }
  
      
      // Make the GET request with the creator parameter and Authorization header
      const response = await axios.get(`https://task-application-03me.onrender.com/api/tasks?creator=${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tasks = response.data;
  
      console.log("Tasks fetched:", tasks);
  
      const counts = {
        backlog: 0,
        todo: 0,
        inProgress: 0,
        done: 0,
        lowPriority: 0,
        moderatePriority: 0,
        highPriority: 0,
        dueDateTasks: 0,
      };
  
      tasks.forEach((task) => {
        if (task.status === 'backlog') counts.backlog += 1;
        if (task.status === 'to-do') counts.todo += 1;
        if (task.status === 'in-progress') counts.inProgress += 1;
        if (task.status === 'done') counts.done += 1;
  
        if (task.priority === 'low') counts.lowPriority += 1;
        if (task.priority === 'medium') counts.moderatePriority += 1;
        if (task.priority === 'high') counts.highPriority += 1;
  
        if (task.dueDate) counts.dueDateTasks += 1;
      });
  
      console.log("Counts after calculation:", counts);
      setTaskCounts(counts);
  
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  };
  
  

  // Fetch tasks when the component loads
  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div className='analytics-container'>
      <h1 className='analytics-header'>Analytics</h1>

      <div className='analytics-tasks-priority-container'>
        <div className='analytics-task-container'>
          <h1 className='analytics-task-item'>
            <img src={Ellipse} alt='Backlog' /><span>Backlog Tasks</span>  <span className='analytics-task-counts'>{taskCounts.backlog}</span> 
          </h1>
          <h1 className='analytics-task-item'>
            <img src={Ellipse} alt='To-do' /> <span>To-do Tasks</span> <span className='analytics-task-counts'>{taskCounts.todo}</span>
          </h1>
          <h1 className='analytics-task-item'>
            <img src={Ellipse} alt='In-progress' /> <span>In-Progress Tasks</span> <span className='analytics-task-counts'>{taskCounts.inProgress}</span>
          </h1>
          <h1 className='analytics-task-item'>
            <img src={Ellipse} alt='Completed' /> <span>Completed Tasks</span> <span className='analytics-task-counts'>{taskCounts.done}</span>
          </h1>
        </div>

        <div className='analytics-priority-container'>
          <h1 className='analytics-priority-item'>
            <img src={Ellipse} alt='Low' /> <span>Low Priority </span> <span className='analytics-task-counts'>{taskCounts.lowPriority}</span>
          </h1>
          <h1 className='analytics-priority-item'>
            <img src={Ellipse} alt='Moderate' /><span>Moderate Priority</span> <span className='analytics-task-counts'>{taskCounts.moderatePriority}</span>
          </h1>
          <h1 className='analytics-priority-item'>
            <img src={Ellipse} alt='High' /> <span>High Priority</span> <span className='analytics-task-counts'>{taskCounts.highPriority}</span>
          </h1>
          <h1 className='analytics-priority-item'>
            <img src={Ellipse} alt='Due Date' /> <span>Due Date Tasks</span> <span className='analytics-task-counts'>{taskCounts.dueDateTasks}</span>
          </h1>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
