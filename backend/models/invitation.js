const mongoose = require("mongoose");

const InvitationSchema = new mongoose.Schema({
  id: {
    type: String,
    required: true,
    unique: true,
  },
  email: {
    type: String,
    required: true,
  },
  teacher_id: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ["pending", "accepted"],
    default: "pending",
  },
  token: {
    type: String,
    required: true,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  accepted_at: {
    type: Date,
    default: null,
  },
});

module.exports = mongoose.model("Invitation", InvitationSchema);
