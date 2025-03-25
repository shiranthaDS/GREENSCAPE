const Task = require("../models/Task");

// Add a new task
exports.addTask = async (req, res) => {
  try {
    const { employeeId, ename, email, role, projectId, projectLocation, startDate, progress } = req.body;

    const newTask = new Task({
      employeeId,
      ename,
      email,
      role,
      projectId,
      projectLocation,
      startDate,
      progress,
    });

    await newTask.save();
    res.status(201).json({ message: "Task added successfully", task: newTask });
  } catch (err) {
    console.error("Error adding task:", err);
    res.status(500).json({ error: "Failed to add task", details: err.message });
  }
};

// Get all tasks
exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.status(200).json(tasks);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
};

// Update a task
exports.updateTask = async (req, res) => {
  try {
    const { employeeId, ename, email, role, projectId, projectLocation, startDate, progress } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { employeeId, ename, email, role, projectId, projectLocation, startDate, progress },
      { new: true }
    );

    if (!updatedTask) {
      return res.status(404).json({ error: "Task not found" });
    }

    res.status(200).json({ message: "Task updated successfully", task: updatedTask });
  } catch (err) {
    console.error("Error updating task:", err);
    res.status(500).json({ error: "Failed to update task", details: err.message });
  }
};

// Delete a task
exports.deleteTask = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ error: "Task not found" });
    }
    res.status(200).json({ message: "Task deleted successfully" });
  } catch (err) {
    console.error("Error deleting task:", err);
    res.status(500).json({ error: "Failed to delete task", details: err.message });
  }
};
