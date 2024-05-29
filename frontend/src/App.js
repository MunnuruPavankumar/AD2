// src/App.js
import React, { useState } from 'react';
import SearchBar from './components/SearchBar';
import Results from './components/Results';
import './App.css';

const App = () => {
  const [results, setResults] = useState([]);

  const handleSearch = async (query) => {
    const response = await fetch(`/api/search?query=${query}`);
    const data = await response.json();
    setResults(data);
  };

  return (
    <div className="app">
      <SearchBar onSearch={handleSearch} />
      <Results results={results} />
    </div>
  );
};

export default App;
