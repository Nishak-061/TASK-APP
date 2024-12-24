import React, { useState } from "react";
import { Outlet, NavLink, useNavigate } from "react-router-dom";
import Sandbox from "../Image/codesandbox.png";
import { FiLayout, FiDatabase, FiSettings } from "react-icons/fi";
import { HiOutlineLogout } from "react-icons/hi";
import LogoutConfirmation from "../Dashboard/LogoutConfirmation";
import "../Dashboard/Dashboard.css"; // Same CSS file for layout

const Layout = () => {
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false); // State for modal visibility

  const handleLogout = () => {
    setIsModalOpen(true); // Open the modal when the logout button is clicked
  };

  const confirmLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    navigate("/"); // Navigate to the login page or home page after logout
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-sidebar-container">
        <div className="dashboard-sidebar-container-heading">
          <h1 className="dashboard-sidebar-container-header">
            <img src={Sandbox} alt="sandbox" className="dashboard-sidebar-sandbox" />
            Pro Manage
          </h1>
        </div>
        <div className="dashboard-sidebar-items">
          <div className="dashboard-sidebar-board">
            <h1 className="dashboard-sidebar-board-header">
              <FiLayout className="dashboard-sidebar-icons" />
              <NavLink to="/dashboard" className="dashboard-sidebar-board-text">Board</NavLink>
            </h1>
          </div>
          <div className="dashboard-sidebar-analytic">
            <h1 className="dashboard-sidebar-analytic-header">
              <FiDatabase className="dashboard-sidebar-icons" />
              <NavLink to="/dashboard/analytics" className="dashboard-sidebar-analytic-text">Analytics</NavLink>
            </h1>
          </div>
          <div className="dashboard-sidebar-setting">
            <h1 className="dashboard-sidebar-setting-header">
              <FiSettings className="dashboard-sidebar-icons" />
              <NavLink to="/dashboard/setting" className="dashboard-sidebar-setting-text">Settings</NavLink>
            </h1>
          </div>
        </div>
        <div className="dashboard-sidebar-logout">
          <h1 className="dashboard-sidebar-logout-btn" onClick={handleLogout}>
            <HiOutlineLogout />
            Log out
          </h1>
        </div>
      </div>

      <div className="dashboard-main-content-container">
        <Outlet />
      </div>

      {/* Render the confirmation modal */}
      <LogoutConfirmation 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onConfirm={confirmLogout} 
      />
    </div>
  );
};

export default Layout;
