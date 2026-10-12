import express from 'express';
import { searchYouTube, getTrendingIndia } from '../services/youtube.js';

const router = express.Router();

router.get('/search', async (req, res) => {
  try {
    // 1. Extract the query parameter from the search request
    const query = req.query.q;
    
    if (!query) {
      return res.status(400).json({ error: "Query parameter 'q' is required" });
    }

    // 2. Feed the query into the youtube service
    const results = await searchYouTube(query);
    
    // 3. Return the response back to the client
    res.json(results);
  } catch (error) {
    console.error("Error in /api/search route:", error);
    res.status(500).json({ error: "Failed to perform search" });
  }
});

router.get('/trending', async (req, res) => {
  try {
    const data = await getTrendingIndia();
    res.json(data);
  } catch (error) {
    console.error("Error in /api/trending route:", error);
    res.status(500).json({ error: "Failed to fetch trending songs" });
  }
});

export default router;
