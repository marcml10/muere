import dotenv from 'dotenv';
dotenv.config();

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

const cleanTitle = (title) => {
  let clean = title;
  
  // 1. Remove text in parentheses/brackets UNLESS it contains 'feat', 'ft', or 'featuring'
  clean = clean.replace(/[\(\[][^\)\]]*[\)\]]/gi, (match) => {
    if (/feat|ft\.?|featuring/i.test(match)) {
      return match;
    }
    return '';
  });
  
  // 2. Remove "Artist - " pattern. 
  // If the title contains " - ", we assume it's "Artist - Title" and keep everything after the first " - "
  if (clean.includes(' - ')) {
    clean = clean.split(' - ').slice(1).join(' - ');
  }

  // 3. Remove common trailing suffixes like " (Remastered)" or similar if they aren't caught
  clean = clean.replace(/[\(\[\{]\s*[\)\]\}]/g, ''); // empty brackets left behind
  
  // Decode HTML entities (e.g. &amp; -> &) that YouTube returns
  clean = clean.replace(/&amp;/g, '&').replace(/&quot;/g, '"').replace(/&#39;/g, "'");

  return clean.trim();
};

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
      title: cleanTitle(item.snippet.title),
      artist: item.snippet.channelTitle.replace(/VEVO$/i, '').replace(/ - Topic$/i, '').trim(), // Using channel name as the "artist" and stripping VEVO/Topic
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
    }));

    return mappedResults;
  } catch (error) {
    console.error("[Service: youtube.js] Error fetching from YouTube API:", error);
    throw error;
  }
};
