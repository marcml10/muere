import React, { useState } from 'react';
import { useQueue } from '../playback/QueueContext';
import SearchBar from '../search/SearchBar';
import { formatViewCount, formatDuration, formatSubscriberCount } from '../search/resultFilter';

const SearchPage = () => {
  const { addToQueue, addSongToQueue } = useQueue();
  const [searchResults, setSearchResults] = useState(null);
  const [artistChannel, setArtistChannel] = useState(null);

  const handleSearchResults = (data) => {
    if (!data) {
      setSearchResults(null);
      setArtistChannel(null);
      return;
    }
    if (Array.isArray(data)) {
      setSearchResults(data);
      setArtistChannel(null);
    } else if (typeof data === 'object') {
      const tracks = Array.isArray(data.tracks) ? data.tracks : (Array.isArray(data.results) ? data.results : []);
      setSearchResults(tracks);
      setArtistChannel(data.channel || null);
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
          <SearchBar onSearchResults={handleSearchResults} />
        </div>
      </header>
      
      <section className="top-picks">
        {!searchResults && (
          <h2 style={{ textAlign: 'left', marginBottom: '30px' }}>
            Browse Categories
          </h2>
        )}
        
        <div className={searchResults ? "" : "category-grid"}>
          {searchResults && searchResults.length > 0 ? (
            <div className="spotify-search-layout" style={{ display: 'flex', gap: '24px', width: '100%', alignItems: 'flex-start', flexWrap: 'wrap' }}>
              {/* Left Column: Top Result */}
              <div style={{ flex: '1 1 350px', maxWidth: '450px', position: 'sticky', top: '20px' }}>
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
                    style={{ width: '92px', height: '92px', borderRadius: '4px', objectFit: 'cover', marginBottom: '20px', boxShadow: '0 8px 24px rgba(0,0,0,0.5)' }}
                  />
                  <h3 style={{ fontSize: '32px', fontWeight: 'bold', color: '#fff', margin: '0 0 8px 0', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', letterSpacing: '-0.5px' }}>
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
              <div style={{ flex: '2 1 400px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>Songs</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {searchResults.slice(0, 15).map((item, index) => (
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
                      <div style={{ position: 'relative', width: '40px', height: '40px', flexShrink: 0 }}>
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
                        <div style={{ color: '#fff', fontSize: '16px', fontWeight: 'normal', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.title}
                        </div>
                        <div style={{ color: '#b3b3b3', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {item.artist}
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', color: '#b3b3b3', fontSize: '14px', marginLeft: 'auto', flexShrink: 0 }}>
                        {/* Grouped + button and song duration */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <button 
                            style={{ 
                              background: 'none', 
                              border: 'none', 
                              color: '#b3b3b3', 
                              cursor: 'pointer', 
                              padding: '2px', 
                              fontSize: '16px',
                              display: 'flex',
                              alignItems: 'center',
                              transition: 'color 0.2s ease'
                            }}
                            title="Add to queue"
                            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                            onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}
                            onClick={(e) => {
                              e.stopPropagation();
                              addSongToQueue(item);
                            }}
                          >
                            <i className="bi bi-plus-circle"></i>
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

                        <button 
                          style={{ 
                            background: 'none', 
                            border: 'none', 
                            color: '#b3b3b3', 
                            cursor: 'pointer', 
                            padding: '2px', 
                            fontSize: '16px', 
                            letterSpacing: '2px',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'color 0.2s ease'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
                          onMouseLeave={(e) => e.currentTarget.style.color = '#b3b3b3'}
                        >
                          ...
                        </button>
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
      </section>
    </main>
  );
};

export default SearchPage;
