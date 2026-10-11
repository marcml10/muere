import React from 'react';
import { usePlayback } from '../playback/playBack';
import { useQueue } from '../playback/QueueContext';
import { useRecentlyPlayed } from '../recommendations/recommendations';

const MainContent = () => {
  const { playTrack } = usePlayback();
  const { addToQueue } = useQueue();
  const recentlyPlayed = useRecentlyPlayed(12);

  return (
    <main className="main-content">
      <header className="header">
        <h1>Home</h1>
        <div className="profile-icon"></div>
      </header>

      {/* Recently Played Section */}
      <section className="recently-played-section" style={{ marginBottom: '40px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: 'bold', marginBottom: '16px', color: '#fff', textAlign: 'left', borderBottom: 'none', paddingBottom: 0 }}>
          Recently Played
        </h2>

        {recentlyPlayed && recentlyPlayed.length > 0 ? (
          <div 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', 
              gap: '16px' 
            }}
          >
            {recentlyPlayed.map((song, index) => (
              <div 
                key={song.id || index}
                style={{
                  backgroundColor: '#1F1F1F',
                  borderRadius: '8px',
                  padding: '12px',
                  cursor: 'pointer',
                  transition: 'background-color 0.2s, transform 0.2s',
                  display: 'flex',
                  flexDirection: 'column',
                  position: 'relative',
                  overflow: 'hidden'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = '#282828';
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  const playIcon = e.currentTarget.querySelector('.box-play-overlay');
                  if (playIcon) playIcon.style.opacity = '1';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = '#1F1F1F';
                  e.currentTarget.style.transform = 'translateY(0)';
                  const playIcon = e.currentTarget.querySelector('.box-play-overlay');
                  if (playIcon) playIcon.style.opacity = '0';
                }}
                onClick={() => {
                  if (addToQueue) {
                    addToQueue(recentlyPlayed, index);
                  } else if (playTrack) {
                    playTrack(song);
                  }
                }}
              >
                {/* Song Image */}
                <div style={{ position: 'relative', width: '100%', aspectRatio: '1', borderRadius: '6px', overflow: 'hidden', marginBottom: '10px', backgroundColor: '#2a2a2a' }}>
                  {song.thumbnailUrl ? (
                    <img 
                      src={song.thumbnailUrl} 
                      alt={song.title}
                      style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#333', fontSize: '24px' }}>
                      🎵
                    </div>
                  )}
                  {/* Floating Play Overlay on Hover */}
                  <div 
                    className="box-play-overlay"
                    style={{
                      position: 'absolute',
                      bottom: '8px',
                      right: '8px',
                      width: '32px',
                      height: '32px',
                      backgroundColor: '#fff',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#000',
                      fontSize: '14px',
                      opacity: 0,
                      transition: 'opacity 0.2s ease',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.4)'
                    }}
                  >
                    <i className="bi bi-play-fill" style={{ marginLeft: '2px', color: '#000' }}></i>
                  </div>
                </div>

                {/* Song Name */}
                <div 
                  style={{ 
                    color: '#fff', 
                    fontSize: '13px', 
                    fontWeight: '500', 
                    whiteSpace: 'nowrap', 
                    overflow: 'hidden', 
                    textOverflow: 'ellipsis',
                    textAlign: 'left'
                  }}
                  title={song.title}
                >
                  {song.title}
                </div>

                {/* Artist Name */}
                {song.artist && (
                  <div 
                    style={{ 
                      color: '#a1a1a6', 
                      fontSize: '12px', 
                      marginTop: '2px', 
                      whiteSpace: 'nowrap', 
                      overflow: 'hidden', 
                      textOverflow: 'ellipsis',
                      textAlign: 'left'
                    }}
                  >
                    {song.artist}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div style={{ color: 'var(--am-text-secondary)', fontSize: '14px', textAlign: 'left', padding: '8px 0' }}>
            No songs played yet. Play any track to see it here!
          </div>
        )}
      </section>
      
      {/* Top Picks for You */}
      <section className="top-picks">
        <h2>Top Picks for You</h2>
        <div className="album-grid">
          <div className="album-card">
            <div className="album-art artwork-1"></div>
            <p className="album-title">Morning Vibes</p>
            <p className="album-artist">Apple Music Pop</p>
          </div>
          <div className="album-card">
            <div className="album-art artwork-2"></div>
            <p className="album-title">Chill Out</p>
            <p className="album-artist">Apple Music Chill</p>
          </div>
          <div className="album-card">
            <div className="album-art artwork-3"></div>
            <p className="album-title">Workout</p>
            <p className="album-artist">Apple Music Fitness</p>
          </div>
          <div className="album-card">
            <div className="album-art artwork-4"></div>
            <p className="album-title">Acoustic Hits</p>
            <p className="album-artist">Apple Music Acoustic</p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default MainContent;
