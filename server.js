import express from "express";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();
const app = express();
app.use(express.json());

// pad helpers
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// frontend statisch serveren
app.use(express.static(path.join(__dirname, "frontend")));

// healthcheck
app.get("/api/health", (_, res) => res.json({ ok: true }));

// placeholder API-root
app.get("/api", (_, res) => res.json({ api: "ok" }));

const { PORT = 3000 } = process.env;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
