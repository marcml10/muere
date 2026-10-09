import React, { useState } from 'react';

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
      
      const data = await response.json();
      console.log('Search results received:', data);
      
      // Pass the mapped data up to the parent component
      if (onSearchResults) {
        onSearchResults(data);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSearch}>
      <input 
        type="text" 
        placeholder="Search" 
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />
    </form>
  );
};

export default SearchBar;
