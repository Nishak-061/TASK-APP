import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Art from "../Image/Group.png";
import { FaRegUser } from "react-icons/fa6";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import axios from "axios";
import "./Register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    confirmPassword: "",
    password: "",
  });
  const { name, email, confirmPassword, password  } = formData;

  const navigate = useNavigate(); 

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post(
       "https://task-application-03me.onrender.com/api/auth/register",
        formData
      );
      alert(response.data.message);
    } catch (error) {
      alert(error.response?.data?.message || "Registration Failed");
    }
  };

  const handleLoginRedirect = () => {
    navigate('/'); // Redirect to the Register page
  };

  return (
    <div className="register-container">
      <div className="register-background-circle"></div>
      <div className="register-image-container">
        <img src={Art} className="register-image-art" alt="Art" />
        <p className="register-image-text">
          <span className="register-image-text-top">
            Welcome aboard my friend
          </span>
          <br />
          <span className="register-image-text-bottom">
            Just a couple of clicks and we start
          </span>
        </p>
      </div>
      <div className="register-form-container">
        <div className="register-form-header">
          <h1 className="register-form-heading">Register</h1>
        </div>
        <div className="register-form-boxes">
          <div className="register-form-input-container">
            <FaRegUser className="register-input-icon" />
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={handleChange}
              className="register-form-input"
            />
          </div>
          <div className="register-form-input-container">
            <MdOutlineEmail className="register-input-icon" />
            <input
              type="text"
              name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="register-form-input"
            />
          </div>
          <div className="register-form-input-container">
            <CiLock className="register-input-icon" />
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={handleChange}
              className="register-form-input"
            />
          </div>
          <div className="register-form-input-container">
            <CiLock className="register-input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              className="register-form-input"
            />
          </div>
        </div>
        <div className="register-form-btn">
          <button onClick={handleRegister} className="register-form-button">Register</button>
        </div>
        <div className="register-form-text">
          <p className="register-form-para">Have an account?</p>
        </div>
        <div className="register-form-btn">
          <button onClick={handleLoginRedirect} className="register-form-login">Login</button>
        </div>
      </div>
    </div>
  );
};

export default Register;
