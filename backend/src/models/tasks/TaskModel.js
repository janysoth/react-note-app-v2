const TaskSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Please provide a title"],
    },

    description: {
      type: String,
      default: "No description",
    },

    dueDate: {
      type: Date,
      default: Date.now(),
    },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    completed: {
      type: Boolean,
      default: false,
    },

    priority: {
      type: String,
      enum: ["low", "medium", "high"],
      default: "low",
    },

    user: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

// Add a compound index for the unique combination of title and user
TaskSchema.index({ title: 1, user: 1 }, { unique: true });

const Task = mongoose.model("Task", TaskSchema);

export default Task;