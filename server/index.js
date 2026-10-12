import express from "express";
import youtubeRoutes from "./routes/youtube.js";
import { initTrendingScheduler } from "./services/youtube.js";
import "dotenv/config";
import "./database/database.js";

const app = express();
const PORT = 3000;

// Add CORS headers so the Vite frontend (port 5173) can talk directly to this backend (port 3000)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.use(express.json());

// Feed all /api routes to our modular route handlers
app.use("/api", youtubeRoutes);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  // Start the independent 8-hour trending scheduler
  initTrendingScheduler();
});