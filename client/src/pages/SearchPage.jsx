import { useState } from 'react';
import { useQueue } from '../playback/QueueContext';
import { useLiked } from '../playback/LikedContext';
import { usePlayback } from '../playback/playBack';
import SearchBar from '../search/SearchBar';
import { formatViewCount, formatDuration, formatSubscriberCount } from '../search/resultFilter';

const SearchPage = () => {
  const { addToQueue, toggleSongInQueue, isQueued } = useQueue();
  const { isLiked, toggleLike } = useLiked();
  const { startSleepTimer } = usePlayback();
  const [savedSearch] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem('muer_last_search_results') || 'null');
      return saved && Array.isArray(saved.tracks) ? saved : null;
    } catch {
      return null;
    }
  });
  const [searchResults, setSearchResults] = useState(() => savedSearch?.tracks || null);
  const [artistChannel, setArtistChannel] = useState(() => savedSearch?.channel || null);
  const [isLoading, setIsLoading] = useState(false);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [openSubmenu, setOpenSubmenu] = useState(null);
  const [songInfo, setSongInfo] = useState(null);
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
    localStorage.setItem('muer_playlist_folders', JSON.stringify(updatedFolders));
    setOpenMenuId(null);
    setOpenSubmenu(null);
  };

  const handleSearchResults = (data) => {
    if (!data) {
      setSearchResults(null);
      setArtistChannel(null);
      try {
        localStorage.removeItem('muer_last_search_results');
      } catch (error) {
        console.error('Failed to clear saved search results:', error);
      }
      return;
    }
    if (Array.isArray(data)) {
      setSearchResults(data);
      setArtistChannel(null);
      try {
        localStorage.setItem('muer_last_search_results', JSON.stringify({ tracks: data, channel: null }));
      } catch (error) {
        console.error('Failed to save search results:', error);
      }
    } else if (typeof data === 'object') {
      const tracks = Array.isArray(data.tracks) ? data.tracks : (Array.isArray(data.results) ? data.results : []);
      setSearchResults(tracks);
      setArtistChannel(data.channel || null);
      try {
        localStorage.setItem('muer_last_search_results', JSON.stringify({ tracks, channel: data.channel || null }));
      } catch (error) {
        console.error('Failed to save search results:', error);
      }
    }
  };

  return (
    <main className="main-content">
      <header className="header" style={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        width: '100%', 
        marginBottom: '40px'
      }}>
        <div style={{ 
          flex: 1, 
          maxWidth: '720px', 
          width: '100%', 
          transition: 'max-width 0.3s ease', 
          margin: '0 auto' 
        }}>
          <SearchBar onSearchResults={handleSearchResults} onLoadingChange={setIsLoading} />
        </div>
      </header>
      
      <section className="top-picks">
        {isLoading ? (
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            alignItems: 'center', 
            justifyContent: 'center', 
            minHeight: '360px', 
            gap: '18px' 
          }}>
            <div 
              style={{ 
                width: '42px', 
                height: '42px', 
                border: '3px solid rgba(255, 255, 255, 0.15)', 
                borderTopColor: '#fff', 
                borderRadius: '50%', 
                animation: 'spin 0.8s linear infinite' 
              }} 
            />
            <span style={{ color: 'var(--am-text-secondary)', fontSize: '15px', letterSpacing: '0.2px' }}>
              Searching...
            </span>
          </div>
        ) : (
          <>
            {!searchResults && (
              <h2 style={{ textAlign: 'left', marginBottom: '30px' }}>
                Browse Categories
              </h2>
            )}
            
            <div className={searchResults ? "" : "category-grid"}>
          {searchResults && searchResults.length > 0 ? (
            <div className="spotify-search-layout" style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 380px) minmax(0, 1fr)', gap: '32px', width: '100%', alignItems: 'flex-start' }}>
              {/* Left Column: Top Result & Artist */}
              <div style={{ width: '100%', minWidth: 0, position: 'sticky', top: '20px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>Top result</h2>
                <div 
                  style={{ 
                    backgroundColor: '#1F1F1F', 
                    borderRadius: '8px', 
                    padding: '20px', 
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    position: 'relative'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor = '#282828';
                    const playBtn = e.currentTarget.querySelector('.top-result-play');
                    if (playBtn) playBtn.style.opacity = '1';
                    if (playBtn) playBtn.style.transform = 'translateY(0)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = '#1F1F1F';
                    const playBtn = e.currentTarget.querySelector('.top-result-play');
                    if (playBtn) playBtn.style.opacity = '0';
                    if (playBtn) playBtn.style.transform = 'translateY(8px)';
                  }}
                  onClick={() => addToQueue(searchResults, 0)}
                >
                  <img 
                    src={searchResults[0].thumbnailUrl} 
                    alt={searchResults[0].title} 
                    style={{ width: '164px', height: '92px', borderRadius: '4px', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                  />
                  <h3 style={{ fontSize: '32px', fontWeight: 400, color: '#fff', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.5px' }}>
                    {searchResults[0].title}
                  </h3>
                  <div style={{ fontSize: '14px', color: '#b3b3b3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ color: '#b3b3b3' }}>Song</span>
                    <span>• {searchResults[0].artist}</span>
                    {searchResults[0].duration > 0 && <span>• {formatDuration(searchResults[0].duration)}</span>}
                    {searchResults[0].viewCount > 0 && <span>• {formatViewCount(searchResults[0].viewCount)}</span>}
                  </div>
                  
                  {/* Floating Play Button */}
                  <div 
                    className="top-result-play"
                    style={{
                      position: 'absolute',
                      bottom: '20px',
                      right: '20px',
                      width: '48px',
                      height: '48px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      fontSize: '20px',
                      opacity: 0,
                      transform: 'translateY(8px)',
                      transition: 'all 0.3s ease',
                      boxShadow: '0 8px 8px rgba(0,0,0,0.3)'
                    }}
                  >
                    <i className="bi bi-play-fill" style={{ marginLeft: '2px', color: '#000' }}></i>
                  </div>
                </div>

                {/* Artists Section under Top result */}
                {artistChannel && (
                  <div style={{ marginTop: '24px' }}>
                    <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>Artists</h2>
                    <div 
                      style={{ 
                        backgroundColor: '#1F1F1F', 
                        borderRadius: '8px', 
                        padding: '20px', 
                        cursor: 'pointer', 
                        transition: 'background-color 0.2s',
                        position: 'relative',
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-start'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = '#282828';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = '#1F1F1F';
                      }}
                      onClick={() => addToQueue(searchResults, 0)}
                    >
                      {/* Circular Channel Logo Frame */}
                      <div style={{ 
                        width: '92px', 
                        height: '92px', 
                        borderRadius: '50%', 
                        overflow: 'hidden', 
                        marginBottom: '16px', 
                        boxShadow: '0 8px 24px rgba(0,0,0,0.5)',
                        backgroundColor: '#282828',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0
                      }}>
                        <img 
                          src={artistChannel.thumbnailUrl} 
                          alt={artistChannel.name} 
                          style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} 
                        />
                      </div>

                      <h3 style={{ 
                        fontSize: '26px', 
                        fontWeight: 'bold', 
                        color: '#fff', 
                        margin: '0 0 8px 0', 
                        whiteSpace: 'nowrap', 
                        overflow: 'hidden', 
                        textOverflow: 'ellipsis', 
                        letterSpacing: '-0.5px',
                        maxWidth: '100%'
                      }}>
                        {artistChannel.name}
                      </h3>

                      <div style={{ fontSize: '14px', color: '#b3b3b3', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                          padding: '2px 8px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '500', 
                          color: '#fff' 
                        }}>
                          Artist
                        </span>
                        {artistChannel.subscriberCount > 0 && (
                          <span>• {formatSubscriberCount(artistChannel.subscriberCount)}</span>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Songs List */}
              <div style={{ width: '100%', minWidth: 0 }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>Songs</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {searchResults.slice(0, 20).map((item, index) => (
                    <div 
                      key={item.id || index}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '8px 16px', 
                        borderRadius: '4px', 
                        cursor: 'pointer',
                        transition: 'background-color 0.2s',
                        gap: '16px'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                        const playIcon = e.currentTarget.querySelector('.song-play-icon');
                        if (playIcon) playIcon.style.opacity = '1';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent';
                        const playIcon = e.currentTarget.querySelector('.song-play-icon');
                        if (playIcon) playIcon.style.opacity = '0';
                      }}
                      onClick={() => addToQueue(searchResults, index)}
                    >
                      <div style={{ position: 'relative', width: '72px', height: '40px', flexShrink: 0, overflow: 'hidden', borderRadius: '4px' }}>
                        <img 
                          src={item.thumbnailUrl} 
                          alt={item.title} 
                          style={{ width: '100%', height: '100%', borderRadius: '4px', objectFit: 'cover' }} 
                        />
                        <div 
                          className="song-play-icon"
                          style={{
                            position: 'absolute',
                            top: 0, left: 0, right: 0, bottom: 0,
                            backgroundColor: 'rgba(0,0,0,0.5)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            opacity: 0,
                            transition: 'opacity 0.2s',
                            color: '#fff',
                            fontSize: '16px',
                            borderRadius: '4px'
                          }}
                        >
                          <i className="bi bi-play-fill"></i>
                        </div>
                      </div>
                      
                      <div style={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', textAlign: 'left' }}>
                        <div style={{ color: '#fff', fontSize: '16px', fontWeight: 400, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                        <div style={{ color: '#b3b3b3', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.artist}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3', fontSize: '14px', marginLeft: 'auto', flexShrink: 0 }}>
                        {/* Grouped Like button, + button, and song duration */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <button 
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: isLiked(item.id) ? '#ff2d55' : '#b3b3b3', 
                              cursor: 'pointer', 
                              padding: '2px', 
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.2s ease, transform 0.15s ease'
                            }}
                            title={isLiked(item.id) ? "Unlike" : "Like"}
                            onMouseEnter={(e) => {
                              if (!isLiked(item.id)) e.currentTarget.style.color = '#fff';
                              e.currentTarget.style.transform = 'scale(1.15)';
                            }}
                            onMouseLeave={(e) => {
                              if (!isLiked(item.id)) e.currentTarget.style.color = '#b3b3b3';
                              e.currentTarget.style.transform = 'scale(1)';
                            }}
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleLike(item);
                            }}
                          >
                            <i className={isLiked(item.id) ? "bi bi-heart-fill" : "bi bi-heart"}></i>
                          </button>

                          <span style={{ 
                            fontSize: '13px', 
                            color: 'rgba(255, 255, 255, 0.75)', 
                            fontVariantNumeric: 'tabular-nums',
                            minWidth: '36px',
                            textAlign: 'right'
                          }}>
                            {formatDuration(item.duration)}
                          </span>
                        </div>

                        <div style={{ position: 'relative' }}>
                          <button
                            type="button"
                            aria-label={`More options for ${item.title}`}
                            title="More options"
                            onClick={(event) => {
                              event.stopPropagation();
                              setOpenMenuId(openMenuId === item.id ? null : item.id);
                              setOpenSubmenu(null);
                            }}
                            style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', padding: '4px', fontSize: '18px', display: 'flex', alignItems: 'center' }}
                          >
                            <i className="bi bi-three-dots-vertical" />
                          </button>
                          {openMenuId === item.id && (
                            <div
                              onClick={(event) => event.stopPropagation()}
                              onMouseLeave={() => { setOpenMenuId(null); setOpenSubmenu(null); }}
                              style={{ position: 'absolute', top: '30px', right: 0, zIndex: 30, width: '240px', padding: '8px', background: 'rgba(255, 255, 255, 0.07)', backdropFilter: 'blur(75px) saturate(180%)', WebkitBackdropFilter: 'blur(75px) saturate(180%)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '28px', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}
                            >
                              <button type="button" onClick={() => setOpenSubmenu(openSubmenu === 'playlist' ? null : 'playlist')} style={menuItemStyle}>
                                <i className="bi bi-music-note-list" /> Add to playlist <i className="bi bi-chevron-right" style={{ marginLeft: 'auto' }} />
                              </button>
                              {openSubmenu === 'playlist' && (
                                <div style={{ maxHeight: '180px', overflowY: 'auto', margin: '2px 0 6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      if (!isLiked(item.id)) toggleLike(item);
                                      setOpenMenuId(null);
                                      setOpenSubmenu(null);
                                    }}
                                    style={menuItemStyle}
                                  >
                                    <i className={isLiked(item.id) ? "bi bi-heart-fill" : "bi bi-heart"} style={{ color: isLiked(item.id) ? 'var(--am-accent)' : 'inherit' }} />
                                    <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                      Liked Songs {isLiked(item.id) ? '✓' : ''}
                                    </span>
                                  </button>
                                  {playlistFolders.map((folder) => (
                                    <button type="button" key={folder.id} onClick={() => addSongToPlaylist(folder.id, item)} style={menuItemStyle}>
                                      <i className="bi bi-folder" /> <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{folder.name}</span>
                                    </button>
                                  ))}
                                </div>
                              )}
                              <button type="button" onClick={() => setOpenSubmenu(openSubmenu === 'sleep' ? null : 'sleep')} style={menuItemStyle}>
                                <i className="bi bi-moon-stars" /> Sleep timer <i className="bi bi-chevron-right" style={{ marginLeft: 'auto' }} />
                              </button>
                              {openSubmenu === 'sleep' && (
                                <div style={{ margin: '2px 0 6px', paddingLeft: '8px', borderLeft: '1px solid rgba(255,255,255,0.12)' }}>
                                  {[5, 10, 15, 30, 60].map((minutes) => (
                                    <button type="button" key={minutes} onClick={() => { startSleepTimer(minutes); setOpenMenuId(null); setOpenSubmenu(null); }} style={menuItemStyle}>
                                      <i className="bi bi-clock" /> {minutes} minutes
                                    </button>
                                  ))}
                                </div>
                              )}
                              <button
                                type="button"
                                onClick={() => {
                                  toggleSongInQueue(item);
                                  setOpenMenuId(null);
                                  setOpenSubmenu(null);
                                }}
                                style={menuItemStyle}
                                onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; }}
                                onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}
                              >
                                <i className={isQueued(item.id) ? "bi bi-check-circle" : "bi bi-plus-circle"} /> {isQueued(item.id) ? 'Remove from queue' : 'Add to queue'}
                              </button>
                              <button type="button" onClick={() => { setSongInfo(item); setOpenMenuId(null); }} style={menuItemStyle} onMouseEnter={(e) => { e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.08)'; }} onMouseLeave={(e) => { e.currentTarget.style.backgroundColor = 'transparent'; }}>
                                <i className="bi bi-info-circle" /> Song info
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            // Full list of Apple Music categories
            [
              { name: 'Spatial Audio', color: '#ff2c55' },
              { name: 'Apple Music Live', color: '#2e2e2e' },
              { name: 'Pop', color: '#ff7c1b' },
              { name: 'Hip-Hop', color: '#8d3b25' },
              { name: 'Country', color: '#d8b671' },
              { name: 'R&B', color: '#bd2445' },
              { name: 'Alternative', color: '#5eb3a1' },
              { name: 'Rock', color: '#c72e29' },
              { name: 'Dance', color: '#3d2568' },
              { name: 'Electronic', color: '#447b9d' },
              { name: 'Jazz', color: '#cd7c2f' },
              { name: 'Classical', color: '#2d6092' },
              { name: 'Latin', color: '#de4374' },
              { name: 'K-Pop', color: '#e55986' },
              { name: 'Acoustic', color: '#f07937' },
              { name: 'Chill', color: '#a0314b' },
              { name: 'Decades', color: '#904250' },
              { name: 'Focus', color: '#494447' },
              { name: 'Fitness', color: '#246b9a' },
              { name: 'Kids & Family', color: '#df4a62' }
            ].map((cat, idx) => (
              <div className="category-card" key={idx} style={{ cursor: 'pointer' }}>
                <div 
                  className="category-art" 
                  style={{ 
                    backgroundColor: cat.color, 
                    display: 'flex', 
                    alignItems: 'flex-end', 
                    padding: '16px',
                    boxSizing: 'border-box'
                  }}
                >
                  <span style={{ 
                    color: '#fff', 
                    fontWeight: 'bold', 
                    fontSize: '18px',
                    textShadow: '0 2px 4px rgba(0,0,0,0.3)'
                  }}>
                    {cat.name}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
        </>
      )}
      </section>
      {songInfo && (
        <div onClick={() => setSongInfo(null)} style={{ position: 'fixed', inset: 0, zIndex: 100, display: 'grid', placeItems: 'center', padding: '20px', background: 'rgba(0,0,0,0.72)' }}>
          <section role="dialog" aria-modal="true" aria-labelledby="song-info-title" onClick={(event) => event.stopPropagation()} onMouseLeave={() => setSongInfo(null)} style={{ width: 'min(440px, 100%)', padding: '24px', borderRadius: '28px', background: 'rgba(30,30,30,0.25)', backdropFilter: 'blur(75px) saturate(180%)', WebkitBackdropFilter: 'blur(75px) saturate(180%)', border: '1px solid rgba(255,255,255,0.06)', color: '#fff', boxShadow: '0 8px 32px rgba(0,0,0,0.6)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px' }}>
              <h2 id="song-info-title" style={{ margin: 0, fontSize: '20px' }}>Song info</h2>
              <button type="button" aria-label="Close song info" onClick={() => setSongInfo(null)} style={{ border: 0, background: 'transparent', color: '#b3b3b3', cursor: 'pointer', fontSize: '20px' }}><i className="bi bi-x-lg" /></button>
            </div>
            {songInfo.thumbnailUrl && <img src={songInfo.thumbnailUrl} alt="" style={{ display: 'block', width: '100%', aspectRatio: '16 / 9', objectFit: 'cover', borderRadius: '8px', marginBottom: '16px' }} />}
            <h3 style={{ margin: '0 0 6px', fontSize: '18px', fontWeight: 400 }}>{songInfo.title || 'Unknown title'}</h3>
            <p style={{ margin: '0 0 16px', color: '#b3b3b3' }}>{songInfo.artist || 'Unknown artist'}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', color: '#b3b3b3', fontSize: '13px' }}>
              <span>Duration: {formatDuration(songInfo.duration)}</span>
              {songInfo.viewCount > 0 && <span>Views: {formatViewCount(songInfo.viewCount)}</span>}
              {songInfo.id && <span style={{ gridColumn: '1 / -1', overflowWrap: 'anywhere' }}>Track ID: {songInfo.id}</span>}
            </div>
          </section>
        </div>
      )}
    </main>
  );
};

const menuItemStyle = {
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  padding: '9px 10px',
  border: 0,
  borderRadius: '5px',
  background: 'transparent',
  color: '#fff',
  textAlign: 'left',
  fontSize: '13px',
  cursor: 'pointer'
};

export default SearchPage;
