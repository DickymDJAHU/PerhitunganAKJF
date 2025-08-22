// src/pages/ResultPage.js
import React, { useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ResultPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const modalRef = useRef(null);

  const { results, formData: originalFormData, originPath } = location.state || {};

  const totalAK = results?.totalAK || '0.00';
  const akMinimalPangkat = results?.akMinimalPangkat || '0.00';
  const akMinimalJenjang = results?.akMinimalJenjang || '0.00';
  const kenaikanPangkat = results?.kenaikanPangkat || 'N/A';
  const kenaikanJenjang = results?.kenaikanJenjang || 'N/A';
  const isPangkatSufficient = results?.isPangkatSufficient;
  const isJenjangSufficient = results?.isJenjangSufficient;

  const handleBackToFormWithData = () => {
    navigate(originPath || '/', { state: { formData: originalFormData } });
  };

  const handleBackgroundClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      navigate(originPath || '/');
    }
  };

  // Determine button text dynamically
  let dokumenButtonText = '';
  const isPangkatEligible = kenaikanPangkat.includes('Dapat Dipertimbangkan Untuk Kenaikan Pangkat Setingkat Lebih Tinggi');
  const isJenjangEligible = kenaikanJenjang.includes('Dapat Dipertimbangkan Untuk Kenaikan Jenjang Jabatan Fungsional');

  if (isPangkatEligible && isJenjangEligible) {
    dokumenButtonText = 'Lanjutkan Membuat Dokumen Pengajuan Kenaikan Pangkat & Jenjang';
  } else if (isPangkatEligible) {
    dokumenButtonText = 'Lanjutkan Membuat Dokumen Pengajuan Kenaikan Pangkat';
  }

  const showDokumenButton = !!dokumenButtonText;

  // Handle "Lanjutkan Dokumen Pengajuan" click
  const handleLanjutkanDokumen = () => {
    navigate('/Pengajuan-Kenaikan', { state: { results, formData: originalFormData } });
  };

  return (
    <div
      className="
        flex items-center justify-center
        min-h-screen
        p-px-20
        font-roboto
        bg-background-dark bg-opacity-90
      "
      onClick={handleBackgroundClick}
    >
      <div
        id="resultsModalContent"
        ref={modalRef}
        className="
          bg-form-bg
          p-px-14_25
          rounded-lg
          shadow-xl
          max-w-[496px]
          w-full
          box-border
          text-center
          text-text-light
        "
        onClick={(e) => e.stopPropagation()}
      >
        <div id="results-section" className="pt-0 border-t-0 block bg-transparent mt-0">
          <h2
            className="
              font-orbitron
              text-text-accent
              text-xl
              md:text-2xl
              text-center
              mb-px-17
              font-bold
            "
          >
            Hasil Perhitungan
          </h2>

          {/* --- existing table --- */}
          <div className="overflow-x-auto">
            <table className="results-table w-full border-collapse mb-px-17 text-base">
              <thead>
                <tr>
                  <th
                    className="
                      py-px-9_5
                      px-4
                      bg-result-header-bg
                      text-text-accent
                      text-lg
                      font-bold
                      border border-result-table-border
                    "
                    rowSpan="2"
                  >
                    Angka Kredit Kumulatif
                  </th>
                  <th
                    className="
                      py-px-9_5
                      px-4
                      bg-result-header-bg
                      text-text-accent
                      text-lg
                      font-bold
                      border border-result-table-border
                    "
                    colSpan="2"
                  >
                    Angka Kredit Minimal
                  </th>
                </tr>
                <tr className="sub-header-row">
                  <td
                    className="
                      py-px-6
                      px-4
                      bg-result-subheader-bg
                      text-text-accent
                      font-bold
                      text-sm
                      border border-result-table-border
                      align-middle
                    "
                  >
                    Kenaikan Pangkat
                  </td>
                  <td
                    className="
                      py-px-6
                      px-4
                      bg-result-subheader-bg
                      text-text-accent
                      font-bold
                      text-sm
                      border border-result-table-border
                      align-middle
                    "
                  >
                    Kenaikan Jenjang
                  </td>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    id="resTotalAK"
                    className="
                      py-px-10
                      px-4
                      text-5xl
                      font-bold
                      align-middle
                      text-center
                      leading-none
                      bg-result-subheader-bg
                      text-text-accent
                      border border-result-table-border
                    "
                  >
                    {totalAK}
                  </td>
                  <td
                    id="resAKMinimalPangkat"
                    className={`
                      py-px-5
                      px-4
                      text-4xl
                      font-bold
                      align-middle
                      leading-none
                      border border-result-table-border
                      ${isPangkatSufficient ? 'bg-education-green' : 'bg-education-red'}
                    `}
                  >
                    {akMinimalPangkat}
                  </td>
                  <td
                    id="resAKMinimalJenjang"
                    className={`
                      py-px-5
                      px-4
                      text-4xl
                      font-bold
                      align-middle
                      leading-none
                      border border-result-table-border
                      ${isJenjangSufficient ? 'bg-education-green' : 'bg-education-red'}
                    `}
                  >
                    {akMinimalJenjang}
                  </td>
                </tr>
                <tr>
                  <td
                    className="
                      py-px-10
                      px-4
                      text-justify
                      border border-result-table-border
                      bg-input-bg
                    "
                    colSpan="3"
                  >
                    <p
                      className="
                        text-text-accent
                        text-lg
                        font-bold
                        mb-2
                      "
                    >
                      <strong>Pangkat</strong>
                    </p>
                    <p
                      id="resKenaikanPangkat"
                      className="text-text-light text-base"
                      dangerouslySetInnerHTML={{ __html: kenaikanPangkat }}
                    ></p>
                  </td>
                </tr>
                <tr>
                  <td
                    className="
                      py-px-10
                      px-4
                      text-justify
                      border border-result-table-border
                      bg-input-bg
                    "
                    colSpan="3"
                  >
                    <p
                      className="
                        text-text-accent
                        text-lg
                        font-bold
                        mb-2
                      "
                    >
                      <strong>Jenjang</strong>
                    </p>
                    <p
                      id="resKenaikanJenjang"
                      className="text-text-light text-base"
                      dangerouslySetInnerHTML={{ __html: kenaikanJenjang }}
                    ></p>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Conditionally show dynamic button */}
          {showDokumenButton && (
            <button
              type="button"
              id="lanjutkanDokumenButton"
              onClick={handleLanjutkanDokumen}
              className="
                w-full
                bg-green-600
                text-white
                py-px-13_5
                text-lg
                font-bold
                border-none
                rounded-md
                mb-4
                cursor-pointer
                transition-colors duration-300
                hover:bg-green-700
                focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500
              "
            >
              {dokumenButtonText}
            </button>
          )}

          {/* Existing "Hitung Kembali" button */}
          <button
            type="button"
            id="backToFormButton"
            onClick={handleBackToFormWithData}
            className="
              w-full
              bg-button-dark
              text-text-light
              py-px-13_5
              text-lg
              font-bold
              border-none
              rounded-md
              mt-px-19
              cursor-pointer
              transition-colors duration-300
              hover:bg-education-red
              focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
            "
          >
            Hitung Kembali
          </button>
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
