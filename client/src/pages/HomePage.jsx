import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import MainContent from '../components/MainContent';
import PlayerBar from '../components/PlayerBar';
import SearchPage from './SearchPage';
import SettingsPage from './SettingsPage';
import LikedSongsPage from './LikedSongsPage';
import PlaylistsPage from './PlaylistsPage';
import CurrentSongPage from './currentSong';
import { HistoryProvider } from '../playback/HistoryContext';
import { PlaybackProvider } from '../playback/playBack';
import { QueueProvider } from '../playback/QueueContext';
import { LikedProvider } from '../playback/LikedContext';
import YoutubePlayer from '../playback/youtubePlayer';
import QueuePanel from '../components/QueuePanel';
import './HomePage.css';

const HomePage = () => {
  const [currentView, setCurrentView] = useState(() => {
    const validViews = ['home', 'search', 'settings', 'liked', 'playlists', 'currentSong'];
    try {
      const savedView = localStorage.getItem('muer_current_view');
      return validViews.includes(savedView) ? savedView : 'home';
    } catch {
      return 'home';
    }
  });
  const [previousView, setPreviousView] = useState(() => {
    try {
      const saved = localStorage.getItem('muer_current_song_previous_view');
      return ['home', 'search', 'settings', 'liked', 'playlists'].includes(saved) ? saved : 'home';
    } catch {
      return 'home';
    }
  });

  const clearSavedSearch = () => {
    try {
      localStorage.removeItem('muer_last_search_query');
      localStorage.removeItem('muer_last_search_results');
    } catch (error) {
      console.error('[Navigation] Failed to clear search state:', error);
    }
  };

  const changeView = (view) => {
    if (currentView === 'search' && view !== 'search') clearSavedSearch();
    if (view !== 'currentSong') setPreviousView(view);
    setCurrentView(view);
  };

  const openCurrentSong = () => {
    if (currentView === 'search') clearSavedSearch();
    if (currentView !== 'currentSong') {
      setPreviousView(currentView);
      try {
        localStorage.setItem('muer_current_song_previous_view', currentView);
      } catch (error) {
        console.error('[Navigation] Failed to save previous page:', error);
      }
    }
    setCurrentView('currentSong');
  };

  useEffect(() => {
    try {
      localStorage.setItem('muer_current_view', currentView);
    } catch (error) {
      console.error('[Navigation] Failed to save current page:', error);
    }
  }, [currentView]);

  const activeBaseView = currentView === 'currentSong' ? previousView : currentView;

  return (
    <HistoryProvider>
      <PlaybackProvider>
        <QueueProvider>
          <LikedProvider>
            <div className="apple-music-layout">
              {/* Hidden YouTube Audio Engine */}
              <YoutubePlayer />
              
              {/* Sidebar */}
              <Sidebar currentView={currentView} setCurrentView={changeView} />

              {/* Dynamic Content View */}
              {activeBaseView === 'home' && <MainContent />}
              {activeBaseView === 'search' && <SearchPage />}
              {activeBaseView === 'settings' && <SettingsPage />}
              {/* Placeholder for others */}
              {activeBaseView === 'liked' && <LikedSongsPage />}
              {activeBaseView === 'playlists' && <PlaylistsPage />}
              {currentView === 'currentSong' && <CurrentSongPage onBack={() => changeView(previousView)} />}

              {/* Bottom Player */}
              {currentView !== 'currentSong' && <PlayerBar onOpenCurrentSong={openCurrentSong} />}

              {/* Queue Slide-out Panel */}
              <QueuePanel />
            </div>
          </LikedProvider>
        </QueueProvider>
      </PlaybackProvider>
    </HistoryProvider>
  );
};

export default HomePage;
