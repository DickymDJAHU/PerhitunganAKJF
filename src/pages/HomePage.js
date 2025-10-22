// src/pages/HomePage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';

const HomePage = () => {
  const navigate = useNavigate();

  const handleKeahlianClick = () => {
    navigate('/keahlian');
  };

  const handleKeterampilanClick = () => {
    // This page is not fully implemented for calculation logic yet
    // For now, it will just navigate to a placeholder page.
    navigate('/keterampilan');
  };

    const handlePanduanClick = () => {
    navigate('/panduan');
  };

  return (
    <div
      id="initial-content-wrapper" // Keep ID for potential specific styling/legacy
      className="
        flex flex-col items-center justify-center
        min-h-screen
        p-px-20
        w-full
        max-w-[600px]
        box-border
        text-center
      "
    >
      <h1 className="
        font-poppins
        font-bold
        text-teal-400
        mb-px-30
        text-4xl md:text-5xl
        drop-shadow-lg
      ">
        Simulasi Perhitungan Angka Kredit Jabatan Fungsional
      </h1>
{/* Main Buttons */}
<div
  className="
    flex flex-col items-center
    mt-px-15
    mb-px-10
  "
>
  <div
    className="
      flex flex-col md:flex-row
      space-y-4 md:space-y-0 md:space-x-px-10
      justify-center
      w-full
    "
  >
    <button
      onClick={handleKeahlianClick}
      className="
        bg-button-dark
        text-blue-300
        py-px-12 px-px-20
        text-lg
        font-poppins
        font-bold
        border-none
        rounded-md
        cursor-pointer
        transition-colors duration-300
        whitespace-nowrap
        min-w-min-w-160
        text-center
        box-border
        hover:bg-blue-300
        hover:text-[#1f1f1f]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      "
    >
      JF Keahlian
    </button>

    <button
      onClick={handleKeterampilanClick}
      className="
        bg-button-dark
        text-text-accent
        py-px-12 px-px-20
        text-lg
        font-poppins
        font-bold
        border-none
        rounded-md
        cursor-pointer
        transition-colors duration-300
        whitespace-nowrap
        min-w-min-w-160
        text-center
        box-border
        hover:bg-text-accent
        hover:text-[#1f1f1f]
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
      "
    >
      JF Keterampilan
    </button>
  </div>

  {/* Panduan Penggunaan Button (centered under main buttons) */}
  <button
    onClick={handlePanduanClick}
    className="
      bg-transparent
      text-gray-300
      text-sm
      underline
      hover:text-teal-300
      transition-colors
      duration-300
      mt-px-15
    "
  >
    Panduan Penggunaan
  </button>
</div>

{/* Footer */}
<div
  className="
    absolute bottom-px-20
    text-sm
    text-border-color
  "
>
  Created by Dicky Muhammad Arifin 2025
</div>

    </div>
  );
};

export default HomePage;