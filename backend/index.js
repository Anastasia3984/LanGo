require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const invitationRoutes = require("./routes/invitationRoutes");
const submissionRoutes = require("./routes/submissionRoutes");
const assignmentRoutes = require("./routes/assignmentRoutes");
const messageRoutes = require("./routes/messageRoutes");

const app = express();

app.use(express.json());
app.use(cors());

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB успішно підключено!"))
  .catch((err) => console.error("❌ Помилка підключення до MongoDB:", err));

app.use("/auth", authRoutes);
app.use("/users", userRoutes);
app.use("/invitations", invitationRoutes);
app.use("/submissions", submissionRoutes);
app.use("/assignments", assignmentRoutes);
app.use("/messages", messageRoutes);
app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(`🚀 Сервер працює на порту ${PORT}`);
});
