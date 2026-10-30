import { useState, useEffect } from 'react';
import { usePlayback } from '../playback/playBack';
import { useQueue } from '../playback/QueueContext';
import { useRecentlyPlayed } from '../recommendations/recommendations';
import { useLiked } from '../playback/LikedContext';

const menuItemStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '8px 10px',
  border: 0,
  borderRadius: '5px',
  background: 'transparent',
  color: '#fff',
  textAlign: 'left',
  fontSize: '13px',
  cursor: 'pointer'
};

const renderTitleWithBadge = (rawTitle) => {
  const isExplicit = /\[E\]|\(Explicit\)|\[Explicit\]/i.test(rawTitle);
  const clean = String(rawTitle || '')
    .replace(/\s*\[E\]\s*/gi, '')
    .replace(/\s*\(Explicit\)\s*/gi, '')
    .replace(/\s*\[Explicit\]\s*/gi, '')
    .trim();

  return (
    <div className="trending-track-title-row">
      <span className="trending-track-title" title={clean || rawTitle}>
        {clean || rawTitle || 'Unknown title'}
      </span>
      {isExplicit && (
        <span
          style={{
            fontSize: '9px',
            fontWeight: 700,
            padding: '1px 3px',
            borderRadius: '2px',
            background: 'rgba(255, 255, 255, 0.22)',
            color: 'rgba(255, 255, 255, 0.9)',
            textTransform: 'uppercase',
            lineHeight: 1,
            flexShrink: 0
          }}
        >
          E
        </span>
      )}
    </div>
  );
};

