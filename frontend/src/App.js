import './App.css';
import Navbar from './Navbar.js';
import Body from './Body.js';
import React, { useState } from 'react';

function App() {
  const [searchQuery, setSearchQuery] = useState('');
  return (
    <div className="App">
      <Navbar onSearch={setSearchQuery}/>
      <Body searchQuery={searchQuery}/>
    </div>
  );
}

export default App;
