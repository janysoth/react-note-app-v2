import bcrypt from "bcrypt";
import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide your name"],
    },

    email: {
      type: String,
      required: [true, "Please provide your email"],
      unique: true,
      trim: true,
      match: [
        /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/,
        "Please add a valid email",
      ],
    },

    password: {
      type: String,
      required: [true, "Please add password!"],
    },

    photo: {
      type: String,
      default: "https://avatars.githubusercontent.com/u/19819005?v=4",
    },

    bio: {
      type: String,
      default: "I am a new user.",
    },

    role: {
      type: String,
      enum: ["user", "admin", "creator"],
      default: "user",
    },

    isVerified: {
      type: Boolean,
      default: false,
    },
  },

  { timestamps: true, minimize: true }
);

// Hash the password before saving
UserSchema.pre("save", async function (next) {
  // Check if the password is not modified
  // Then go to the next middleware
  if (!this.isModified("password"))
    return next();

  // Hash the password using bcrypt
  // Generate salt
  const salt = await bcrypt.genSalt(10);

  // Hash the password with the salt
  const hashedPassword = await bcrypt.hash(this.password, salt);

  // Set the password to the hashed password
  this.password = hashedPassword;

  // Call the next middleware
  next();
});

const User = mongoose.model("User", UserSchema);

export default User;