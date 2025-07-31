// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KeahlianPage from './pages/KeahlianPage';
import KeterampilanPage from './pages/KeterampilanPage'; // Although not fully implemented for calculations yet
import ResultPage from './pages/ResultPage';

function App() {
  return (
    <Router>
      <div className="
        min-h-screen                 /* Sets minimum height to full viewport height */
        bg-background-dark           /* Applies the dark background color */
        text-text-light              /* Sets default text color to light */
        font-roboto                  /* Applies the Roboto font */
        flex flex-col items-center   /* Centers content horizontally */
        p-4                          /* Adds some padding around the content */
      ">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/keahlian" element={<KeahlianPage />} />
          <Route path="/keterampilan" element={<KeterampilanPage />} />
          <Route path="/results" element={<ResultPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;