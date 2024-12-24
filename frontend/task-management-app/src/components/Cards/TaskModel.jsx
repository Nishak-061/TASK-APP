import React, { useEffect, useState } from "react";
import { CgAsterisk } from "react-icons/cg";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { GoDotFill } from "react-icons/go";
import axios from "axios";
import "./TaskModel.css";

const TaskModel = ({ isOpen, onClose, onSave, taskData }) => {
  const [title, setTitle] = useState("");
  const [priority, setPriority] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [checklist, setChecklist] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);

  // Set initial state when the modal opens
  useEffect(() => {
    if (isOpen && taskData) {
      setTitle(taskData.title || "");
      setPriority(taskData.priority || "");
      setDueDate(taskData.dueDate || "");
      setChecklist(taskData.checklist || []);
      setSelectedUser(taskData.assignedTo || null);
    }
  }, [isOpen, taskData]);

  const fetchUsers = async () => {
    try {
      console.log("Fetching users from the database..."); // Log before fetching
      const response = await axios.get("https://task-app-4-q1f0.onrender.com/api/auth/users", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Ensure you are passing the token
        },
      });
      console.log("Users fetched successfully:", response.data); // Log after fetching
      setUsers(response.data);
    } catch (error) {
      console.error("Error fetching users:", error); // Log the error if fetching fails
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleDropdown = () => {
    console.log("Dropdown toggled");
    setShowDropdown(!showDropdown);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    setShowDropdown(false);
  };

  // Function to add new checklist item
  const addChecklistItem = () => {
    setChecklist([...checklist, { text: "", checked: false }]);
  };

  // Function to handle checklist item change
  const handleChecklistChange = (index, text) => {
    const newChecklist = [...checklist];
    newChecklist[index].text = text;
    setChecklist(newChecklist);
  };

  // Function to handle priority selection
  const handlePriorityChange = (priority) => setPriority(priority);

  // Function to handle due date change
  const handleDueDateChange = (event) => {
    const date = new Date(event.target.value);
    const formattedDate = date.toLocaleDateString("en-US"); // MM/DD/YYYY format
    setDueDate(formattedDate);
  };

  // Function to handle task save
  const handleSave = () => {
    const taskData = {
      title,
      priority,
      dueDate,
      checklist,
      assignedTo: selectedUser ? selectedUser._id : null, // Include assigned user's ID if selected
    };
    onSave(taskData); // Pass task data with the assigned user to parent component
    onClose(); // Close the modal after saving
  };

  const handleChecklistToggle = (index) => {
    const newChecklist = [...checklist];
    newChecklist[index].checked = !newChecklist[index].checked;
    setChecklist(newChecklist);
  };

  // Function to count checked items
  const getCheckedItemCount = () =>
    checklist.filter((item) => item.checked).length;

  if (!isOpen) return null;

  const getInitials = (name, email) => {
    let initials = "";

    if (name) {
      const nameParts = name.split(" ");
      if (nameParts.length === 1) {
        initials = nameParts[0].substring(0, 2).toUpperCase(); // First two letters of a single name
      } else if (nameParts.length > 1) {
        initials = (nameParts[0][0] + nameParts[1][0]).toUpperCase(); // First letters of first and last names
      }
    } else if (email) {
      // If name is not provided, get initials from the email before the '@' symbol
      const emailName = email.split("@")[0];
      initials = emailName.substring(0, 2).toUpperCase(); // First two letters of the email name
    }

    return initials;
  };

  return (
    <div className="task-model-container">
      <div className="task-model-pop-up">
        <div className="task-model-heading">
          <h1 className="task-model-title">Title</h1>
          <CgAsterisk className="task-model-asterisk" />
        </div>
        <div className="task-model-input-boxes">
          <input
            type="text"
            placeholder="Enter Task Title"
            className="task-model-input-text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="task-model-priority">
          <h1 className="task-model-priorty-text">
            Select Priority
            <CgAsterisk className="task-model-asterisk-priority" />
          </h1>

          <div className="task-model-priority-button">
            <button
              onClick={() => handlePriorityChange("high")}
              className={`task-model-high-priority btn ${
                priority === "high" ? "selected" : ""
              }`}
            >
              <GoDotFill className="task-model-high-dot" />
              HIGH PRIORITY
            </button>
            <button
              onClick={() => handlePriorityChange("medium")}
              className={`task-model-moderate-priority btn ${
                priority === "medium" ? "selected" : ""
              }`}
            >
              <GoDotFill className="task-model-moderate-dot" />
              MODERATE PRIORITY
            </button>
            <button
              onClick={() => handlePriorityChange("low")}
              className={`task-model-low-priority btn ${
                priority === "low" ? "selected" : ""
              }`}
            >
              <GoDotFill className="task-model-low-dot" />
              LOW PRIORITY
            </button>
          </div>
        </div>

        <div className="task-model-assign-container">
          <h1 className="task-model-assign-heading">Assign to</h1>
          <div className="task-model-assign-input" onClick={toggleDropdown}>
            {selectedUser ? selectedUser.email : "Select a user"}
          </div>
          {showDropdown && (
            <div className="task-model-dropdown">
              {users.map((user) => (
                <div
                  key={user._id} // Ensure that user._id exists and is unique
                  className="task-model-dropdown-option"
                >
                  <div className="user-initials">{getInitials(user.email)}</div>
                  <span className="user-email">{user.email}</span>
                  <button
                    className="task-model-dropdown-assign-btn"
                    onClick={() => handleUserSelect(user)}
                  >
                    Assign
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="task-model-priority-checklist">
          <h1 className="task-model-checklist">
            Checklist ({getCheckedItemCount()}/{checklist.length}){" "}
            <CgAsterisk className="task-model-asterisk-checklist" />
          </h1>
        </div>

        {checklist.map((item, index) => (
          <div key={index} className="checklist-item">
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleChecklistChange(index, e.target.value)}
              placeholder="Checklist item"
              className="task-model-checklist-item"
            />
            <input
              type="checkbox"
              checked={item.checked}
              onChange={() => handleChecklistToggle(index)}
              className="task-model-checkbox"
            />
            <FaTrash
              onClick={() =>
                setChecklist(checklist.filter((_, i) => i !== index))
              }
              className="task-model-trash"
            />
          </div>
        ))}

        <div className="task-model-add-new">
          <button onClick={addChecklistItem} className="task-model-add-new-btn">
            <FaPlus /> Add New
          </button>
        </div>

        <div className="task-model-below-container">
          <input
            type="date"
            className="task-model-due-date-btn"
            value={dueDate ? new Date(dueDate).toISOString().split("T")[0] : ""}
            onChange={handleDueDateChange}
            placeholder="Select Due Date"
          />
          <div className="task-model-cancel-save-button">
            <button onClick={onClose} className="task-model-cancel-btn">
              Cancel
            </button>
            <button onClick={handleSave} className="task-model-save-btn">
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskModel;
