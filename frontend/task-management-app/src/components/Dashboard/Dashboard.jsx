import React, { useEffect, useState } from "react";
import { GoPeople } from "react-icons/go";
import Cards from "../Cards/Cards";
import "./Dashboard.css";

const Dashboard = () => {
  const [username, setUsername] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [email, setEmail] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("This Week");
  const [userId, setUserId] = useState(""); // State for user ID
  const [tasks, setTasks] = useState([]); // State to hold tasks
  const [creatorId, setCreatorId] = useState(localStorage.getItem("userId"));

  useEffect(() => {
    // Retrieve the username from local storage
    const storedUsername = localStorage.getItem("username");
    const storedUserId = localStorage.getItem("userId"); // Retrieve user ID
    console.log("Stored User ID:", storedUserId); // Debug log
    if (storedUsername) {
      setUsername(storedUsername);
    }

    if (storedUserId) {
      setUserId(storedUserId); // Set user ID in state
    }
    // Fetch tasks when the component mounts
    fetchTasks(storedUserId);
  }, []);

  const fetchTasks = async () => {
    const userId = localStorage.getItem("userId"); // Get the logged-in user's ID
    const response = await fetch(`https://task-application-03me.onrender.com/api/tasks?assignedTo=${userId}`); // Fetch tasks assigned to the user
    const data = await response.json();
    setTasks(data);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.toLocaleString("default", { month: "short" });
    const year = date.getFullYear();

    const daySuffix = (day) => {
      if (day > 3 && day < 21) return "th";
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
    };

    return `${day}${daySuffix(day)} ${month}, ${year}`;
  };

  const handleAddPeopleClick = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setEmail("");
  };

  const handleAddEmail = async () => {
    try {
      const response = await fetch("https://task-application-03me.onrender.com/api/tasks/share", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, creatorId }),
      });

      if (response.ok) {
        console.log("Task board shared successfully");
        setShowPopup(false);
      } else {
        const errorData = await response.json();
        console.error("Failed to share task board:", errorData.message);
      }
    } catch (error) {
      console.error("Error sharing task board:", error);
    }
  };

  const handleFilterChange = (event) => {
    setSelectedFilter(event.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    const createdAt = new Date(task.createdAt); // Assuming createdAt is in ISO format
    const now = new Date();

    switch (selectedFilter) {
      case "Today":
        return (
          createdAt.getFullYear() === now.getFullYear() &&
          createdAt.getMonth() === now.getMonth() &&
          createdAt.getDate() === now.getDate()
        );
      case "This Week":
        const startOfWeek = new Date(now);
        startOfWeek.setDate(now.getDate() - now.getDay()); // Set to the first day of the week (Sunday)
        const endOfWeek = new Date(now);
        endOfWeek.setDate(startOfWeek.getDate() + 6); // Set to the last day of the week (Saturday)

        return createdAt >= startOfWeek && createdAt <= endOfWeek;
      case "This Month":
        return (
          createdAt.getFullYear() === now.getFullYear() &&
          createdAt.getMonth() === now.getMonth()
        );
      default:
        return true;
    }
  });

  const handleAssignTask = async (taskId, assignedUserEmail) => {
    try {
      const response = await fetch(`https://task-application-03me.onrender.com/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ assignedTo: assignedUserEmail }),
      });
      if (response.ok) {
        console.log("Task assigned successfully");
        fetchTasks(); // Refresh tasks after assignment
      } else {
        console.error("Failed to assign task");
      }
    } catch (error) {
      console.error("Error assigning task:", error);
    }
  };

  return (
    <>
      <div className="dashboard-main-content-heading">
        <h1 className="dashboard-main-content-header">
          Welcome! {username && ` ${username}`}
        </h1>
      </div>

      <div className="dashboard-main-content-time">
        <h1 className="dashboard-main-content-timing">{getCurrentDate()}</h1>
      </div>

      <div className="dashboard-main-content-filter">
        <select
          id="date-filter"
          value={selectedFilter}
          onChange={handleFilterChange}
          className="date-filter-dropdown"
        >
          <option value="Today">Today</option>
          <option value="This Week">This Week</option>
          <option value="This Month">This Month</option>
        </select>
      </div>

      <div className="dashboard-main-content-board">
        <div className="dashboard-main-content-board-header-container">
          <h1 className="dashboard-main-content-board-header">Board</h1>
          <div
            className="dashboard-main-content-add-people"
            onClick={handleAddPeopleClick}
          >
            <GoPeople className="dashboard-main-content-icon" />
            <span className="dashboard-main-content-icon-text">Add People</span>
          </div>
        </div>
      </div>
      {userId ? <Cards userId={userId} /> : <p>Loading...</p>}

      <button onClick={() => setShowPopup(true)}>Share Board</button>
      {showPopup && (
        <div className="popup-overlay">
          <div className="popup">
            <h2 className="popup-heading">Add people to the board</h2>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter the email"
              className="popup-input-box"
            />
            <div className="popup-buttons">
              <button
                onClick={handleClosePopup}
                className="popup-button-cancel"
              >
                Cancel
              </button>
              <button
                onClick={handleAddEmail}
                className="popup-button-add-email"
              >
                Add Email
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Dashboard;
