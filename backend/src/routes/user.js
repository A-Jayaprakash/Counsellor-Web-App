const express = require("express");
const router = express.Router();
const User = require("../models/User");
const authMiddleware = require("../middleware/authMiddleware");

// Get current user profile
router.get("/profile", authMiddleware, async (req, res) => {
  try {
    res.json(req.user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update user profile
router.patch("/profile", authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, department } = req.body;

    const user = await User.findByIdAndUpdate(
      req.user._id,
      { firstName, lastName, department },
      { new: true }
    ).select("-password");

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
