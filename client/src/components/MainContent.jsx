import React from 'react';
import { usePlayback } from '../playback/playBack';

const MainContent = ({ searchResults }) => {
  const { playTrack } = usePlayback();

  return (
    <main className="main-content">
      <header className="header">
        <h1>{searchResults ? 'Search Results' : 'Home'}</h1>
        <div className="profile-icon"></div>
      </header>
      
      <section className="top-picks">
        <h2>{searchResults ? 'Found' : 'Top Picks for You'}</h2>
        <div className="album-grid">
          {searchResults ? (
            searchResults.map((item, index) => (
              <div 
                className="album-card" 
                key={item.id || index}
                onClick={() => playTrack(item)}
                style={{ cursor: 'pointer' }}
              >
                <div className="album-art" style={{ backgroundColor: '#eaeaea', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                  {item.thumbnailUrl ? (
                    <img src={item.thumbnailUrl} alt={item.title} style={{ width: '100%', height: '100%', borderRadius: '8px', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '40px' }}>🎵</span>
                  )}
                  {/* Subtle play icon overlay to indicate it's playable */}
                  <div style={{ position: 'absolute', bottom: '8px', right: '8px', backgroundColor: 'rgba(0,0,0,0.6)', color: 'white', borderRadius: '50%', width: '32px', height: '32px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    ▶️
                  </div>
                </div>
                <p className="album-title" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</p>
                <p className="album-artist" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.artist}</p>
              </div>
            ))
          ) : (
            <>
              <div className="album-card">
                <div className="album-art artwork-1"></div>
                <p className="album-title">Chill Vibes</p>
                <p className="album-artist">Various Artists</p>
              </div>
              <div className="album-card">
                <div className="album-art artwork-2"></div>
                <p className="album-title">New Music Daily</p>
                <p className="album-artist">Apple Music</p>
              </div>
              <div className="album-card">
                <div className="album-art artwork-3"></div>
                <p className="album-title">Classic Rock</p>
                <p className="album-artist">Various Artists</p>
              </div>
              <div className="album-card">
                <div className="album-art artwork-4"></div>
                <p className="album-title">Acoustic Hits</p>
                <p className="album-artist">Various Artists</p>
              </div>
              <div className="album-card">
                <div className="album-art artwork-1"></div>
                <p className="album-title">Lo-Fi Beats</p>
                <p className="album-artist">Various Artists</p>
              </div>
              <div className="album-card">
                <div className="album-art artwork-2"></div>
                <p className="album-title">Pop Hits</p>
                <p className="album-artist">Apple Music</p>
              </div>
            </>
          )}
        </div>
      </section>
    </main>
  );
};

export default MainContent;
