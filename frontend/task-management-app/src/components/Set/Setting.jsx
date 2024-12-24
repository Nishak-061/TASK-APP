import React, { useState, useEffect, useRef } from "react";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import "./Setting.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Setting = () => {
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    oldPassword: "",
    newPassword: "",
  });

  const [activeField, setActiveField] = useState(null);
  const inputRefs = useRef({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("https://task-application-03me.onrender.com/api/auth/profile", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUserData({
          name: response.data.name,
          email: response.data.email,
        });
      } catch (error) {
        console.error("Error fetching user data", error);
      }
    };

    fetchUserData();
  }, []);

  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const handleFieldClick = (field) => {
    if (activeField !== field) {
      // Show a toast when the field is clicked
      toast.info(`You're now editing the ${field}. Only one field can be edited at a time.`);
      setActiveField(field);
      setTimeout(() => inputRefs.current[field]?.focus(), 0); 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const updateData = { [activeField]: userData[activeField] };

      const response = await axios.put(`https://task-application-03me.onrender.com/api/auth/update`, updateData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      toast.success(`${activeField} updated successfully`);

      if (activeField === "email" || activeField === "newPassword") {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("userId");
        navigate("/"); // Redirect to the login page or homepage
      }
    } catch (error) {
      console.error("Update failed", error.response ? error.response.data : error.message);
      toast.error(`Update failed: ${error.response ? error.response.data.message : error.message}`);
    }
  };

  return (
    <div className="setting-container">
      <div className="setting-heading">
        <h1 className="setting-header">Settings</h1>
      </div>

      <form onSubmit={handleSubmit} className="setting-form-boxes">
        <div className="setting-form-input-container">
          <FaRegUser className="setting-input-icon" />
          <input
            ref={(el) => (inputRefs.current.name = el)}
            type="text"
            name="name"
            value={userData.name}
            onChange={handleInputChange}
            className="setting-form-input-type"
            placeholder="Name"
            onClick={() => handleFieldClick("name")}
          />
        </div>

        <div className="setting-form-input-container">
          <MdOutlineEmail className="setting-input-icon" />
          <input
            ref={(el) => (inputRefs.current.email = el)}
            type="email"
            name="email"
            value={userData.email}
            onChange={handleInputChange}
            className="setting-form-input-type"
            placeholder="Update Email"
            onClick={() => handleFieldClick("email")}
          />
        </div>

        <div className="setting-form-input-container">
          <CiLock className="setting-input-icon" />
          <input
            ref={(el) => (inputRefs.current.oldPassword = el)}
            type="password"
            name="oldPassword"
            value={userData.oldPassword}
            onChange={handleInputChange}
            className="setting-form-input-type"
            placeholder="Old Password"
            onClick={() => handleFieldClick("oldPassword")}
          />
        </div>

        <div className="setting-form-input-container">
          <CiLock className="setting-input-icon" />
          <input
            ref={(el) => (inputRefs.current.newPassword = el)}
            type="password"
            name="newPassword"
            value={userData.newPassword}
            onChange={handleInputChange}
            className="setting-form-input-type"
            placeholder="New Password"
            onClick={() => handleFieldClick("newPassword")}
          />
        </div>

        <div className="setting-form-button-container">
          <button type="submit" className="setting-form-button" disabled={!activeField}>
            Update
          </button>
        </div>
      </form>

      {/* Toast container to display notifications */}
      <ToastContainer />
    </div>
  );
};

export default Setting;
