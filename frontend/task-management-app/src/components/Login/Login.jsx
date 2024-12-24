import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import Art from "../Image/Group.png";
import { MdOutlineEmail } from "react-icons/md";
import { CiLock } from "react-icons/ci";
import axios from 'axios';
import "./Login.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });

  const { email, password } = formData;

  const navigate = useNavigate(); // Initialize useNavigate

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async () => {
    try {
        console.log("Login Data:", formData); // Log the data being sent
        const response = await axios.post("https://task-application-03me.onrender.com/api/auth/login", formData);
        alert(response.data.message);
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('userId', response.data.userId);
        localStorage.setItem('username', response.data.username);
        navigate('/dashboard');
    } catch (error) {
        console.error("Login Error:", error); // Log the error for debugging
        alert(error.response?.data?.message || 'Login failed');
    }
};


  const handleRegisterRedirect = () => {
    navigate('/register'); // Redirect to the Register page
  };

  return (
    <div className="login-container">
      <div className="login-background-circle"></div>
      <div className="login-image-container">
        <img src={Art} className="login-image-art" alt="Art" />
        <p className="login-image-text">
          <span className="login-image-text-top">Welcome aboard my friend</span>
          <br />
          <span className="login-image-text-bottom">
            Just a couple of clicks and we start
          </span>
        </p>
      </div>
      <div className="login-form-container">
        <div className="login-form-header">
          <h1 className="login-form-heading">Login</h1>
        </div>
        <div className="login-form-boxes">
          <div className="login-form-input-container">
           
            <MdOutlineEmail className="input-icon" />
            <input
              type="text"
               name="email"
              placeholder="Email"
              value={email}
              onChange={handleChange}
              className="login-form-input"
            />
          </div>
          <div className="login-form-input-container">
            <CiLock className="input-icon" />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
          onChange={handleChange}
              className="login-form-input"
            />
          </div>
        </div>
        <div className="login-form-btn">
          <button onClick={handleLogin} className="login-form-button">Log in</button>
        </div>
        <div className="login-form-text">
          <p className="login-form-para">Have no account yet?</p>
        </div>
        <div className="login-form-btn">
          <button onClick={handleRegisterRedirect} className="login-form-register">Register</button>
        </div>
      </div>
    </div>
  );
};

export default Login;
