import { useState } from 'react';
import { usePlayback } from '../playback/playBack';
import { useQueue } from '../playback/QueueContext';
import { useLiked } from '../playback/LikedContext';

const SeekBackward10Icon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <text x="12" y="15.5" fontSize="8.5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle">10</text>
  </svg>
);

const SeekForward10Icon = ({ size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <text x="12" y="15.5" fontSize="8.5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle">10</text>
  </svg>
);

const PlayerBar = ({ onOpenCurrentSong }) => {
  const { currentTrack, isPlaying, togglePlayPause, currentTime, duration, seekTo, volume, setVolume, toggleMute } = usePlayback();
  const { nextTrack, previousTrack, isQueueVisible, toggleQueue, isRepeat, isShuffle, toggleRepeat, toggleShuffle } = useQueue();
  const { isLiked, toggleLike } = useLiked();

  const isCurrentTrackLiked = Boolean(currentTrack && isLiked(currentTrack.id));

  const [showVolume, setShowVolume] = useState(false);

  const handleSeek = (e) => {
    seekTo(parseFloat(e.target.value));
  };

  const handleSeekBackward10 = () => {
    seekTo(Math.max(0, (currentTime || 0) - 10));
  };

  const handleSeekForward10 = () => {
    const effectiveDuration = (Number.isFinite(duration) && duration > 0)
      ? duration
      : (Number(currentTrack?.duration) > 0 ? Number(currentTrack.duration) : Infinity);
    seekTo(Math.min(effectiveDuration, (currentTime || 0) + 10));
  };

  const formatTime = (time) => {
    if (!time || isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  return (
    <footer className="player-bar">
      {/* Left: Transport Controls */}
      <div className="dock-controls">
        <button className="dock-btn" onClick={toggleShuffle} title="Shuffle" aria-label="Toggle shuffle" style={{ fontSize: '20px', color: isShuffle ? '#fa243c' : 'rgba(255, 255, 255, 0.7)' }}>
          <i className="bi bi-shuffle"></i>
        </button>
        <button className="dock-btn" onClick={handleSeekBackward10} title="Seek 10 seconds backward" aria-label="Seek 10 seconds backward" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          <SeekBackward10Icon size={20} />
        </button>
        <button className="dock-btn" onClick={previousTrack} title="Previous track" aria-label="Previous track" style={{ fontSize: '23px', color: '#fff' }}>
          <i className="bi bi-rewind-fill"></i>
        </button>
        <button className="dock-btn" onClick={togglePlayPause} title={isPlaying ? "Pause" : "Play"} aria-label={isPlaying ? "Pause" : "Play"} style={{ fontSize: '33px', margin: '0 -2px', color: '#fff' }}>
          {isPlaying ? (
            <i className="bi bi-pause-fill"></i>
          ) : (
            <i className="bi bi-play-fill"></i>
          )}
        </button>
        <button className="dock-btn" onClick={nextTrack} title="Next track" aria-label="Next track" style={{ fontSize: '23px', color: '#fff' }}>
          <i className="bi bi-fast-forward-fill"></i>
        </button>
        <button className="dock-btn" onClick={handleSeekForward10} title="Seek 10 seconds forward" aria-label="Seek 10 seconds forward" style={{ color: 'rgba(255, 255, 255, 0.85)' }}>
          <SeekForward10Icon size={20} />
        </button>
        <button className="dock-btn" onClick={toggleRepeat} title="Repeat" aria-label="Toggle repeat" style={{ fontSize: '20px', color: isRepeat ? '#fa243c' : 'rgba(255, 255, 255, 0.7)' }}>
          <i className="bi bi-repeat"></i>
        </button>
      </div>

      {/* Center: Album Art + Track Info */}
      <div className="dock-track">
        <button
          type="button"
          className="dock-art"
          onClick={onOpenCurrentSong}
          disabled={!currentTrack}
          aria-label="Open current song"
          title={currentTrack ? 'Open current song' : 'Nothing is playing'}
          style={{ transform: 'translateY(-2px)', border: 0, padding: 0, cursor: currentTrack ? 'pointer' : 'default' }}
        >
          {currentTrack?.thumbnailUrl ? (
            <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} />
          ) : (
            <span style={{ fontSize: '16px' }}>🎵</span>
          )}
        </button>
        <div className="dock-info" style={{ transform: 'translateY(-2px)' }}>
          <span className="dock-title">
            {currentTrack ? currentTrack.title : 'Not Playing'}
            {currentTrack && <span className="dock-badge">E</span>}
          </span>
          <span className="dock-artist">
            {currentTrack ? currentTrack.artist : ''}
          </span>
        </div>
        
        {/* Ultra-thin Progress Line */}
        {(() => {
          const effectiveDuration = (Number.isFinite(duration) && duration > 0) 
            ? duration 
            : (Number(currentTrack?.duration) > 0 ? Number(currentTrack.duration) : 0);

          return (
            <div className="dock-progress-wrapper">
              <span className="dock-time dock-time-current">{formatTime(currentTime)}</span>
              <span className="dock-time dock-time-total">{formatTime(effectiveDuration)}</span>

              <div 
                className="dock-progress-fill" 
                style={{ 
                  width: `${(Number.isFinite(currentTime) && effectiveDuration > 0) ? (currentTime / effectiveDuration) * 100 : 0}%` 
                }} 
              />
              <input 
                type="range" 
                min="0" 
                max={effectiveDuration > 0 ? effectiveDuration : 100} 
                value={Number.isFinite(currentTime) ? currentTime : 0} 
                onChange={handleSeek} 
                className="dock-progress-input"
              />
            </div>
          );
        })()}
      </div>

      {/* Right: Actions */}
      <div className="dock-actions">
        {/* Like / Heart icon */}
        <button
          type="button"
          className="dock-btn"
          onClick={() => currentTrack && toggleLike(currentTrack)}
          disabled={!currentTrack}
          title={!currentTrack ? 'No song playing' : (isCurrentTrackLiked ? 'Unlike' : 'Like')}
          aria-label={!currentTrack ? 'Like' : (isCurrentTrackLiked ? `Unlike ${currentTrack.title || 'song'}` : `Like ${currentTrack.title || 'song'}`)}
          style={{
            fontSize: '17px',
            color: isCurrentTrackLiked ? '#ff2d55' : 'rgba(255, 255, 255, 0.7)',
            transition: 'all 0.3s ease, transform 0.15s ease',
            filter: showVolume ? 'blur(8px)' : 'none',
            opacity: showVolume ? 0 : (!currentTrack ? 0.35 : 1),
            pointerEvents: (showVolume || !currentTrack) ? 'none' : 'auto',
            cursor: currentTrack ? 'pointer' : 'default'
          }}
          onMouseEnter={(e) => {
            if (currentTrack) {
              if (!isCurrentTrackLiked) e.currentTarget.style.color = '#fff';
              e.currentTarget.style.transform = 'scale(1.15)';
            }
          }}
          onMouseLeave={(e) => {
            if (currentTrack) {
              e.currentTarget.style.color = isCurrentTrackLiked ? '#ff2d55' : 'rgba(255, 255, 255, 0.7)';
              e.currentTarget.style.transform = 'scale(1)';
            }
          }}
        >
          <i className={isCurrentTrackLiked ? 'bi bi-heart-fill' : 'bi bi-heart'} />
        </button>

        {/* Queue icon */}
        <button 
          className="dock-btn" 
          onClick={toggleQueue} 
          style={{ 
            fontSize: '18px', 
            color: isQueueVisible ? 'var(--am-accent)' : 'rgba(255, 255, 255, 0.7)',
            transition: 'all 0.3s ease',
            filter: showVolume ? 'blur(8px)' : 'none',
            opacity: showVolume ? 0 : 1,
            pointerEvents: showVolume ? 'none' : 'auto'
          }}
        >
          <i className="bi bi-list-ul"></i>
        </button>
        {/* Volume icon and popup */}
        <div 
          style={{ display: 'flex', alignItems: 'center', position: 'relative' }}
          onMouseLeave={() => setShowVolume(false)}
        >
          {showVolume && (
            <div style={{
              position: 'absolute',
              right: '-8px', // Align better within dock padding
              top: '50%',
              transform: 'translateY(-50%)',
              width: '140px',
              height: '36px', // Sleeker pill
              backgroundColor: '#282828',
              borderRadius: '18px',
              display: 'flex',
              alignItems: 'center',
              padding: '0 12px 0 16px',
              boxShadow: '0 6px 16px rgba(0, 0, 0, 0.5)',
              zIndex: 20
            }}>
              {/* Custom Track Slider */}
              <div style={{ flex: 1, height: '4px', position: 'relative', backgroundColor: 'rgba(255, 255, 255, 0.15)', borderRadius: '2px' }}>
                {/* Fill */}
                <div style={{ 
                  position: 'absolute', 
                  top: 0, 
                  left: 0, 
                  height: '100%', 
                  width: `${volume}%`, 
                  backgroundColor: '#fff', 
                  borderRadius: '2px',
                  pointerEvents: 'none'
                }} />
                {/* Invisible Range Input */}
                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  value={volume}
                  onChange={(e) => setVolume(Number(e.target.value))}
                  style={{ 
                    position: 'absolute', 
                    top: '-7px', // increase hit area
                    left: 0, 
                    width: '100%', 
                    height: '18px', 
                    opacity: 0, 
                    cursor: 'pointer',
                    margin: 0
                  }}
                />
              </div>
              <button className="dock-btn" onClick={toggleMute} style={{ fontSize: '16px', color: volume === 0 ? '#fa243c' : '#fff', marginLeft: '12px' }}>
                <i className={volume === 0 ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill"}></i>
              </button>
            </div>
          )}
          <button className="dock-btn" onClick={() => setShowVolume(true)} style={{ fontSize: '18px', color: 'rgba(255, 255, 255, 0.7)' }}>
            <i className={volume === 0 ? "bi bi-volume-mute-fill" : "bi bi-volume-up-fill"}></i>
          </button>
        </div>
      </div>
    </footer>
  );
};

export default PlayerBar;
