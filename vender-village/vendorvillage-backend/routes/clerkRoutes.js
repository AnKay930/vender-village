const express = require("express");
const { createClerkClient } = require("@clerk/backend");
const dotenv = require("dotenv");
const User = require("../models/user");

dotenv.config();
const router = express.Router();

const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
  publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
});

router.post("/create-user", async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res
      .status(400)
      .json({ error: "Email, password, and role are required." });
  }

  try {
    const newUser = await clerkClient.users.createUser({
      emailAddress: [email],
      password,
    });

    if (!newUser || !newUser.id) {
      return res.status(500).json({ error: "Failed to create user in Clerk." });
    }

    const response = await fetch(
      "http://localhost:5000/api/users/register-user",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: newUser.id,
          email: email,
          role: role,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res
        .status(500)
        .json({ error: data.error || "Error storing user in MongoDB." });
    }

    res.json({ message: "User created successfully", userId: newUser.id });
  } catch (error) {
    console.error("Error creating user:", error);

    if (error?.errors) {
      const formattedErrors = error.errors.map(
        (err) => err.longMessage || err.message
      );
      return res.status(400).json({ error: formattedErrors.join(" ") });
    }

    res.status(500).json({ error: "Internal Server Error." });
  }
});

router.delete("/delete-user/:userId", async (req, res) => {
  const { userId } = req.params;

  try {
    try {
      await clerkClient.users.deleteUser(userId);
    } catch (clerkError) {
      if (clerkError.status === 404) {
        console.warn(
          `User ${userId} not found in Clerk, skipping Clerk deletion.`
        );
      } else {
        throw clerkError;
      }
    }

    const deletedUser = await User.findOneAndDelete({ userId });

    if (!deletedUser) {
      return res.status(404).json({ error: "User not found in MongoDB" });
    }

    res.json({ message: "User deleted successfully from Clerk and MongoDB" });
  } catch (error) {
    console.error("Error deleting user:", error);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
