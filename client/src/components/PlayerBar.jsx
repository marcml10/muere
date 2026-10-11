import React, { useState } from 'react';
import { usePlayback } from '../playback/playBack';
import { useQueue } from '../playback/QueueContext';

const PlayerBar = () => {
  const { currentTrack, isPlaying, togglePlayPause, currentTime, duration, seekTo, volume, setVolume, toggleMute } = usePlayback();
  const { nextTrack, previousTrack, isQueueVisible, toggleQueue, isRepeat, isShuffle, toggleRepeat, toggleShuffle } = useQueue();

  const [showVolume, setShowVolume] = useState(false);

  const handleSeek = (e) => {
    seekTo(parseFloat(e.target.value));
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
        <button className="dock-btn" onClick={toggleShuffle} style={{ fontSize: '14px', color: isShuffle ? '#fa243c' : '' }}>
          <i className="bi bi-shuffle"></i>
        </button>
        <button className="dock-btn" onClick={previousTrack} style={{ fontSize: '19px', color: '#fff' }}>
          <i className="bi bi-rewind-fill"></i>
        </button>
        <button className="dock-btn" onClick={togglePlayPause} style={{ fontSize: '31px', margin: '0 -4px', color: '#fff' }}>
          {isPlaying ? (
            <i className="bi bi-pause-fill"></i>
          ) : (
            <i className="bi bi-play-fill"></i>
          )}
        </button>
        <button className="dock-btn" onClick={nextTrack} style={{ fontSize: '19px', color: '#fff' }}>
          <i className="bi bi-fast-forward-fill"></i>
        </button>
        <button className="dock-btn" onClick={toggleRepeat} style={{ fontSize: '14px', color: isRepeat ? '#fa243c' : '' }}>
          <i className="bi bi-repeat"></i>
        </button>
      </div>

      {/* Center: Album Art + Track Info */}
      <div className="dock-track">
        <div className="dock-art" style={{ transform: 'translateY(-2px)' }}>
          {currentTrack?.thumbnailUrl ? (
            <img src={currentTrack.thumbnailUrl} alt={currentTrack.title} />
          ) : (
            <span style={{ fontSize: '16px' }}>🎵</span>
          )}
        </div>
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
