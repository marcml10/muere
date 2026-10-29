import React, { useEffect, useRef, useState } from 'react';
import { usePlayback } from './playBack';
import { useQueue } from './QueueContext';

const YoutubePlayer = () => {
  const { currentTrack, isPlaying, currentTime, setCurrentTime, setDuration, seekToTime, setSeekToTime, volume } = usePlayback();
  const { nextTrack } = useQueue();
  const playerRef = useRef(null);
  const nextTrackRef = useRef(nextTrack);
  const [apiReady, setApiReady] = useState(false);
  const [playerLoaded, setPlayerLoaded] = useState(false);

  // Sync volume
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(volume);
    }
  }, [volume, playerLoaded]);

  // Keep nextTrack reference up to date
  useEffect(() => {
    nextTrackRef.current = nextTrack;
  }, [nextTrack]);

  // 1. Load the YouTube Iframe API asynchronously
  useEffect(() => {
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

      window.onYouTubeIframeAPIReady = () => {
        setApiReady(true);
      };
    } else if (window.YT && window.YT.Player) {
      setApiReady(true);
    }
  }, []);

  // 2. Initialize the player or load a new video when currentTrack changes
  useEffect(() => {
    if (!apiReady || !currentTrack) return;

    if (!playerRef.current) {
      playerRef.current = new window.YT.Player('youtube-player', {
        height: '0',
        width: '0',
        videoId: currentTrack.id,
        playerVars: {
          autoplay: isPlaying ? 1 : 0,
          controls: 0,
          playsinline: 1
        },
        events: {
          onReady: (event) => {
            setPlayerLoaded(true);
            if (currentTime > 0) {
              event.target.seekTo(currentTime, true);
            }
            if (isPlaying) {
              event.target.playVideo();
            }
          },
          onStateChange: (event) => {
            if (event.data === window.YT.PlayerState.ENDED) {
              if (nextTrackRef.current) {
                nextTrackRef.current();
              }
            }
          }
        }
      });
    } else {
      if (isPlaying) {
        playerRef.current.loadVideoById(currentTrack.id);
      } else {
        playerRef.current.cueVideoById(currentTrack.id);
      }
    }
  }, [currentTrack, apiReady]);

  // 3. React to Play/Pause toggles from the UI
  useEffect(() => {
    if (playerRef.current && typeof playerRef.current.playVideo === 'function') {
      if (isPlaying) {
        playerRef.current.playVideo();
      } else {
        playerRef.current.pauseVideo();
      }
    }
  }, [isPlaying, playerLoaded]);

  // 4. Progress Tracking
  useEffect(() => {
    let interval;
    if (isPlaying && playerLoaded && playerRef.current && typeof playerRef.current.getCurrentTime === 'function') {
      interval = setInterval(() => {
        const cTime = playerRef.current.getCurrentTime();
        const dur = playerRef.current.getDuration();
        if (cTime !== undefined) setCurrentTime(cTime);
        if (dur !== undefined) setDuration(dur);
      }, 500);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isPlaying, playerLoaded, setCurrentTime, setDuration]);

  // 5. Seek Logic
  useEffect(() => {
    if (seekToTime !== null && playerRef.current && typeof playerRef.current.seekTo === 'function') {
      playerRef.current.seekTo(seekToTime, true);
      setSeekToTime(null);
    }
  }, [seekToTime, setSeekToTime]);

  return (
    <div style={{ display: 'none' }}>
      {/* The YouTube API will replace this div with an iframe */}
      <div id="youtube-player"></div>
    </div>
  );
};

export default YoutubePlayer;
