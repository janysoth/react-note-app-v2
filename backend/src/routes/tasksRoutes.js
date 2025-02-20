import express from "express";

import {
  createTask,
  deleteAllTasks,
  deleteTask,
  getTask,
  getTasks,
  toggleComplete,
  updateTask
} from "../controllers/task/taskController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/task/create", protect, createTask);
router.get("/tasks", protect, getTasks);
router.get("/task/:id", protect, getTask);
router.patch("/task/:id", protect, updateTask);
router.delete("/task/:id", protect, deleteTask);
router.delete("/delete-all-tasks", protect, deleteAllTasks);
router.put("/toggle-complete/:id", protect, toggleComplete);

export default router;