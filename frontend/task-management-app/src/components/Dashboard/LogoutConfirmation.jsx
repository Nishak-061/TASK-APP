import React from 'react'
import "./LogoutConfirmation.css"

const LogoutConfirmation = ({ isOpen, onClose, onConfirm }) => {
    if (!isOpen) return null; // Don't render the modal if it's not open
  return (
    <div className="logout-confirm-pop-up-container">
      <div className="logout-confirm-modal-content">
        <h2>Are you sure you want to log out?</h2>
        <div className="logout-confirm-modal-buttons">
          <button onClick={onConfirm} className="logout-confirm-modal-button confirm">Yes, Logout</button>
          <button onClick={onClose} className="logout-confirm-modal-button cancel">Cancel</button>
        </div>
      </div>
    </div>
  )
}

export default LogoutConfirmation