const express = require("express");
const router = express.Router();
const Assignment = require("../models/assignment");
const Submission = require("../models/submission");
const { v4: uuidv4 } = require("uuid");

router.post("/", async (req, res) => {
  console.log("📥 [Backend] Створення завдання:", req.body);

  try {
    const { title, description, dueDate, teacherId, studentId } = req.body;

    if (!title) throw new Error("Помилка: Не вказано Title");
    if (!studentId) throw new Error("Помилка: Не вказано studentId");
    const newAssignment = new Assignment({
      id: uuidv4(),
      title,
      description,
      created_at: new Date(),
    });

    await newAssignment.save();
    const newSubmission = new Submission({
      id: uuidv4(),
      assignmentId: newAssignment.id,
      student_id: studentId,
      status: "unsolved",
      dueDate: dueDate || null,
    });

    await newSubmission.save();

    console.log(`✅ Завдання створено для студента ${studentId}`);
    res.status(201).json(newAssignment);
  } catch (err) {
    console.error("🔥 [Backend Error]:", err);
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`📝 [Backend PATCH] Редагування завдання ID: ${id}`, req.body);

  try {
    const { title, description, dueDate } = req.body;
    const updatedAssignment = await Assignment.findOneAndUpdate(
      { id: id },
      { title, description },
      { new: true },
    );

    if (!updatedAssignment) {
      console.log("❌ Завдання не знайдено в базі");
      return res.status(404).json({ message: "Assignment not found" });
    }
    if (dueDate) {
      await Submission.updateMany({ assignmentId: id }, { dueDate: dueDate });
      console.log("📅 Дата оновлена у Submissions");
    }

    console.log("✅ Завдання успішно оновлено");
    res.json(updatedAssignment);
  } catch (err) {
    console.error("🔥 Помилка редагування (PATCH):", err);
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`🗑 [Backend DELETE] Видалення завдання ID: ${id}`);

  try {
    await Assignment.deleteOne({ id: id });
    await Submission.deleteMany({ assignmentId: id });

    console.log("✅ Завдання та сабмішни видалено");
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    console.error("🔥 Помилка видалення:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
