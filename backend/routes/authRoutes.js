const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Invitation = require("../models/invitation");
const { v4: uuidv4 } = require("uuid");
router.post("/register", async (req, res) => {
  try {
    const { email, password, role, name, gender, token } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    let finalTeacherId = null;
    if (token) {
      const invite = await Invitation.findOne({ token });
      if (invite && invite.status === "pending") {
        finalTeacherId = invite.teacher_id;
        invite.status = "accepted";
        invite.accepted_at = new Date();
        await invite.save();
      }
    }

    const newUser = new User({
      id: uuidv4(),
      email,
      password,
      role,
      name,
      gender,
      teacherId: finalTeacherId,
    });
    await newUser.save();

    res.status(201).json({
      message: "User registered successfully",
      user: newUser,
      token: "mock_token_" + newUser.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid credentials" });
    }
    user.password = undefined;

    res.json({
      user,
      token: "mock_token_" + user.id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
