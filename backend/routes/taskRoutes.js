const express = require('express');
const Task = require('../models/task'); // Adjust the path as necessary
const User = require('../models/user')
const authMiddleware = require("../middleware/authMiddleware")
const router = express.Router();

// Share task board with another user by email
router.post("/share", async (req, res) => {
  const { email } = req.body; // Email of the user to share with
  const { creatorId } = req.body; // Assuming creatorId is sent from frontend

  try {
    // Find the user to share with
    const userToShareWith = await User.findOne({ email });
    if (!userToShareWith) {
      return res.status(404).json({ message: "User not found" });
    }

    // Find tasks created by the user (creatorId)
    const tasks = await Task.find({ creator: creatorId });

    // Add task IDs to the `sharedTasks` field of userToShareWith
    userToShareWith.sharedTasks = [
      ...new Set([...userToShareWith.sharedTasks, ...tasks.map(task => task._id)]),
    ];

    await userToShareWith.save();

    res.status(200).json({ message: "Task board shared successfully" });
  } catch (error) {
    console.error("Error sharing task board:", error);
    res.status(500).json({ message: "Error sharing task board", error });
  }
});

// routes/taskRoutes.js
router.get('/', async (req, res) => {
  const { userId } = req.query;

  try {
    // Find the user by userId and populate shared tasks
    const user = await User.findById(userId).populate("sharedTasks");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Fetch tasks created by or assigned to the user
    const createdAndAssignedTasks = await Task.find({
      $or: [
        { creator: userId },
        { assignedTo: userId }
      ]
    });

    // Combine created, assigned, and shared tasks
    const tasks = [...createdAndAssignedTasks, ...user.sharedTasks];

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({ message: "Error fetching tasks", error });
  }
});





// Define the POST route
router.post('/', async (req, res) => {
    console.log("Received request:", req.body);
    
  const { title, priority, dueDate, checklist, creator, status, assignedTo  } = req.body;

  try {
    const task = new Task({ title, priority, dueDate, checklist, creator, status, assignedTo  });
    const savedTask = await task.save();
    res.status(201).json(savedTask);
  } catch (error) {
    res.status(500).json({ message: 'Error creating task', error });
  }
}); 
  
  // Define the PUT route to update a task


  router.put('/:id', async (req, res) => {
  const { id } = req.params; // Extract task ID from the request parameters
  const updates = req.body; // Get updates from the request body

  try {
    const updatedTask = await Task.findByIdAndUpdate(id, updates, {
      new: true, // Return the updated task
      runValidators: true, // Validate the updates
    });

    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(updatedTask); // Return the updated task
  } catch (error) {
    res.status(500).json({ message: 'Error updating task', error });
  }
});

// Define the DELETE route to delete a task
router.delete('/:id', async (req, res) => {
  const { id } = req.params; // Extract task ID from the request parameters

  try {
    const deletedTask = await Task.findByIdAndDelete(id); // Find and delete the task by ID

    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json({ message: 'Task deleted successfully', deletedTask }); // Return success message
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task', error });
  }
});


// Get a task by ID for public view
// Define the GET route to fetch a task by ID
router.get('/:id/public', async (req, res) => {
  const { id } = req.params; // Extract task ID from the request parameters

  try {
    const task = await Task.findById(id); // Find the task by ID

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    res.json(task); // Return the task details
  } catch (error) {
    res.status(500).json({ message: 'Error fetching task', error });
  }
});

module.exports = router;
