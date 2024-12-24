const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

// Register User

exports.registerUser = async (req, res) => {
  const { name, email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    // Use bcrypt to hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    console.log("Hashed Password:", hashedPassword);

    user = new User({ name, email, password: hashedPassword });
    await user.save();
    console.log("Registered User:", user); // Debugging: Log the registered user
    

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(201).json({ token, message: "User registered successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};



// Login User

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;
const cleanedPassword = password.trim();


  try {
    const user = await User.findOne({ email });
    if (!user) {
      console.log("User not found with email:", email);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Compare the provided password with the stored hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    console.log("Password comparison - Provided:", password);
console.log("Password comparison - Stored Hash:", user.password);
console.log("Password match result:", isMatch);
    if (!isMatch) {
      console.log("Password did not match for email:", email);
      console.log("Provided password:", password);
      console.log("Stored hashed password:", user.password);
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    res.status(200).json({ token, userId: user._id, username: user.name, message: "Logged in successfully" });
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.updateUserProfile = async (req, res) => {
  const userId = req.user.userId; // Make sure this is getting set correctly
  const { name, email, oldPassword, newPassword } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (name) {
      user.name = name;
    } else if (email) {
      user.email = email;
    } else if (oldPassword && newPassword) {
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Old password is incorrect" });
      }
      user.password = await bcrypt.hash(newPassword, 10);
    }

    await user.save();
    res.status(200).json({ message: "Profile updated successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

