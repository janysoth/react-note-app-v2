import asyncHandler from "express-async-handler";

import Task from "../../models/tasks/TaskModel.js";

// Create Task
export const createTask = asyncHandler(async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;

    if (!title || title.trim() === "") {
      return res.status(400).json({ message: "Title is required!" });
    }

    if (!description || description.trim() === "") {
      return res.status(400).json({ message: "Description is required!" });
    }

    // Check if task with the same title already exists
    const existingTask = await Task.findOne({ title });
    if (existingTask) {
      return res.status(400).json({ message: "A task with this title already exists." });
    }

    const task = new Task({
      title,
      description,
      dueDate,
      priority,
      status,
      user: req.user._id,
    });

    await task.save();
    res.status(201).json(task);
  } catch (error) {
    console.log("Error in createTask:", error.message);
    if (error.code === 11000) {
      return res.status(400).json({ message: "Duplicate task title." });
    }
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get All Tasks
export const getTasks = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    if (!userId)
      return res.status(400).json({ message: "User not found." });

    const tasks = await Task.find({ user: userId });

    res.status(200).json({
      length: tasks.length,
      tasks,
    });

  } catch (error) {
    console.log("Error in getTasks: ", error.message);
    res.status(500).json(error.message);
  }
});

// Get a Task with task id
export const getTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    if (!id)
      return res.status(400).json({ message: "Please provide a task id." });

    const task = await Task.findById(id);

    if (!task)
      return res.status(404).json({ message: "No Task was found." });

    // Check if the user is the owner of the task
    if (!task.user.equals(userId))
      return res.status(401).json({ message: "Not authorized." });

    res.status(200).json(task);
  } catch (error) {
    console.log("Error in getTask: ", error.message);
    res.status(500).json(error.message);
  }
});

// Update Task 
export const updateTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    const { title, description, dueDate, priority, status, completed } = req.body;

    const task = await Task.findById(id);

    if (!task)
      return res.status(404).json({ message: "No task was found." });

    // Check if the User is the owner of the task
    if (!task.user.equals(userId))
      return res.status(401).json({ message: "Not authorized." });

    // Update the task with the new data if provided or keep the old data
    task.title = title || task.title;
    task.description = description || task.description;
    task.dueDate = dueDate || task.dueDate;
    task.priority = priority || task.priority;
    task.status = status || task.status;
    task.completed = completed || task.completed;

    await task.save();

    return res.status(200).json(task);
  } catch (error) {
    console.log("Error in updateTask: ", error.message);
    res.status(500).json(error.message);
  }
});

// Delete a task
export const deleteTask = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;

    const { id } = req.params;

    const task = await Task.findById(id);

    if (!task)
      return res.status(404).json({ message: "No task was found." });

    // Check if the User is the owner for the task
    if (!task.user.equals(userId))
      return res.status(401).json({ message: "Not authorized." });

    await Task.findByIdAndDelete(id);

    return res.status(200).json({ message: "Task deleted successfully." });
  } catch (error) {
    console.log("Error in deleteTask: ", error.message);
    res.status(500).json(error.message);
  }
});

// Delete All tasks
export const deleteAllTasks = asyncHandler(async (req, res) => {
  try {
    const { userId } = req.body; // Get userId from the request body

    if (!userId) {
      return res.status(400).json({ message: "User ID is required." });
    }

    const tasks = await Task.find({ user: userId });

    if (!tasks || tasks.length === 0) {
      return res.status(404).json({ message: "No tasks found." });
    }

    // Delete all tasks for the user
    await Task.deleteMany({ user: userId });

    res.status(200).json({ message: "All tasks deleted successfully." });
  } catch (error) {
    console.log("Error in deleteAllTasks: ", error.message);
    res.status(500).json(error.message);
  }
});

// Toggle Complete 
export const toggleComplete = asyncHandler(async (req, res) => {
  try {
    const userId = req.user._id;
    const { id } = req.params;
    const { completed } = req.body;

    const task = await Task.findById(id);

    if (!task)
      return res.status(404).json({ message: "No task was found." });

    // Check if the User is the owner for the task
    if (!task.user.equals(userId))
      return res.status(401).json({ message: "Not authorized." });

    task.completed = completed;

    await task.save();

    return res.status(200).json({
      error: false,
      task,
      message: "Task updated successfully."
    });

  } catch (error) {
    console.log("Error in toggleComplete: ", error);
  }
});