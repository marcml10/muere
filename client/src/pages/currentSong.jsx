import { useState, useRef, useEffect, useCallback } from 'react';
import { useLiked } from '../playback/LikedContext';
import { usePlayback } from '../playback/playBack';
import { useQueue } from '../playback/QueueContext';
import { formatDuration } from '../search/resultFilter';

const formatTime = (time) => {
  const seconds = Number(time);
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00';
  return `${Math.floor(seconds / 60)}:${String(Math.floor(seconds % 60)).padStart(2, '0')}`;
};

const SeekBackward10Icon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
    <path d="M3 3v5h5" />
    <text x="12" y="15.5" fontSize="8.5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle">10</text>
  </svg>
);

const SeekForward10Icon = ({ size = 22 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.99 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <text x="12" y="15.5" fontSize="8.5" fontFamily="system-ui, -apple-system, sans-serif" fontWeight="700" fill="currentColor" stroke="none" textAnchor="middle">10</text>
  </svg>
);

const CurrentSongPage = ({ onBack }) => {
  const [isClosing, setIsClosing] = useState(false);
  const closingTimeoutRef = useRef(null);

  const { currentTrack, isPlaying, togglePlayPause, currentTime, duration, seekTo } = usePlayback();
  const {
    queue,
    playQueueItem,
    removeFromQueue,
    setQueue,
    nextTrack,
    previousTrack,
    isShuffle,
    isRepeat,
    toggleShuffle,
    toggleRepeat,
  } = useQueue();
  const { isLiked, toggleLike } = useLiked();

  const handleBack = useCallback(() => {
    if (isClosing) return;
    setIsClosing(true);
    closingTimeoutRef.current = setTimeout(() => {
      onBack();
    }, 950);
  }, [isClosing, onBack]);

  useEffect(() => {
    return () => {
      if (closingTimeoutRef.current) {
        clearTimeout(closingTimeoutRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleBack();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleBack]);

  const effectiveDuration = Number(duration) > 0 ? Number(duration) : Number(currentTrack?.duration) || 0;

  return (
    <main className={`main-content current-song-page${isClosing ? ' is-closing' : ''}`}>
      {currentTrack?.thumbnailUrl && (
        <div className="current-song-aurora" aria-hidden="true">
          <img src={currentTrack.thumbnailUrl} alt="" />
          <span className="current-song-aurora-glow current-song-aurora-glow-one" />
          <span className="current-song-aurora-glow current-song-aurora-glow-two" />
          <span className="current-song-aurora-glow current-song-aurora-glow-three" />
        </div>
      )}
      <header className="header current-song-header">
        <button
          type="button"
          onClick={handleBack}
          className="current-song-back"
          aria-label="Back to previous page"
          title="Back"
          disabled={isClosing}
        >
          <i className="bi bi-chevron-left" />
        </button>
        <span>Now Playing</span>
        <div className="current-song-header-spacer" aria-hidden="true" />
      </header>

      {currentTrack ? (
        <div className="current-song-split-layout">
          <section className="current-song-player" aria-label="Current song player">
            <div className="current-song-art-wrap">
              {currentTrack.thumbnailUrl ? (
                <img className="current-song-art" src={currentTrack.thumbnailUrl} alt={`${currentTrack.title || 'Current song'} artwork`} />
              ) : (
                <div className="current-song-art current-song-placeholder"><i className="bi bi-music-note-beamed" /></div>
              )}
            </div>

            <div className="current-song-meta">
              <div className="current-song-title-block">
                <h1>{currentTrack.title || 'Unknown title'}</h1>
                <p>{currentTrack.artist || 'Unknown artist'}</p>
              </div>
              <button
                type="button"
                className={`current-song-like${isLiked(currentTrack.id) ? ' is-liked' : ''}`}
                aria-label={isLiked(currentTrack.id) ? 'Unlike song' : 'Like song'}
                title={isLiked(currentTrack.id) ? 'Unlike' : 'Like'}
                onClick={() => toggleLike(currentTrack)}
              >
                <i className={isLiked(currentTrack.id) ? 'bi bi-heart-fill' : 'bi bi-heart'} />
              </button>
            </div>

            <div className="current-song-progress">
              <input
                type="range"
                aria-label="Track position"
                min="0"
                max={effectiveDuration || 100}
                value={Math.min(currentTime || 0, effectiveDuration || 100)}
                onChange={(event) => seekTo(Number(event.target.value))}
                style={{ '--progress': `${effectiveDuration ? Math.min((currentTime / effectiveDuration) * 100, 100) : 0}%` }}
              />
              <div><span>{formatTime(currentTime)}</span><span>{formatTime(effectiveDuration)}</span></div>
            </div>

            <div className="current-song-controls">
              <button type="button" className={isShuffle ? 'active' : ''} onClick={toggleShuffle} aria-label="Toggle shuffle" title="Shuffle" style={{ fontSize: '24px' }}>
                <i className="bi bi-shuffle" />
              </button>
              <button type="button" onClick={() => seekTo(Math.max(0, (currentTime || 0) - 10))} aria-label="Seek 10 seconds backward" title="Seek 10 seconds backward">
                <SeekBackward10Icon size={24} />
              </button>
              <button type="button" onClick={previousTrack} aria-label="Previous track" title="Previous" style={{ fontSize: '26px' }}>
                <i className="bi bi-rewind-fill" />
              </button>
              <button type="button" className="current-song-play" onClick={togglePlayPause} aria-label={isPlaying ? 'Pause' : 'Play'} title={isPlaying ? 'Pause' : 'Play'}>
                <i className={isPlaying ? 'bi bi-pause-fill' : 'bi bi-play-fill'} />
              </button>
              <button type="button" onClick={nextTrack} aria-label="Next track" title="Next" style={{ fontSize: '26px' }}>
                <i className="bi bi-fast-forward-fill" />
              </button>
              <button type="button" onClick={() => seekTo(Math.min(effectiveDuration || Infinity, (currentTime || 0) + 10))} aria-label="Seek 10 seconds forward" title="Seek 10 seconds forward">
                <SeekForward10Icon size={24} />
              </button>
              <button type="button" className={isRepeat ? 'active' : ''} onClick={toggleRepeat} aria-label="Toggle repeat" title="Repeat" style={{ fontSize: '24px' }}>
                <i className="bi bi-repeat" />
              </button>
            </div>
          </section>

          <section className="current-song-up-next" aria-label="Queue list">
            <div className="current-song-queue-header">
              <div className="current-song-queue-title-wrap">
                <h2>Up Next</h2>
                {queue.length > 0 && (
                  <span className="current-song-queue-badge">{queue.length}</span>
                )}
              </div>
              {queue.length > 0 && (
                <button
                  type="button"
                  className="current-song-queue-clear"
                  onClick={() => setQueue([])}
                  title="Clear all songs from queue"
                >
                  Clear
                </button>
              )}
            </div>

            <div className="current-song-queue-list">
              {queue.length > 0 ? (
                queue.map((track, index) => (
                  <div
                    key={`${track.id}-${index}`}
                    className="current-song-queue-item"
                    onClick={() => playQueueItem(index)}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        playQueueItem(index);
                      }
                    }}
                  >
                    <div className="current-song-queue-item-art-wrap">
                      {track.thumbnailUrl ? (
                        <img
                          src={track.thumbnailUrl}
                          alt={track.title}
                          className="current-song-queue-item-art"
                        />
                      ) : (
                        <div className="current-song-queue-item-placeholder">
                          <i className="bi bi-music-note" />
                        </div>
                      )}
                    </div>
                    <div className="current-song-queue-item-info">
                      <span className="current-song-queue-item-title">{track.title}</span>
                      <span className="current-song-queue-item-artist">{track.artist}</span>
                    </div>
                    {track.duration > 0 && (
                      <span className="current-song-queue-item-duration">
                        {formatDuration(track.duration)}
                      </span>
                    )}
                    <button
                      type="button"
                      className="current-song-queue-item-remove"
                      aria-label="Remove from queue"
                      title="Remove"
                      onClick={(e) => {
                        e.stopPropagation();
                        removeFromQueue(index);
                      }}
                    >
                      <i className="bi bi-x-lg" />
                    </button>
                  </div>
                ))
              ) : (
                <div className="current-song-queue-empty">
                  <i className="bi bi-music-note-list" />
                  <p className="current-song-queue-empty-title">Queue is empty</p>
                  <p className="current-song-queue-empty-sub">Add songs from Search or Home to play next</p>
                </div>
              )}
            </div>
          </section>
        </div>
      ) : (
        <div className="current-song-empty">
          <i className="bi bi-music-note-beamed" />
          <p>Play a song to see it here.</p>
        </div>
      )}
    </main>
  );
};

export default CurrentSongPage;
