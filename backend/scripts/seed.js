import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "../models/player.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("Verbonden met MongoDB");

    const players = [
      { username: "bob", password: "password123" },
      { username: "alice", password: "password123" },
    ];

    for (const player of players) {
      const existing = await Player.findOne({ username: player.username });
      if (existing) {
        console.log(` ${player.username} bestaat al`);
        continue;
      }

      await Player.create(player);
      console.log(`${player.username} aangemaakt`);
    }

    process.exit();
  } catch (err) {
    console.error("Fout tijdens seeding:", err.message);
    process.exit(1);
  }
}

seed();
