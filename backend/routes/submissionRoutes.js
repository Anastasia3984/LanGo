const express = require("express");
const router = express.Router();
const Submission = require("../models/submission");
const Assignment = require("../models/assignment");

router.get("/", async (req, res) => {
  try {
    const { student_id, _expand } = req.query;
    if (_expand === "assignment" && student_id) {
      const submissions = await Submission.aggregate([
        {
          $match: { student_id: student_id },
        },
        {
          $lookup: {
            from: "assignments",
            localField: "assignmentId",
            foreignField: "id",
            as: "assignment",
          },
        },
        {
          $unwind: {
            path: "$assignment",
            preserveNullAndEmptyArrays: true,
          },
        },
      ]);
      return res.json(submissions);
    }
    let filter = {};
    if (student_id) filter.student_id = student_id;

    const submissions = await Submission.find(filter);
    res.json(submissions);
  } catch (err) {
    console.error("Помилка отримання submission:", err);
    res.status(500).json({ message: err.message });
  }
});

router.patch("/:id", async (req, res) => {
  const { id } = req.params;
  console.log(`📝 [Submission PATCH] ID: ${id}`, req.body);

  try {
    const updatedSubmission = await Submission.findOneAndUpdate(
      { id: id },
      req.body,
      { new: true },
    );

    if (!updatedSubmission) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json(updatedSubmission);
  } catch (err) {
    console.error("🔥 Помилка оновлення submission:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
