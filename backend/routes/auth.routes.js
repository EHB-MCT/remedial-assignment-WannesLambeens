import express from "express";
import bcrypt from "bcrypt";
import Player from "../models/player.model.js";

const router = express.Router();


router.post("/register", async (req, res) => {
  const { username, password } = req.body;

  try {
    const existing = await Player.findOne({ username });
    if (existing) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const player = new Player({
      username,
      password, 
    });

    await player.save();

    res.status(201).json({ message: "Registration successful", playerId: player._id });
  } catch (err) {
    console.error("Registration failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});


router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const player = await Player.findOne({ username });
    if (!player) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    const passwordMatch = await bcrypt.compare(password, player.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    res.status(200).json({ message: "Login successful", playerId: player._id });
  } catch (err) {
    console.error("Login failed:", err);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
