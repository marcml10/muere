import dotenv from 'dotenv';
dotenv.config();
dotenv.config({ path: '../.env' });

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;

// Parse ISO 8601 duration (e.g. PT3M45S, PT59S) into total seconds
const parseDuration = (isoDuration) => {
  if (!isoDuration) return 0;
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/i);
  if (!match) return 0;
  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);
  return hours * 3600 + minutes * 60 + seconds;
};

// Check if a video is a YouTube Short (duration <= 60 seconds or has #shorts hashtag)
const isShortVideo = (item) => {
  const durationSeconds = parseDuration(item.contentDetails?.duration);
  // YouTube shorts are 60 seconds or less
  if (durationSeconds > 0 && durationSeconds <= 60) {
    return true;
  }
  // Check title or description for #shorts / #short
  const title = item.snippet?.title || '';
  const desc = item.snippet?.description || '';
  if (/#shorts?\b/i.test(title) || /#shorts?\b/i.test(desc)) {
    return true;
  }
  return false;
};

// Check if a channel title / query matches an artist name search
const isArtistMatch = (queryStr, channelName) => {
  if (!queryStr || !channelName) return false;
  const q = queryStr.toLowerCase().replace(/[^a-z0-9]/g, '');
  const c = channelName.toLowerCase().replace(/vevo$/i, '').replace(/ - topic$/i, '').replace(/[^a-z0-9]/g, '');
  if (!q || !c) return false;
  return c.includes(q) || q.includes(c);
};

export const searchYouTube = async (query) => {
  console.log(`[Service: youtube.js] Received search query: "${query}"`);
  
  const apiKey = YOUTUBE_API_KEY || process.env.YOUTUBE_API_KEY;
  if (!apiKey) {
    console.error("[Service: youtube.js] Error: YOUTUBE_API_KEY is not set in .env");
    throw new Error("Missing YouTube API key");
  }

  // Search for both videos and channels
  const params = new URLSearchParams({
    part: 'snippet',
    q: query,
    type: 'video,channel',
    maxResults: '35',
    key: apiKey
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
    
    // 1. Separate channels and videos from YouTube search results
    const channelItems = (data.items || []).filter(item => 
      item.id?.kind === 'youtube#channel' || (item.id?.channelId && !item.id?.videoId)
    );
    const videoItems = (data.items || []).filter(item => 
      item.id?.kind === 'youtube#video' || item.id?.videoId
    );

    // 2. Identify candidate artist channel if searching for an artist
    let candidateChannelId = null;

    // A. Check direct channel results
    const directMatch = channelItems.find(item => isArtistMatch(query, item.snippet?.title)) || channelItems[0];
    if (directMatch && isArtistMatch(query, directMatch.snippet?.title)) {
      candidateChannelId = directMatch.id?.channelId || directMatch.snippet?.channelId;
    }

    // B. If no direct channel item matched, check if top video channel matches query
    if (!candidateChannelId && videoItems.length > 0) {
      const matchingVideo = videoItems.slice(0, 5).find(v => isArtistMatch(query, v.snippet?.channelTitle));
      if (matchingVideo) {
        candidateChannelId = matchingVideo.snippet?.channelId;
      }
    }

    // 3. Fetch detailed channel metadata (high-res logo, subscriber count)
    let artistChannel = null;
    if (candidateChannelId) {
      try {
        const channelUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${candidateChannelId}&key=${apiKey}`;
        const channelResponse = await fetch(channelUrl);
        if (channelResponse.ok) {
          const channelData = await channelResponse.json();
          const cItem = channelData.items?.[0];
          if (cItem) {
            artistChannel = {
              id: cItem.id,
              name: cItem.snippet.title.replace(/VEVO$/i, '').replace(/ - Topic$/i, '').trim(),
              description: cItem.snippet.description || '',
              customUrl: cItem.snippet.customUrl || '',
              thumbnailUrl: cItem.snippet.thumbnails.high?.url || cItem.snippet.thumbnails.medium?.url || cItem.snippet.thumbnails.default?.url,
              subscriberCount: parseInt(cItem.statistics?.subscriberCount || '0', 10),
              videoCount: parseInt(cItem.statistics?.videoCount || '0', 10),
            };
            console.log(`[Service: youtube.js] Found matching artist channel: "${artistChannel.name}" with ${artistChannel.subscriberCount} subscribers`);
          }
        }
      } catch (channelErr) {
        console.warn("[Service: youtube.js] Warning: Could not fetch channel details:", channelErr);
      }
    }

    // 4. Batch query video statistics and durations
    const videoIds = videoItems.map(item => item.id?.videoId || item.id).filter(Boolean);

    let tracks = [];
    if (videoIds && videoIds.length > 0) {
      try {
        const videosUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoIds.join(',')}&key=${apiKey}`;
        const videosResponse = await fetch(videosUrl);
        if (videosResponse.ok) {
          const videosData = await videosResponse.json();
          // Filter out YouTube shorts
          const nonShorts = videosData.items.filter(item => !isShortVideo(item));

          tracks = nonShorts.map(item => {
            const durationSeconds = parseDuration(item.contentDetails?.duration);
            return {
              id: item.id,
              title: item.snippet.title,
              artist: item.snippet.channelTitle.replace(/VEVO$/i, '').replace(/ - Topic$/i, '').trim(),
              thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default?.url,
              viewCount: parseInt(item.statistics?.viewCount || '0', 10),
              duration: durationSeconds,
            };
          });
        }
      } catch (statsErr) {
        console.warn("[Service: youtube.js] Warning: Could not fetch video statistics, falling back to basic search:", statsErr);
      }
    }

    // Fallback if video statistics fetch fails
    if (tracks.length === 0) {
      tracks = videoItems.map(item => ({
        id: item.id?.videoId || item.id,
        title: cleanTitle(item.snippet?.title || ''),
        artist: (item.snippet?.channelTitle || '').replace(/VEVO$/i, '').replace(/ - Topic$/i, '').trim(),
        thumbnailUrl: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url,
        viewCount: 0,
        duration: 0,
      }));
    }

    return {
      tracks,
      channel: artistChannel
    };
  } catch (error) {
    console.error("[Service: youtube.js] Error fetching from YouTube API:", error);
    throw error;
  }
};
