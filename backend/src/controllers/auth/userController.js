import bcrypt from "bcrypt";
import asyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import crypto from "node:crypto";

import generateToken from "../../helpers/generateToken.js";
import hashToken from "../../helpers/hashToken.js";
import sendEmail from "../../helpers/sendEmail.js";
import Token from "../../models/auth/Token.js";
import User from "../../models/auth/UserModel.js";

const jwtSecret = process.env.JWT_SECRET;

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  // Validation
  if (!name || !email || !password)
    res.status(400).json({ message: "All Fields are Required." });

  // Check Password Length
  if (password.length < 6)
    res.status(400).json({ message: "Password Must Be At Least 6 Characters." });

  // Check If User Already Exists
  const userExists = await User.findOne({ email });
  if (userExists)
    return res.status(400).json({ message: "User Already Exists." });

  // Create A Nea User
  const user = await User.create({
    name,
    email,
    password
  });

  // Generate Token with User Id
  const token = generateToken(user._id);

  // Send back the User and Token in the response to the Client
  res.cookie("token", token, {
    path: "/",
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,// 30 days
    sameSite: "none", // cross-site access --> allow all third-party cookies
    secure: false // only send over HTTPS
  });

  if (user) {
    const { _id, name, email, role, photo, bio, isVerified } = user;

    // Status 201 Created
    res.status(201).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid User Data." });
  }
});

// User login
export const loginUser = asyncHandler(async (req, res) => {
  // get email and password from req.body
  const { email, password } = req.body;

  // Validation
  if (!email || !password) {
    // 400 Bad Request
    return res.status(400).json({ message: "All fields are required" });
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (!userExists) {
    return res.status(404).json({ message: "User not found, sign up!" });
  }

  // Check id the password match the hashed password in the database
  const isMatch = await bcrypt.compare(password, userExists.password);

  if (!isMatch) {
    // 400 Bad Request
    return res.status(400).json({ message: "Invalid credentials" });
  }

  // Generate token with user id
  const token = generateToken(userExists._id);

  if (userExists && isMatch) {
    const { _id, name, email, role, photo, bio, isVerified } = userExists;

    // Set the token in the cookie
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      sameSite: "none", // cross-site access --> allow all third-party cookies
      secure: true,
    });

    // Send back the user and token in the response to the client
    res.status(200).json({
      _id,
      name,
      email,
      role,
      photo,
      bio,
      isVerified,
      token,
    });
  } else {
    res.status(400).json({ message: "Invalid email or password" });
  }
});

// User logout
export const logoutUser = asyncHandler(async (req, res) => {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
    path: "/",
  });

  res.status(200).json({ message: "User logged out successfully." });
});

// Get user details
export const getUser = asyncHandler(async (req, res) => {
  // Get user details from the token --> exclude password
  const user = await User.findById(req.user._id).select("-password");

  if (user)
    res.status(200).json(user);
  else
    // 404 Not Found
    res.status(404).json({ message: "User not found" });
});

// Update User's details
export const updateUser = asyncHandler(async (req, res) => {
  // Retrieve user details from the token (protect middleware)
  const user = await User.findById(req.user._id);

  if (!user) {
    // Return 404 if user is not found
    return res.status(404).json({ message: "User not found" });
  }

  // Extract properties to update from the request body
  const { name, bio, photo } = req.body;

  // Update only the provided fields
  user.name = name || user.name;
  user.bio = bio || user.bio;
  user.photo = photo || user.photo;

  // Save the updated user document
  const updatedUser = await user.save();

  // Return updated user details
  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    email: updatedUser.email,
    role: updatedUser.role,
    photo: updatedUser.photo,
    bio: updatedUser.bio,
    isVerified: updatedUser.isVerified,
  });
});

// Login status
export const userLoginStatus = asyncHandler(async (req, res) => {
  const token = req.cookies.token;

  if (!token)
    // 401 Unauthorized
    return res.status(401).json({ message: "Not authorized. Please login to continue." });

  // Verify the token
  const tokenVerified = jwt.verify(token, jwtSecret);

  if (tokenVerified)
    res.status(200).json(true);
  else
    res.status(401).json(false);
});