const MainContent = () => {
  const { playTrack } = usePlayback();
  const { addToQueue, isQueued, toggleSongInQueue } = useQueue();
  const recentlyPlayed = useRecentlyPlayed(12);
  const { likedSongs, isLiked, toggleLike } = useLiked();

  const [trendingTracks, setTrendingTracks] = useState([]);
  const [isLoadingTrending, setIsLoadingTrending] = useState(true);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [playlistFolders, setPlaylistFolders] = useState(() => {
    try {
      const stored = JSON.parse(localStorage.getItem('muer_playlist_folders') || '[]');
      return Array.isArray(stored) ? stored : [];
    } catch {
      return [];
    }
  });

  const addSongToPlaylist = (folderId, song) => {
    const updatedFolders = playlistFolders.map((folder) => {
      if (folder.id !== folderId) return folder;
      const songs = Array.isArray(folder.songs) ? folder.songs : [];
      return songs.some((entry) => entry.id === song.id) ? folder : { ...folder, songs: [...songs, song] };
    });
    setPlaylistFolders(updatedFolders);
    try {
      localStorage.setItem('muer_playlist_folders', JSON.stringify(updatedFolders));
    } catch (e) {
      console.error('Failed to save playlist folders:', e);
    }
    setOpenMenuId(null);
    setOpenSubmenu(null);
  };

  useEffect(() => {
    let isMounted = true;
    const fetchTrending = async () => {
      try {
        setIsLoadingTrending(true);
        const res = await fetch('http://localhost:3000/api/trending');
        if (!res.ok) throw new Error(`HTTP error ${res.status}`);
        const data = await res.json();
        const tracks = Array.isArray(data.tracks) ? data.tracks : (Array.isArray(data) ? data : []);
        if (isMounted) {
          setTrendingTracks(tracks);
        }
      } catch (err) {
        console.error('Failed to load trending songs:', err);
      } finally {
        if (isMounted) {
          setIsLoadingTrending(false);
        }
      }
    };

    fetchTrending();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleDocumentClick = () => {
      setOpenMenuId(null);
      setOpenSubmenu(null);
    };
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        setOpenMenuId(null);
        setOpenSubmenu(null);
      }
    };
    document.addEventListener('click', handleDocumentClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <main className="main-content">
      <header className="header">
        <h1>Home</h1>
      </header>

      {/* Recently Played Section */}
      <section className="recently-played-section" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>
          Recently Played
        </h2>

        {recentlyPlayed && recentlyPlayed.length > 0 ? (
          <div 
            className="recently-played-scroll-row horizontal-scroll-row"
            style={{ 
              display: 'flex', 
              gap: '24px', 
              overflowX: 'auto',
              overflowY: 'visible',
              paddingTop: '6px',
              paddingBottom: '16px',
              width: '100%',
              scrollBehavior: 'smooth',
              WebkitOverflowScrolling: 'touch',
              scrollbarWidth: 'none',
              msOverflowStyle: 'none'
            }}
          >
            {recentlyPlayed.map((song, index) => {
              const itemKey = `rp-${song.id || index}`;
              const isMenuOpen = openMenuId === itemKey;

              return (
                <div 
                  key={itemKey}
                  className={`muer-media-card muer-media-card-shelf ${isMenuOpen ? 'has-active-menu' : ''}`}
                  tabIndex={0}
                  onClick={() => {
                    if (addToQueue) {
                      addToQueue(recentlyPlayed, index);
                    } else if (playTrack) {
                      playTrack(song);
                    }
                  }}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      if (addToQueue) {
                        addToQueue(recentlyPlayed, index);
                      } else if (playTrack) {
                        playTrack(song);
                      }
                    }
                  }}
                  title={`Play ${song.title || 'song'}`}
                >
                  {/* Artwork Container (16:9 ratio preserved) */}
                  <div className="muer-media-art-wrap">
                    {song.thumbnailUrl ? (
                      <img 
                        src={song.thumbnailUrl} 
                        alt={song.title || 'Artwork'}
                        className="muer-media-art"
                      />
                    ) : (
                      <div className="muer-media-art-placeholder">
                        🎵
                      </div>
                    )}

                    {/* Bottom-left: Frosted circular Play button */}
                    <button
                      type="button"
                      className="muer-media-btn muer-media-btn-play"
                      aria-label={`Play ${song.title || 'song'}`}
                      title="Play"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (addToQueue) {
                          addToQueue(recentlyPlayed, index);
                        } else if (playTrack) {
                          playTrack(song);
                        }
                      }}
                    >
                      <i className="bi bi-play-fill" style={{ fontSize: '20px', marginLeft: '2px', color: '#fff' }} />
                    </button>

                    {/* Bottom-right: Frosted circular Three-dots button */}
                    <button
                      type="button"
                      className="muer-media-btn muer-media-btn-menu"
                      aria-label={`More options for ${song.title || 'song'}`}
                      title="More options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(isMenuOpen ? null : itemKey);
                        setOpenSubmenu(null);
                      }}
                    >
                      <i className="bi bi-three-dots" style={{ fontSize: '18px', color: '#fff' }} />
                    </button>
                  </div>

                  {/* Song Title - Enlarged crisp typography */}
                  <div className="muer-media-title" title={song.title}>
                    {song.title || 'Unknown title'}
                  </div>

                  {/* Artist Name - Enlarged secondary typography */}
                  <div className="muer-media-artist" title={song.artist}>
                    {song.artist || 'Unknown artist'}
                  </div>

                  {/* Contextual Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      className="muer-card-menu-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenSubmenu(openSubmenu === 'playlist' ? null : 'playlist')}
                        style={menuItemStyle}
                      >
                        <i className="bi bi-music-note-list" /> Add to playlist <i className="bi bi-chevron-right" style={{ marginLeft: 'auto' }} />
                      </button>

                      {openSubmenu === 'playlist' && (
                        <div style={{ maxHeight: '160px', overflowY: 'auto', margin: '2px 0 6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isLiked(song.id)) toggleLike(song);
                              setOpenMenuId(null);
                              setOpenSubmenu(null);
                            }}
                            style={menuItemStyle}
                          >
                            <i className={isLiked(song.id) ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isLiked(song.id) ? 'var(--am-accent)' : 'inherit' }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              Liked Songs {isLiked(song.id) ? '✓' : ''}
                            </span>
                          </button>
                          {playlistFolders.map((folder) => (
                            <button type="button" key={folder.id} onClick={() => addSongToPlaylist(folder.id, song)} style={menuItemStyle}>
                              <i className="bi bi-folder" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          toggleSongInQueue(song);
                          setOpenMenuId(null);
                          setOpenSubmenu(null);
                        }}
                        style={menuItemStyle}
                      >
                        <i className={isQueued(song.id) ? "bi bi-check-circle" : "bi bi-plus-circle"} /> {isQueued(song.id) ? 'Remove from queue' : 'Add to queue'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          toggleLike(song);
                          setOpenMenuId(null);
                          setOpenSubmenu(null);
                        }}
                        style={menuItemStyle}
                      >
                        <i className={isLiked(song.id) ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isLiked(song.id) ? 'var(--am-accent)' : 'inherit' }} />
                        {isLiked(song.id) ? 'Remove from Liked' : 'Like'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: 'var(--am-text-secondary)', fontSize: '14px', textAlign: 'left', padding: '8px 0' }}>
            No songs played yet. Play any track to see it here!
          </div>
        )}
      </section>
      
      {/* Your Choices */}
      <section className="top-picks">
        <h2>Your Choices</h2>
        {likedSongs.length > 0 ? (
          <div className="album-grid">
            {likedSongs.map((song, index) => {
              const itemKey = `yc-${song.id || index}`;
              const isMenuOpen = openMenuId === itemKey;

              return (
                <div
                  key={itemKey}
                  className={`muer-media-card ${isMenuOpen ? 'has-active-menu' : ''}`}
                  tabIndex={0}
                  onClick={() => {
                    if (addToQueue) {
                      addToQueue(likedSongs, index);
                    } else if (playTrack) {
                      playTrack(song);
                    }
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter' || event.key === ' ') {
                      event.preventDefault();
                      if (addToQueue) {
                        addToQueue(likedSongs, index);
                      } else if (playTrack) {
                        playTrack(song);
                      }
                    }
                  }}
                  title={`Play ${song.title || 'song'}`}
                >
                  {/* Artwork Container (16:9 ratio preserved) */}
                  <div className="muer-media-art-wrap">
                    {song.thumbnailUrl ? (
                      <img 
                        src={song.thumbnailUrl} 
                        alt={song.title || 'Artwork'} 
                        className="muer-media-art"
                      />
                    ) : (
                      <div className="muer-media-art-placeholder">
                        <i className="bi bi-music-note-beamed" style={{ fontSize: '32px', color: 'var(--am-text-secondary)' }} />
                      </div>
                    )}

                    {/* Bottom-left: Frosted circular Play button */}
                    <button
                      type="button"
                      className="muer-media-btn muer-media-btn-play"
                      aria-label={`Play ${song.title || 'song'}`}
                      title="Play"
                      onClick={(e) => {
                        e.stopPropagation();
                        if (addToQueue) {
                          addToQueue(likedSongs, index);
                        } else if (playTrack) {
                          playTrack(song);
                        }
                      }}
                    >
                      <i className="bi bi-play-fill" style={{ fontSize: '20px', marginLeft: '2px', color: '#fff' }} />
                    </button>

                    {/* Bottom-right: Frosted circular Three-dots button */}
                    <button
                      type="button"
                      className="muer-media-btn muer-media-btn-menu"
                      aria-label={`More options for ${song.title || 'song'}`}
                      title="More options"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenMenuId(isMenuOpen ? null : itemKey);
                        setOpenSubmenu(null);
                      }}
                    >
                      <i className="bi bi-three-dots" style={{ fontSize: '18px', color: '#fff' }} />
                    </button>
                  </div>

                  {/* Song Title - Enlarged crisp typography */}
                  <div className="muer-media-title" title={song.title}>
                    {song.title || 'Unknown title'}
                  </div>

                  {/* Artist Name - Enlarged secondary typography */}
                  <div className="muer-media-artist" title={song.artist}>
                    {song.artist || 'Unknown artist'}
                  </div>

                  {/* Contextual Dropdown Menu */}
                  {isMenuOpen && (
                    <div
                      className="muer-card-menu-dropdown"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        type="button"
                        onClick={() => setOpenSubmenu(openSubmenu === 'playlist' ? null : 'playlist')}
                        style={menuItemStyle}
                      >
                        <i className="bi bi-music-note-list" /> Add to playlist <i className="bi bi-chevron-right" style={{ marginLeft: 'auto' }} />
                      </button>

                      {openSubmenu === 'playlist' && (
                        <div style={{ maxHeight: '160px', overflowY: 'auto', margin: '2px 0 6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
                          <button
                            type="button"
                            onClick={() => {
                              if (!isLiked(song.id)) toggleLike(song);
                              setOpenMenuId(null);
                              setOpenSubmenu(null);
                            }}
                            style={menuItemStyle}
                          >
                            <i className={isLiked(song.id) ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isLiked(song.id) ? 'var(--am-accent)' : 'inherit' }} />
                            <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              Liked Songs {isLiked(song.id) ? '✓' : ''}
                            </span>
                          </button>
                          {playlistFolders.map((folder) => (
                            <button type="button" key={folder.id} onClick={() => addSongToPlaylist(folder.id, song)} style={menuItemStyle}>
                              <i className="bi bi-folder" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                            </button>
                          ))}
                        </div>
                      )}

                      <button
                        type="button"
                        onClick={() => {
                          toggleSongInQueue(song);
                          setOpenMenuId(null);
                          setOpenSubmenu(null);
                        }}
                        style={menuItemStyle}
                      >
                        <i className={isQueued(song.id) ? "bi bi-check-circle" : "bi bi-plus-circle"} /> {isQueued(song.id) ? 'Remove from queue' : 'Add to queue'}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          toggleLike(song);
                          setOpenMenuId(null);
                          setOpenSubmenu(null);
                        }}
                        style={menuItemStyle}
                      >
                        <i className={isLiked(song.id) ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isLiked(song.id) ? 'var(--am-accent)' : 'inherit' }} />
                        {isLiked(song.id) ? 'Remove from Liked' : 'Like'}
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div style={{ color: 'var(--am-text-secondary)', fontSize: '14px', padding: '8px 0' }}>
            Like songs to see them here.
          </div>
        )}
      </section>

      {/* Trending Worldwide */}
      <section className="trending-section" style={{ marginTop: '40px', marginBottom: '60px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h2 style={{ fontSize: '22px', fontWeight: 700, margin: 0, color: '#fff', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
            Trending Worldwide <i className="bi bi-chevron-right" style={{ fontSize: '15px', color: 'rgba(255,255,255,0.5)' }} />
          </h2>
        </div>

        {isLoadingTrending && trendingTracks.length === 0 ? (
          <div style={{ color: 'var(--am-text-secondary)', fontSize: '14px', textAlign: 'left', padding: '12px 0' }}>
            Loading trending songs...
          </div>
        ) : trendingTracks.length > 0 ? (
          <div className="trending-column-grid">
            {trendingTracks.map((song, index) => (
              <div 
                key={song.id || index}
                className="trending-track-item"
                role="button"
                tabIndex={0}
                onClick={() => {
                  if (addToQueue) {
                    addToQueue(trendingTracks, index);
                  } else if (playTrack) {
                    playTrack(song);
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    if (addToQueue) addToQueue(trendingTracks, index);
                  }
                }}
              >
                {/* 46x46 Square Artwork Thumbnail */}
                <div className="trending-track-thumb-wrap">
                  {song.thumbnailUrl ? (
                    <img src={song.thumbnailUrl} alt={song.title} className="trending-track-thumb" />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#262626', fontSize: '18px' }}>
                      🎵
                    </div>
                  )}
                  <div className="trending-thumb-play">
                    <i className="bi bi-play-fill" />
                  </div>
                </div>

                {/* Title & Artist */}
                <div className="trending-track-info">
                  {renderTitleWithBadge(song.title)}
                  <div className="trending-track-artist" title={song.artist}>
                    {song.artist || 'Trending Music'}
                  </div>
                </div>

                {/* Three-dots menu button */}
                <button
                  type="button"
                  className="trending-more-btn"
                  aria-label="More options"
                  title="More options"
                  onClick={(e) => {
                    e.stopPropagation();
                    setOpenMenuId(openMenuId === (song.id || index) ? null : (song.id || index));
                    setOpenSubmenu(null);
                  }}
                >
                  <i className="bi bi-three-dots" />
                </button>

                {/* Contextual Dropdown Menu */}
                {openMenuId === (song.id || index) && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    onMouseLeave={() => { setOpenMenuId(null); setOpenSubmenu(null); }}
                    style={{
                      position: 'absolute',
                      top: '44px',
                      right: '8px',
                      zIndex: 60,
                      width: '230px',
                      padding: '8px',
                      background: 'rgba(25, 25, 25, 0.92)',
                      backdropFilter: 'blur(50px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(50px) saturate(180%)',
                      border: '1px solid rgba(255, 255, 255, 0.12)',
                      borderRadius: '16px',
                      boxShadow: '0 12px 36px rgba(0,0,0,0.7)'
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setOpenSubmenu(openSubmenu === 'playlist' ? null : 'playlist')}
                      style={menuItemStyle}
                    >
                      <i className="bi bi-music-note-list" /> Add to playlist <i className="bi bi-chevron-right" style={{ marginLeft: 'auto' }} />
                    </button>

                    {openSubmenu === 'playlist' && (
                      <div style={{ maxHeight: '160px', overflowY: 'auto', margin: '2px 0 6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
                        <button
                          type="button"
                          onClick={() => {
                            if (!isLiked(song.id)) toggleLike(song);
                            setOpenMenuId(null);
                            setOpenSubmenu(null);
                          }}
                          style={menuItemStyle}
                        >
                          <i className={isLiked(song.id) ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isLiked(song.id) ? 'var(--am-accent)' : 'inherit' }} />
                          <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                            Liked Songs {isLiked(song.id) ? '✓' : ''}
                          </span>
                        </button>
                        {playlistFolders.map((folder) => (
                          <button type="button" key={folder.id} onClick={() => addSongToPlaylist(folder.id, song)} style={menuItemStyle}>
                            <i className="bi bi-folder" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                          </button>
                        ))}
                      </div>
                    )}

                    <button
                      type="button"
                      onClick={() => {
                        toggleSongInQueue(song);
                        setOpenMenuId(null);
                        setOpenSubmenu(null);
                      }}
                      style={menuItemStyle}
                    >
                      <i className={isQueued(song.id) ? "bi bi-check-circle" : "bi bi-plus-circle"} /> {isQueued(song.id) ? 'Remove from queue' : 'Add to queue'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        toggleLike(song);
                        setOpenMenuId(null);
                        setOpenSubmenu(null);
                      }}
                      style={menuItemStyle}
                    >
                      <i className={isLiked(song.id) ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isLiked(song.id) ? 'var(--am-accent)' : 'inherit' }} />
                      {isLiked(song.id) ? 'Remove from Liked' : 'Like'}
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--am-text-secondary)', fontSize: '14px', textAlign: 'left', padding: '12px 0' }}>
            No trending songs available at the moment.
          </div>
        )}
      </section>
    </main>
  );
};

export default MainContent;
