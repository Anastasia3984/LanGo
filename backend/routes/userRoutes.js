const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Submission = require("../models/submission");

router.get("/", async (req, res) => {
  try {
    const { role, teacherId, email } = req.query;

    let filter = {};
    if (role) filter.role = role;
    if (teacherId) filter.teacherId = teacherId;
    if (email) filter.email = email;

    const users = await User.find(filter).lean();
    if (role && role !== "student") {
      return res.json(users);
    }

    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        if (user.role !== "student") return user;
        const uncheckedCount = await Submission.countDocuments({
          student_id: user.id,
          status: "unreviewed",
        });
        const lastSubmission = await Submission.findOne({
          student_id: user.id,
        }).sort({ submittedDate: -1 });

        return {
          ...user,
          uncheckedCount: uncheckedCount || 0,
          lastActivity: lastSubmission ? lastSubmission.submittedDate : null,
        };
      }),
    );
    usersWithStats.sort(
      (a, b) => (b.uncheckedCount || 0) - (a.uncheckedCount || 0),
    );

    res.json(usersWithStats);
  } catch (err) {
    console.error("Error in /users route:", err);
    res.status(500).json({ message: err.message });
  }
});

router.get("/:id", async (req, res) => {
  try {
    let user = await User.findOne({ id: req.params.id });
    if (!user && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      user = await User.findById(req.params.id);
    }

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/:id", async (req, res) => {
  try {
    const requestedId = req.params.id;
    let deletedUser = await User.findOneAndDelete({ id: requestedId });
    if (!deletedUser && requestedId.match(/^[0-9a-fA-F]{24}$/)) {
      deletedUser = await User.findByIdAndDelete(requestedId);
    }
    if (!deletedUser) {
      return res.status(404).json({ message: "User not found" });
    }
    if (Submission) {
      await Submission.deleteMany({ student_id: deletedUser.id });
      console.log(
        `Deleted tasks for student ${deletedUser.name} (ID: ${deletedUser.id})`,
      );
    }

    res.json({ message: "User and their submissions deleted successfully" });
  } catch (err) {
    console.error("Error deleting user:", err);
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
