import React, { useState, useEffect, useCallback } from "react";
import Codicon from "../Image/codicon_collapse-all.png";
import Plus from "../Image/plus.png";
import { GoDotFill } from "react-icons/go";
import { FaChevronDown, FaChevronUp } from "react-icons/fa"; // import icons
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Cards.css";
import TaskModel from "./TaskModel";
import axios from "axios";

const Cards = ({ tasks, onAssignTask }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [todoTasks, setTodoTasks] = useState([]);
  const [userId, setUserId] = useState(null);
  const [expandedTaskIndex, setExpandedTaskIndex] = useState(null); // Track expanded checklist
  const [menuVisibleIndex, setMenuVisibleIndex] = useState(null); // Track menu visibility
  const [selectedTask, setSelectedTask] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false); //NEW CODE LINE
  const [selectedTaskId, setSelectedTaskId] = useState(null); //NEW CODE LINE
  const [assignedEmail, setAssignedEmail] = useState(""); //NEW CODE LINE
  const [users, setUsers] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // Memoized fetchTasks function
  const fetchTasks = useCallback(async () => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    console.log("Fetching tasks for User ID:", userId);
    try {
      const response = await axios.get(
        `https://task-app-4-q1f0.onrender.com/api/tasks?userId=${userId}`
      );
      setTodoTasks(response.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
    }
  }, [userId]);

  // Effect to retrieve and set userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    console.log("Stored User ID:", storedUserId);
    setUserId(storedUserId);
  }, []);

  // Effect to call fetchTasks only after userId is set
  useEffect(() => {
    if (userId) {
      fetchTasks();
    }
  }, [userId, fetchTasks]);

  const handleSaveTask = async (taskData) => {
    if (!userId) {
      console.error("User ID is not available.");
      return;
    }

    setIsSaving(true); // Set saving state to true

    try {
      // Check if we are updating an existing task
      if (taskData._id) {
        const response = await axios.put(
          `https://task-app-4-q1f0.onrender.com/api/tasks/${taskData._id}`,
          {
            ...taskData,
            creator: userId,
          }
        );
        const updatedTask = response.data;

        // Update the task in the state without duplicating it
        setTodoTasks((prevTasks) =>
          prevTasks.map((task) =>
            task._id === updatedTask._id ? updatedTask : task
          )
        );
        console.log("Task updated:", updatedTask);
      } else {
        // Creating a new task
        const response = await axios.post("https://task-app-4-q1f0.onrender.com/api/tasks", {
          ...taskData,
          creator: userId,
          status: "to-do",
        });
        const newTask = response.data;

        // Add the new task to the state
        setTodoTasks((prevTasks) => [...prevTasks, newTask]);
        console.log("Task saved:", newTask);
      }

      setIsModalOpen(false); // Close the modal after saving
    } catch (error) {
      console.error("Error saving task:", error);
    } finally {
      setIsSaving(false); // Reset saving state
    }
  };

  const toggleChecklist = (index) => {
    setExpandedTaskIndex(expandedTaskIndex === index ? null : index);
  };

  const handleChecklistToggle = async (taskId, itemIndex) => {
    console.log("Task ID:", taskId);
    console.log("Item Index:", itemIndex);

    const updatedTasks = [...todoTasks];
    console.log("Available tasks:", updatedTasks); // Log available tasks

    const updatedTaskIndex = updatedTasks.findIndex(
      (task) => task._id === taskId // Ensure taskId is in the correct format
    );

    if (updatedTaskIndex === -1) {
      console.error("Task not found for ID:", taskId);
      return;
    }

    const updatedTask = updatedTasks[updatedTaskIndex];
    const checklistItem = updatedTask.checklist[itemIndex];

    // Toggle the `checked` state
    checklistItem.checked = !checklistItem.checked;

    // Update state with the modified checklist item
    setTodoTasks(updatedTasks);

    console.log("Updating checklist for task ID:", updatedTask._id);

    try {
      if (updatedTask._id) {
        await axios.put(`https://task-app-4-q1f0.onrender.com/api/tasks/${updatedTask._id}`, {
          checklist: updatedTask.checklist,
        });
      } else {
        console.error("Task ID is missing.");
      }
    } catch (error) {
      console.error("Error updating checklist:", error);
    }
  };

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      const token = localStorage.getItem("token"); // Get the token
      console.log("Retrieved Token:", token); // Log the retrieved token

      // Check if token is null
      if (!token) {
        console.error("No token found, user may not be logged in.");
        return; // Optionally handle this case
      }

      // Update the task's status on the backend with the token in headers
      await axios.put(
        `https://task-app-4-q1f0.onrender.com/api/tasks/${taskId}`,
        {
          status: newStatus,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the headers
          },
        }
      );

      // Update the task status in the frontend state
      const updatedTasks = todoTasks.map((task) =>
        task._id === taskId ? { ...task, status: newStatus } : task
      );
      setTodoTasks(updatedTasks);

      console.log(`Task ID: ${taskId} moved to ${newStatus.toUpperCase()}`);
    } catch (error) {
      console.error("Error updating task status:", error);
      if (error.response) {
        console.error("Response data:", error.response.data);
      }
    }
  };

  const handleMenuToggle = (taskId) => {
    setMenuVisibleIndex(menuVisibleIndex === taskId ? null : taskId);
  };

  const handleEditClick = (task) => {
    setSelectedTask(task); // Set the task to be edited
    setIsModalOpen(true); // Open the modal
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await axios.delete(`https://task-app-4-q1f0.onrender.com/api/tasks/${taskId}`);
      setTodoTasks(todoTasks.filter((task) => task._id !== taskId));
      console.log(`Task ID: ${taskId} deleted`);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleShare = (taskId) => {
    const shareableLink = `${window.location.origin}/tasks/${taskId}/public`; // Generate the link
    navigator.clipboard
      .writeText(shareableLink) // Copy the link to the clipboard
      .then(() => {
        toast.success("Link copied to clipboard!");
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
      });
  };

  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th"; // Handles 11th to 13th
    switch (day % 10) {
      case 1:
        return "st";
      case 2:
        return "nd";
      case 3:
        return "rd";
      default:
        return "th";
    }
  }

  function formatDateWithSuffix(date) {
    const day = date.getDate();
    const month = date.toLocaleString("en-US", { month: "short" });
    return `${month} ${day}${getOrdinalSuffix(day)}`;
  }

  const handleAssignClick = (taskId) => {
    setSelectedTaskId(taskId);
    setIsAssignModalOpen(true);
  };
  const handleAssignSubmit = () => {
    if (!assignedEmail) {
      alert("Please enter an email to assign the task."); // Better notification can be implemented
      return;
    }
    onAssignTask(selectedTaskId, assignedEmail);
    setIsAssignModalOpen(false);
    setAssignedEmail("");
  };

  // Function to get the first two letters of the assigned user's email
  const getAssignedUserInitials = (assignedToId) => {
    const user = users.find((user) => user.id === assignedToId);
    return user ? user.email.slice(0, 2).toUpperCase() : "";
  };

  return (
    <div className="cards-container">
      <div className="cards-container-backlog">
        <h1>Backlog</h1>
        <img
          src={Codicon}
          alt="collapse"
          className="cards-container-collapse-icon"
          onClick={toggleChecklist}
        />
        {todoTasks
          .filter((task) => task.status === "backlog")
          .map((task, index) => (
            <div
              key={`${task._id}-${index}`}
              className="backlog-task-container"
            >
              <div className="todo-task-header">
                <h2 className="task-priority">
                  <GoDotFill
                    className={`priority-dot ${task.priority.toLowerCase()}`}
                  />
                  {task.priority} PRIORITY
                </h2>

                <div className="task-assignee">
                  {task.assignedTo ? task.assignedTo.slice(0, 2) : "N/A"}
                </div>
                <div
                  className="task-options"
                  onClick={() => handleMenuToggle(task._id)}
                >
                  ...
                  {menuVisibleIndex === task._id && (
                    <div className="task-menu">
                      <div
                        className="task-menu-option"
                        onClick={() => handleEditClick(task)}
                      >
                        Edit
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleShare(task._id)}
                      >
                        Share
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="task-title">{task.title}</div>

              {task.checklist && task.checklist.length > 0 && (
                <div className="task-checklist">
                  Checklist (
                  {task.checklist.filter((item) => item.checked).length}/
                  {task.checklist.length})
                  {expandedTaskIndex === task._id ? (
                    <FaChevronUp
                      className="chevron-icon"
                      onClick={() => toggleChecklist(task._id)}
                    />
                  ) : (
                    <FaChevronDown
                      className="chevron-icon"
                      onClick={() => toggleChecklist(task._id)}
                    />
                  )}
                </div>
              )}

              {expandedTaskIndex === task._id && (
                <ul className="checklist-items">
                  {task.checklist.map((item, i) => (
                    <li key={i} className="checklist-item">
                      <div className="checklist-item-box">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {
                            console.log(
                              "Checkbox clicked for task ID:",
                              task._id
                            ); // Log the task ID
                            handleChecklistToggle(task._id, i); // Ensure the correct task ID is passed
                          }}
                          className="task-model-checkbox"
                        />
                        <span className="task-model-item-text">
                          {item.text}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="todo-task-footer">
                <button
                  className={`task-date ${
                    task.priority === "high" ? "high-priority-date" : ""
                  }`}
                >
                  {formatDateWithSuffix(new Date(task.dueDate))}
                </button>
                <div className="task-status-btn">
                  <button
                    className="task-status backlog"
                    onClick={() => handleStatusChange(task._id, "in-progress")}
                  >
                    PROGRESS
                  </button>
                  <button
                    className="task-status progress"
                    onClick={() => handleStatusChange(task._id, "to-do")}
                  >
                    TO-DO
                  </button>
                  <button
                    className="task-status done"
                    onClick={() => handleStatusChange(task._id, "done")}
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="cards-container-todo">
        <h1>To do</h1>
        <img
          src={Plus}
          alt="plus-sign"
          className="cards-container-plus-icon"
          onClick={() => {
            setSelectedTask(null); // Reset selectedTask
            setIsModalOpen(true); // Open the modal
          }}
        />
        <img
          src={Codicon}
          alt="collapse"
          className="cards-container-collapse-icon"
          onClick={toggleChecklist}
        />

        {todoTasks
          .filter((task) => task.status === "to-do")
          .map((task, index) => (
            <div
              key={task._id} // Use a unique identifier
              className={`todo-task-container ${
                expandedTaskIndex === index ? "expanded" : ""
              }`}
            >
              <div className="todo-task-header">
                <h2 className="task-priority">
                  <GoDotFill
                    className={`priority-dot ${task.priority.toLowerCase()}`}
                  />
                  {task.priority} PRIORITY
                </h2>
                <div className="task-assignee">
                  {task.assignedTo ? task.assignedTo.slice(0, 2) : "N/A"}
                </div>

                <div
                  className="task-options"
                  onClick={() => handleMenuToggle(index)}
                >
                  ...
                  {menuVisibleIndex === index && (
                    <div className="task-menu">
                      <div
                        className="task-menu-option"
                        onClick={() => handleEditClick(task)}
                      >
                        Edit
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleShare(task._id)}
                      >
                        Share
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <div className="task-title">{task.title}</div>

              {task.checklist && task.checklist.length > 0 && (
                <div className="task-checklist">
                  Checklist (
                  {task.checklist.filter((item) => item.checked).length}/
                  {task.checklist.length})
                  {expandedTaskIndex === index ? (
                    <FaChevronUp
                      className="chevron-icon"
                      onClick={() => toggleChecklist(index)}
                    />
                  ) : (
                    <FaChevronDown
                      className="chevron-icon"
                      onClick={() => toggleChecklist(index)}
                    />
                  )}
                </div>
              )}

              {expandedTaskIndex === index && (
                <ul className="checklist-items">
                  {task.checklist.map((item, i) => (
                    <li key={i} className="checklist-item">
                      <div className="checklist-item-box">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {
                            console.log(
                              "Checkbox clicked for task ID:",
                              task._id
                            );
                            handleChecklistToggle(task._id, i); // Ensure the correct task ID is passed
                          }}
                          className="task-model-checkbox"
                        />
                        <span className="task-model-item-text">
                          {item.text}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="todo-task-footer">
                <button
                  className={`task-date ${
                    task.priority === "high" ? "high-priority-date" : ""
                  }`}
                >
                  {formatDateWithSuffix(new Date(task.dueDate))}
                </button>
                <div className="task-status-btn">
                  <button
                    className="task-status backlog"
                    onClick={() => handleStatusChange(task._id, "backlog")}
                  >
                    BACKLOG
                  </button>
                  <button
                    className="task-status progress"
                    onClick={() => handleStatusChange(task._id, "in-progress")}
                  >
                    PROGRESS
                  </button>
                  <button
                    className="task-status done"
                    onClick={() => handleStatusChange(task._id, "done")}
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="cards-container-progress">
        <h1>In progress</h1>
        <img
          src={Codicon}
          alt="collapse"
          className="cards-container-collapse-icon"
          onClick={toggleChecklist}
        />
        {todoTasks
          .filter((task) => task.status === "in-progress")
          .map((task, index) => (
            <div
              key={`${task._id}-${index}`}
              className="progress-task-container"
            >
              <div className="todo-task-header">
                <h2 className="task-priority">
                  <GoDotFill
                    className={`priority-dot ${task.priority.toLowerCase()}`}
                  />
                  {task.priority} PRIORITY
                </h2>

                <div className="task-assignee">
                  {task.assignedTo ? task.assignedTo.slice(0, 2) : "N/A"}
                </div>

                <div
                  className="task-options"
                  onClick={() => handleMenuToggle(task._id)}
                >
                  ...
                  {menuVisibleIndex === task._id && (
                    <div className="task-menu">
                      <div
                        className="task-menu-option"
                        onClick={() => handleEditClick(task)}
                      >
                        Edit
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleShare(task._id)}
                      >
                        Share
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="task-title">{task.title}</div>

              {task.checklist && task.checklist.length > 0 && (
                <div className="task-checklist">
                  Checklist (
                  {task.checklist.filter((item) => item.checked).length}/
                  {task.checklist.length})
                  {expandedTaskIndex === task._id ? (
                    <FaChevronUp
                      className="chevron-icon"
                      onClick={() => toggleChecklist(task._id)}
                    />
                  ) : (
                    <FaChevronDown
                      className="chevron-icon"
                      onClick={() => toggleChecklist(task._id)}
                    />
                  )}
                </div>
              )}

              {expandedTaskIndex === task._id && (
                <ul className="checklist-items">
                  {task.checklist.map((item, i) => (
                    <li key={i} className="checklist-item">
                      <div className="checklist-item-box">
                        <input
                          type="checkbox"
                          checked={item.checked}
                          onChange={() => {
                            console.log(
                              "Checkbox clicked for task ID:",
                              task._id
                            ); // Log the task ID
                            handleChecklistToggle(task._id, i); // Ensure the correct task ID is passed
                          }}
                          className="task-model-checkbox"
                        />
                        <span className="task-model-item-text">
                          {item.text}
                        </span>
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="todo-task-footer">
                <button
                  className={`task-date ${
                    task.priority === "high" ? "high-priority-date" : ""
                  }`}
                >
                  {formatDateWithSuffix(new Date(task.dueDate))}
                </button>
                <div className="task-status-btn">
                  <button
                    className="task-status backlog"
                    onClick={() => handleStatusChange(task._id, "backlog")}
                  >
                    BACKLOG
                  </button>
                  <button
                    className="task-status progress"
                    onClick={() => handleStatusChange(task._id, "to-do")}
                  >
                    TO-DO
                  </button>
                  <button
                    className="task-status done"
                    onClick={() => handleStatusChange(task._id, "done")}
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <div className="cards-container-done">
        <h1>Done</h1>
        <img
          src={Codicon}
          alt="collapse"
          className="cards-container-collapse-icon"
          onClick={toggleChecklist}
        />
        {todoTasks
          .filter((task) => task.status === "done")
          .map((task, index) => (
            <div key={`${task._id}-${index}`} className="done-task-container">
              <div className="todo-task-header">
                <h2 className="task-priority">
                  <GoDotFill
                    className={`priority-dot ${task.priority.toLowerCase()}`}
                  />
                  {task.priority} PRIORITY
                </h2>
                <div
                  className="task-options"
                  onClick={() => handleMenuToggle(task._id)}
                >
                  ...
                  {menuVisibleIndex === task._id && (
                    <div className="task-menu">
                      <div
                        className="task-menu-option"
                        onClick={() => handleEditClick(task)}
                      >
                        Edit
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleShare(task._id)}
                      >
                        Share
                      </div>
                      <div
                        className="task-menu-option"
                        onClick={() => handleDeleteTask(task._id)}
                      >
                        Delete
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="task-title">{task.title}</div>

              {task.checklist && task.checklist.length > 0 && (
                <div className="task-checklist">
                  Checklist (
                  {task.checklist.filter((item) => item.checked).length}/
                  {task.checklist.length})
                  {expandedTaskIndex === task._id ? (
                    <FaChevronUp
                      className="chevron-icon"
                      onClick={() => toggleChecklist(task._id)}
                    />
                  ) : (
                    <FaChevronDown
                      className="chevron-icon"
                      onClick={() => toggleChecklist(task._id)}
                    />
                  )}
                </div>
              )}

              {expandedTaskIndex === task._id && (
                <ul className="checklist-items">
                  {task.checklist.map((item, i) => (
                    <li key={i} className="checklist-item">
                      <input
                        type="checkbox"
                        checked={item.checked}
                        onChange={() => {
                          console.log(
                            "Checkbox clicked for task ID:",
                            task._id
                          ); // Log the task ID
                          handleChecklistToggle(task._id, i); // Ensure the correct task ID is passed
                        }}
                        className="task-model-checkbox"
                      />
                      <span className="task-model-item-text">{item.text}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="todo-task-footer">
                <button
                  className={`task-date ${
                    task.priority === "high" ? "high-priority-date" : ""
                  } ${task.status === "done" ? "done-date" : ""}`}
                >
                  {formatDateWithSuffix(new Date(task.dueDate))}
                </button>
                <div className="task-status-btn">
                  <button
                    className="task-status backlog"
                    onClick={() => handleStatusChange(task._id, "backlog")}
                  >
                    BACKLOG
                  </button>
                  <button
                    className="task-status progress"
                    onClick={() => handleStatusChange(task._id, "in-progress")}
                  >
                    PROGRESS
                  </button>
                  <button
                    className="task-status done"
                    onClick={() => handleStatusChange(task._id, "done")}
                  >
                    DONE
                  </button>
                </div>
              </div>
            </div>
          ))}
      </div>

      <TaskModel
        isOpen={isModalOpen}
        taskData={selectedTask || { title: "", priority: "", checklist: [] }} // Provide default empty data if null
        onSave={handleSaveTask}
        onClose={() => setIsModalOpen(false)}
      />

      <ToastContainer />
    </div>
  );
};

export default Cards;
