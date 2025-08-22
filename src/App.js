import React from 'react';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import KeahlianPage from './pages/KeahlianPage';
import KeterampilanPage from './pages/KeterampilanPage';
import ResultPage from './pages/ResultPage';
import PengajuanKenaikan from './pages/PengajuanKenaikan'; // ✅ Import it

function App() {
  return (
    <div
      className="
        min-h-screen
        bg-background-dark
        text-text-light
        font-roboto
        flex flex-col items-center
        p-4
      "
    >
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/keahlian" element={<KeahlianPage />} />
        <Route path="/keterampilan" element={<KeterampilanPage />} />
        <Route path="/results" element={<ResultPage />} />
        <Route path="/pengajuan-kenaikan" element={<PengajuanKenaikan />} /> {/* ✅ New route */}
      </Routes>
    </div>
  );
}

export default App;
