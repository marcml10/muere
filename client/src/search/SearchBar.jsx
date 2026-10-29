import React, { useState } from 'react';
import { filterAndSortByViews } from './resultFilter';

const SearchBar = ({ onSearchResults, onLoadingChange }) => {
  const [searchQuery, setSearchQuery] = useState(() => {
    try {
      return localStorage.getItem('muer_last_search_query') || '';
    } catch {
      return '';
    }
  });
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault(); // Prevent page reload
    if (!searchQuery.trim()) return;

    try {
      localStorage.setItem('muer_last_search_query', searchQuery.trim());
    } catch (error) {
      console.error('Failed to save search query:', error);
    }

    try {
      setLoading(true);
      if (onLoadingChange) onLoadingChange(true);
      console.log('Initiating search for:', searchQuery);
      // Hardcoded absolute URL to our backend
      const response = await fetch(`http://localhost:3000/api/search?q=${encodeURIComponent(searchQuery)}`);
      
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      
      const rawData = await response.json();
      console.log('[SearchBar] Raw results received:', rawData);
      
      // Feed results to resultFilter.jsx to sort by high view count in descending order
      const filteredData = filterAndSortByViews(rawData, searchQuery);
      console.log('[resultFilter] Filtered/sorted results:', filteredData);
      
      // Give the filtered results back to SearchPage
      if (onSearchResults) {
        onSearchResults(filteredData);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    } finally {
      setLoading(false);
      if (onLoadingChange) onLoadingChange(false);
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    try {
      localStorage.removeItem('muer_last_search_query');
      localStorage.removeItem('muer_last_search_results');
    } catch (error) {
      console.error('Failed to clear saved search:', error);
    }
    setLoading(false);
    if (onLoadingChange) onLoadingChange(false);
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
        style={{ paddingRight: (searchQuery || loading) ? '40px' : '20px' }}
      />
      {loading ? (
        <span 
          style={{ 
            position: 'absolute', 
            right: '16px', 
            top: '50%', 
            transform: 'translateY(-50%)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            pointerEvents: 'none'
          }}
        >
          <div 
            style={{ 
              width: '16px', 
              height: '16px', 
              border: '2px solid rgba(255, 255, 255, 0.2)', 
              borderTopColor: '#fff', 
              borderRadius: '50%', 
              animation: 'spin 0.8s linear infinite' 
            }} 
          />
        </span>
      ) : searchQuery && (
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
