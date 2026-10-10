import React, { useState } from 'react';
import { useQueue } from '../playback/QueueContext';
import SearchBar from '../components/SearchBar';

const SearchPage = () => {
  const { addToQueue } = useQueue();
  const [searchResults, setSearchResults] = useState(null);

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
          <SearchBar onSearchResults={setSearchResults} />
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
              <div style={{ flex: '1 1 350px', maxWidth: '450px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>Top result</h2>
                <div 
                  style={{ 
                    backgroundColor: '#181818', 
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
                    e.currentTarget.style.backgroundColor = '#181818';
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
                      backgroundColor: '#1ed760',
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
                    <i className="bi bi-play-fill" style={{ marginLeft: '2px' }}></i>
                  </div>
                </div>
              </div>

              {/* Right Column: Songs List */}
              <div style={{ flex: '2 1 400px' }}>
                <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>Songs</h2>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  {searchResults.slice(0, 4).map((item, index) => (
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

                      <div style={{ display: 'flex', alignItems: 'center', gap: '16px', color: '#b3b3b3', fontSize: '14px' }}>
                        <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', padding: 0, fontSize: '16px' }}>
                          <i className="bi bi-plus-circle"></i>
                        </button>
                        <span>3:00</span>
                        <button style={{ background: 'none', border: 'none', color: '#b3b3b3', cursor: 'pointer', padding: 0, fontSize: '16px', letterSpacing: '2px' }}>
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
