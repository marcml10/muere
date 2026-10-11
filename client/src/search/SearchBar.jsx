import React, { useState } from 'react';
import { filterAndSortByViews } from './resultFilter';

const SearchBar = ({ onSearchResults }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!searchQuery.trim()) return;

    try {
      console.log('Initiating search for:', searchQuery);
      // Hardcoded absolute URL to our backend
      const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const rawData = await response.json();
      console.log('[SearchBar] Raw results received:', rawData);
      
      // Feed results to resultFilter.jsx to sort by high view count in descending order
      const filteredData = filterAndSortByViews(rawData);
      console.log('[resultFilter] Filtered/sorted results:', filteredData);
      
      // Give the filtered results back to SearchPage
      if (onSearchResults) {
        onSearchResults(filteredData);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    if (onSearchResults) {
      onSearchResults(null);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch} style={{ position: 'relative', width: '100%', marginBottom: '0' }}>
      <span style={{ position: 'absolute', left: '20px', top: '50%', transform: 'translateY(calc(-50% + 1px))', color: 'var(--am-text-secondary)', fontSize: '15px', pointerEvents: 'none' }}>
        <i className="bi bi-search"></i>
      </span>
      <input 
        type="text" 
        placeholder="Search" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="search-input"
        style={{ paddingRight: searchQuery ? '40px' : '20px' }}
      />
      {searchQuery && (
        <span 
          onClick={clearSearch}
          style={{ 
            position: 'absolute', 
            right: '15px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            color: 'var(--am-text-secondary)', 
            fontSize: '14px', 
            cursor: 'pointer', 
            padding: '4px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: 0.7
          }}>
          <i className="bi bi-x-circle-fill"></i>
        </span>
      )}
    </form>
  );
};

export default SearchBar;
