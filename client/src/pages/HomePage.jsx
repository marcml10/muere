import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import PlayerBar from '../components/PlayerBar';
import SearchPage from './SearchPage';
import { PlaybackProvider } from '../playback/playBack';
import { QueueProvider } from '../playback/QueueContext';
import YoutubePlayer from '../playback/youtubePlayer';
import QueuePanel from '../components/QueuePanel';
import './HomePage.css';

const HomePage = () => {
  const [currentView, setCurrentView] = useState('home');

  return (
    <PlaybackProvider>
      <QueueProvider>
        <div className="apple-music-layout">
          {/* Hidden YouTube Audio Engine */}
          <YoutubePlayer />
          
          {/* Sidebar */}
          <Sidebar currentView={currentView} setCurrentView={setCurrentView} />

          {/* Dynamic Content View */}
          {currentView === 'home' && <MainContent />}
          {currentView === 'search' && <SearchPage />}
          {/* Placeholder for others */}
          {currentView === 'new' && <MainContent />}
          {currentView === 'radio' && <MainContent />}

          {/* Bottom Player */}
          <PlayerBar />

          {/* Queue Slide-out Panel */}
          <QueuePanel />
        </div>
      </QueueProvider>
    </PlaybackProvider>
  );
};

export default HomePage;
