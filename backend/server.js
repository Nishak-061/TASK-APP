const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db')
const authRoutes = require('./routes/authRoutes')
const taskRoutes = require('./routes/taskRoutes')
const PORT = process.env.PORT || 8080;


dotenv.config();
const app = express();


app.use(cors());
app.use(express.json());

connectDB();

// Routes
app.use('/api/auth', authRoutes); // Auth routes
app.use('/api/tasks', taskRoutes); // Task routes

app.get("/", (req, res) => {
    res.send("Task Management App Backend")
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})