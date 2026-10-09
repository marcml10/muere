import React from 'react';
import SearchBar from './SearchBar';

const Sidebar = ({ onSearchResults }) => {
  return (
    <aside className="sidebar">
      <SearchBar onSearchResults={onSearchResults} />
      <nav>
        <ul>
          <li className="active"><span className="icon">🏠</span> Home</li>
          <li><span className="icon">🌐</span> Browse</li>
          <li><span className="icon">📻</span> Radio</li>
        </ul>
        <h3>Library</h3>
        <ul>
          <li><span className="icon">⏱️</span> Recently Added</li>
          <li><span className="icon">🎤</span> Artists</li>
          <li><span className="icon">💿</span> Albums</li>
          <li><span className="icon">❤️</span> Liked</li>
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;