// Email verification
export const verifyEmail = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  // Check to see if User exist
  if (!user)
    return res.status(404).json({ message: "User not found." });

  // Check to see if User is already verified
  if (user.isVerified)
    return res.status(400).json({ message: "User is already verfied." });

  // Find the Token using user._id
  let token = await Token.findOne({ userId: user._id });

  // If the Token exists --> delete the Token
  if (token)
    await token.deleteOne();

  // Create a Verification Token using the user._id --> crypto package from nodeJS
  const verificationToken = crypto.randomBytes(64).toString("hex") + user._id;

  // Hash the verification token
  const hashedToken = hashToken(verificationToken);

  await new Token({
    userId: user._id,
    verificationToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 24 * 60 * 60 * 1000, // 24 hours
  }).save();

  // Verification link
  const verificationLink = `${process.env.CLIENT_URL}/verify-email/${verificationToken}`;

  // Send email to the user
  const subject = "Email Verification - NoteApp";
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL;
  const reply_to = "noreply@gmail.com";
  const template = "emailVerification";
  const name = user.name;
  const link = verificationLink;

  try {
    // The order is important to follow
    // subject, send_to, send_from, reply_to, template, name, url
    await sendEmail(subject, send_to, send_from, reply_to, template, name, link);

    return res.json({ message: "Email sent." });
  } catch (error) {
    console.log("Error in sending email: ", error);
    return res.status(500).json({ message: "Email could not be sent." });
  }
});

// Verify User
export const verifyUser = asyncHandler(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken)
    return res.status(400).json({ message: "Invalid verification token" });

  // Hash the verification token --> because it was hashed before saving
  const hashedToken = hashToken(verificationToken);

  // Find User with the verification token
  const userToken = await Token.findOne({
    verificationToken: hashedToken,

    // Check if the token has not expired
    expiresAt: { $gt: Date.now() },
  });

  if (!userToken)
    return res.status(400).json({ message: "Invalid or expired verification token." });

  // Find User with the userId in the token
  const user = await User.findById(userToken.userId);

  if (user.isVerified)
    return res.status(400).json({ message: "User is already verified." });

  // Update User to verified
  user.isVerified = true;

  await user.save();

  res.status(200).json({ message: "User has  been verified." });
});

// Forgot password
export const forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email)
    return res.status(400).json({ message: "Please enter your email." });

  // Check if User exists
  const user = await User.findOne({ email });

  if (!user)
    return res.status(404).json({ message: "User not found." });

  // See if reset token exists
  let token = await Token.findOne({ userId: user._id });

  // If Token exists --> delete the token
  if (token)
    await token.deleteOne();

  // Create a reset token using the user id --> expires in 1 hour
  const passwordResetToken = crypto.randomBytes(64).toString("hex") + user._id;

  // Hash the reset token
  const hashedToken = hashToken(passwordResetToken);

  await new Token({
    userId: user._id,
    passwordResetToken: hashedToken,
    createdAt: Date.now(),
    expiresAt: Date.now() + 60 * 60 * 1000,
  }).save();

  // Reset link
  const resetLink = `${process.env.CLIENT_URL}/reset-password/${passwordResetToken}`;

  // Send email to user
  const subject = "Password Reset - Note App";
  const send_to = user.email;
  const send_from = process.env.USER_EMAIL;
  const reply_to = "noreply@gmail.com";
  const template = "forgotPassword";
  const name = user.name;
  const link = resetLink;

  try {
    await sendEmail(subject, send_to, send_from, reply_to, template, name, link);

    res.json({ message: "Password-reset email has been sent." });
  } catch (error) {
    console.log("Error in sending password-reset email: ", error);
    return res.status(500).json({ message: "Email could not be sent for password-reset." });
  }
});

// Reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { resetPasswordToken } = req.params;
  const { password } = req.body;

  if (!password)
    return res.status(400).json({ message: "Please enter the new password." });

  // Hash the reset Token
  const hashedToken = hashToken(resetPasswordToken);

  // Check if token exits and has not expired
  const userToken = await Token.findOne({
    passwordResetToken: hashedToken,

    expiresAt: { $gt: Date.now() },
  });

  if (!userToken)
    return res.status(400).json({ message: "Invalid or expired token." });

  // Find User with the userId in the token
  const user = await User.findById(userToken.userId);

  // Update User's password
  user.password = password;

  await user.save();

  return res.json({ message: "Password has been reset successfully." });
});

// Change Password
export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;

  if (!currentPassword || !newPassword)
    return res.status(400).json({ message: "All fields are required." });

  // Find User by user id
  const user = await User.findById(req.user._id);

  // Compare current password with the hashed password in the database
  const isMatch = await bcrypt.compare(currentPassword, user.password);

  if (!isMatch)
    return res.status(400).json({ message: "Invalid password. Please try again." });

  // Reset password
  if (isMatch) {
    user.password = newPassword;

    await user.save();

    return res.status(200).json({ message: "Password has been changed successfully." });
  } else {
    return res.status(400).json({ message: "Password could not be changed." });
  }
});