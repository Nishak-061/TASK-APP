const jwt = require('jsonwebtoken');

const authenticate = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1]; // Get token from headers
  console.log("Received Token:", token); // Log the received token
  
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) return res.status(403).json({ message: "Invalid token" });
      console.log("Decoded User Info:", decoded); // Log decoded user info
      req.user = decoded; // Attach user information to request
      next();
  });
};


module.exports = authenticate;
