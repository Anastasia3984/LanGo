const express = require("express");
const router = express.Router();
const Message = require("../models/message");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  try {
    const { senderId, receiverId, subject, body } = req.body;

    if (!senderId || !receiverId || !body) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const newMessage = new Message({
      id: uuidv4(),
      senderId,
      receiverId,
      subject: subject || "No Subject",
      body,
      isRead: false,
      created_at: new Date(),
    });
    await newMessage.save();
    res.status(201).json({
      message: "Message sent successfully",
      data: newMessage,
    });
  } catch (err) {
    console.error("Database Error:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const { userId } = req.query;
    let filter = {};
    if (userId) {
      filter.receiverId = userId;
    }

    const messages = await Message.find(filter).sort({ created_at: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
