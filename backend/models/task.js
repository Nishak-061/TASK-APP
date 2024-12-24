const mongoose = require("mongoose");
const bcrypt = require('bcrypt')

const taskSchema = new mongoose.Schema({
    title: { type: String, required: true },
  priority: { type: String, enum: ["low", "medium", "high"], required: true },
  dueDate: { type: Date },
  checklist: [{ text: { type: String }, checked: { type: Boolean, default: false } }],
  creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // New field for assigned user
  status: { type: String, enum: ["backlog", "to-do", "in-progress", "done"], default: "backlog" },
  createdAt: { type: Date, default: Date.now }, // Add this line
});

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;