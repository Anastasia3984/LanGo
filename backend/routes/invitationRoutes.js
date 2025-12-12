const express = require("express");
const router = express.Router();
const Invitation = require("../models/invitation");
const { v4: uuidv4 } = require("uuid");

router.get("/", async (req, res) => {
  try {
    const { token, email } = req.query;
    let query = {};
    if (token) query.token = token;
    if (email) query.email = email;

    const invitations = await Invitation.find(query);
    res.json(invitations);
  } catch (err) {
    console.error("🔥 [Backend GET Error]:", err);
    res.status(500).json({ message: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const { email, teacher_id, teacherId, message } = req.body;
    const actualTeacherId = teacher_id || teacherId;

    if (!email) throw new Error("Поле 'email' відсутнє");
    if (!actualTeacherId) throw new Error("Поле 'teacher_id' відсутнє");

    const token = uuidv4();
    const newInvitation = new Invitation({
      id: uuidv4(),
      email,
      teacher_id: actualTeacherId,
      token: token,
      status: "pending",
      created_at: new Date(),
    });

    await newInvitation.save();
    const clientUrl = process.env.CLIENT_URL || "http://localhost:5173";
    const inviteLink = `${clientUrl}/?token=${token}`;
    
    console.log(`✅ [Mock Email] Запрошення створено для: ${email}`);
    console.log(`🔗 Link: ${inviteLink}`);
    res.status(201).json({
      message: "Invitation created successfully",
      invitation: newInvitation,
      link: inviteLink,
    });
  } catch (err) {
    console.error("🔥 [Backend Error]:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
