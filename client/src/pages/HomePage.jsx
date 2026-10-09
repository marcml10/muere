import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import PlayerBar from '../components/PlayerBar';
import { PlaybackProvider } from '../playback/playBack';
import './HomePage.css';

const HomePage = () => {
  const [searchResults, setSearchResults] = useState(null);

  return (
    <PlaybackProvider>
      <div className="apple-music-layout">
        {/* Sidebar */}
        <Sidebar onSearchResults={setSearchResults} />

        {/* Main Content */}
        <MainContent searchResults={searchResults} />

        {/* Bottom Player */}
        <PlayerBar />
      </div>
    </PlaybackProvider>
  );
};

export default HomePage;
