const express = require('express');
const User = require("../models/user");
const { registerUser, loginUser, updateUserProfile } = require('../controllers/authController');
const authenticate = require('../middleware/authMiddleware'); // Import the authenticate middleware
const router = express.Router();

// Register route
router.post('/register', registerUser);

// Login route
router.post('/login', loginUser);

// Update route - protect this route with authenticate middleware
router.put("/update", authenticate, updateUserProfile);

// Fetch user profile route - protected
router.get('/profile', authenticate, async (req, res) => {
    try {
      // Get user ID from the authenticated user
      const userId = req.user.userId;
  
      // Fetch user from the database
      const user = await User.findById(userId).select('-password'); // Exclude password from the result
  
      // Check if user was found
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
  
      // Send user data
      res.status(200).json(user);
    } catch (error) {
      console.error("Error fetching user profile:", error); // Log the error for debugging
      res.status(500).json({ message: "Server error" });
    }
  });

// Add this route to fetch all users (for example, to use in an assignment dropdown)
router.get('/users', authenticate, async (req, res) => {
  try {
    const users = await User.find().select('email'); // Select only required fields
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({ message: "Server error" });
  }
});


module.exports = router;
