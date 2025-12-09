const mongoose = require("mongoose");

const SubmissionSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  assignmentId: {
    type: String,
    required: true,
  },
  student_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["solved", "unsolved", "reviewed", "unreviewed"],
    default: "unsolved",
  },
  solution: {
    type: String,
    default: "",
  },
  comment: {
    type: String,
    default: "",
  },
  grade: {
    type: Number,
    default: null,
  },
  dueDate: {
    type: Date,
  },
  submittedDate: {
    type: Date,
    default: null,
  },
  isOverdue: {
    type: Boolean,
    default: false,
  },
});

module.exports =
  mongoose.models.Submission || mongoose.model("Submission", SubmissionSchema);
