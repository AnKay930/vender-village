const express = require("express");
const User = require("../models/user");

const router = express.Router();

router.post("/register-user", async (req, res) => {
  const { userId, email, role } = req.body;

  if (!userId || !email || !role) {
    return res
      .status(400)
      .json({ error: "User ID, email, and role are required" });
  }

  try {
    const existingUser = await User.findOne({ userId });

    if (existingUser) {
      return res.status(400).json({ error: "User already exists" });
    }

    const newUser = new User({ userId, email, role });
    await newUser.save();
    res.json({ message: "User registered successfully", user: newUser });
  } catch (error) {
    console.error("MongoDB Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.delete("/delete-user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const deletedUser = await User.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("MongoDB Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/all-users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    console.error("MongoDB Error:", error);
    res.status(500).json({ error: "Database error" });
  }
});

router.get("/get-user-role", async (req, res) => {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const user = await User.findOne({ userId });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ role: user.role });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
});

router.put("/update-role/:userId", async (req, res) => {
  const { userId } = req.params;
  const { role } = req.body;

  try {
    const updatedUser = await User.findOneAndUpdate(
      { userId },
      { role },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json({ message: "User role updated successfully", user: updatedUser });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
