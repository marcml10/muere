import dotenv from 'dotenv';
dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

export const searchYouTube = async (query) => {
  console.log(`[Service: youtube.js] Received search query: "${query}"`);
  
  if (!YOUTUBE_API_KEY) {
    console.error("[Service: youtube.js] Error: YOUTUBE_API_KEY is not set in .env");
    throw new Error("Missing YouTube API key");
  }

  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video',
    maxResults: '15',
    key: YOUTUBE_API_KEY
  });

  const url = `https://www.googleapis.com/youtube/v3/search?${params}`;

  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error("[Service: youtube.js] YouTube API Error:", errorText);
      throw new Error(`YouTube API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Map the complex YouTube API response into a simple, clean array for our frontend
    const mappedResults = data.items.map(item => ({
      id: item.id.videoId,
      title: item.snippet.title,
      artist: item.snippet.channelTitle, // Using channel name as the "artist"
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));

    return mappedResults;
  } catch (error) {
    console.error("[Service: youtube.js] Error fetching from YouTube API:", error);
    throw error;
  }
};
