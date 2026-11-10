import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import youtubeRoutes from "./routes/youtube.js";
import { initTrendingScheduler } from "./services/youtube.js";
import "dotenv/config";
import "./database/database.js";

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const HOST = process.env.HOST || "0.0.0.0";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Add CORS headers so the Vite frontend (port 5173) can talk directly to this backend (port 3000)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

// Feed all /api routes to our modular route handlers
app.use("/api", youtubeRoutes);

const clientDistPath = path.resolve(__dirname, "../dist");
app.use(express.static(clientDistPath));
app.get("/{*splat}", (req, res, next) => {
  if (req.path.startsWith("/api/")) return next();
  res.sendFile(path.join(clientDistPath, "index.html"));
});

app.listen(PORT, HOST, () => {
  console.log(`Server running on http://${HOST}:${PORT}`);
  // Start the independent 8-hour trending scheduler
  initTrendingScheduler();
});