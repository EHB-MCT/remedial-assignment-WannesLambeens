import mongoose from "mongoose";
import dotenv from "dotenv";
import Player from "../models/player.model.js";
import Symbol from "../models/symbol.model.js";

dotenv.config();

const { MONGODB_URI } = process.env;

const run = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connected to MongoDB");

    // 1. Clean database (optioneel)
    await Player.deleteMany({});
    await Symbol.deleteMany({});

    // 2. Voeg spelers toe
    const players = await Player.insertMany([
      { name: "Alice", cash: "100000.00" },
      { name: "Bob", cash: "75000.00" },
    ]);
    console.log(`👤 ${players.length} spelers aangemaakt`);

    // 3. Voeg aandelen toe
    const symbols = await Symbol.insertMany([
      { ticker: "AAPL", name: "Apple Inc.", freeFloat: "50000000", tickSize: "0.01" },
      { ticker: "MSFT", name: "Microsoft Corp.", freeFloat: "40000000", tickSize: "0.01" },
    ]);
    console.log(`📈 ${symbols.length} aandelen aangemaakt`);

    await mongoose.disconnect();
    console.log("✅ Disconnected");
  } catch (err) {
    console.error("❌ Fout tijdens seed:", err.message);
    process.exit(1);
  }
};

run();
