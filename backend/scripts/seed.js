import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "../models/player.model.js";

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI;

async function seed() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log(" Verbonden met MongoDB");

    const players = [
      { name: "Bob", cash: 100000 },
      { name: "Alice", cash: 100000 },
    ];

    for (const player of players) {
      const existing = await Player.findOne({ name: player.name });
      if (existing) {
        console.log(`➡️  ${player.name} bestaat al`);
        continue;
      }

      await Player.create(player);
      console.log(` ${player.name} aangemaakt`);
    }

    process.exit();
  } catch (err) {
    console.error(" Fout tijdens seeding:", err.message);
    process.exit(1);
  }
}

seed();
