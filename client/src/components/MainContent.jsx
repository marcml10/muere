import React from 'react';
import { usePlayback } from '../playback/playBack';

const MainContent = () => {
  const { playTrack } = usePlayback();

  return (
    <main className="main-content">
      <header className="header">
        <h1>Home</h1>
        <div className="profile-icon"></div>
      </header>
      
      <section className="top-picks">
        <h2>Top Picks for You</h2>
        <div className="album-grid">
          {/* Static placeholders for Home view */}
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
