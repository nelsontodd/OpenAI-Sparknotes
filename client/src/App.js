import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import axios from 'axios';
import './App.css';

import Homework from './components/Homework';
import Landing from './components/Landing';
import Payments from './components/Payments';


axios.defaults.baseURL = 'http://127.0.0.1:5000';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/homework" element={<Homework />} />
          <Route path="/payments" element={<Payments />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
