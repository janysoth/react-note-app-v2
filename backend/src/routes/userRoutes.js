import express from "express";

import { deleteUser, getAllUsers } from "../controllers/auth/adminController.js";
import {
  changePassword,
  forgotPassword,
  getUser,
  loginUser,
  logoutUser,
  registerUser,
  resetPassword,
  updateUser,
  userLoginStatus,
  verifyEmail,
  verifyUser
} from "../controllers/auth/userController.js";
import {
  adminMiddleware,
  creatorMiddleware,
  protect
} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/logout", logoutUser);
router.get("/user", protect, getUser);
router.patch("/user", protect, updateUser);

/* Admin Routes */

// Delete User
router.delete("/admin/users/:id", protect, adminMiddleware, deleteUser);

// Get all Users
router.get("/admin/users", protect, creatorMiddleware, getAllUsers);

/* *** */

// Login status
router.get("/login-status", userLoginStatus);

// Email verification
router.post("/verify-email", protect, verifyEmail);

// Verify User --> email verification
router.post("/verify-user/:verificationToken", verifyUser);

// Forgot password
router.post("/forgot-password", forgotPassword);

// Reset password
router.post("/reset-password/:resetPasswordToken", resetPassword);

// Change password
router.patch("/change-password", protect, changePassword);

export default router;