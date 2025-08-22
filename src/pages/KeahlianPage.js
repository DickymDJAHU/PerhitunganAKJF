// src/pages/KeahlianPage.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const KeahlianPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  // --- Configuration Objects (memoized) ---
  const keahlianJenjangOptions = useMemo(() => ({
      "Ahli Pertama": 12.5,
      "Ahli Muda": 25,
      "Ahli Madya": 37.5,
      "Ahli Utama": 50
  }), []);

  const keahlianGolonganOptions = useMemo(() => ["IIIa", "IIIb", "IIIc", "IIId", "IVa", "IVb", "IVc", "IVd", "IVe"], []);

  const penilaianToMultiplier = useMemo(() => ({
      "Sangat Baik": 1.5,
      "Baik": 1,
      "Butuh Perbaikan": 0.75,
      "Kurang": 0.5,
      "Sangat Kurang": 0.25
  }), []);

  const bulanToFraction = useMemo(() => ({
      "Januari": 1/12, "Februari": 2/12, "Maret": 3/12, "April": 4/12,
      "Mei": 5/12, "Juni": 6/12, "Juli": 7/12, "Agustus": 8/12,
      "September": 9/12, "Oktober": 10/12, "November": 11/12, "Desember": 12/12
  }), []);

  const golonganBonusAK = useMemo(() => ({
      "IIIb": 50, "IIId": 100, "IVb": 150, "IVc": 300
  }), []);

  // --- Utility Functions (memoized) ---
  const formatMonths = useCallback((totalMonths) => {
      if (isNaN(totalMonths) || totalMonths <= 0) return "0 bulan";
      const years = Math.floor(totalMonths / 12);
      const months = Math.round(totalMonths % 12);
      let result = "";
      if (years > 0) result += years + " tahun";
      if (months > 0) result += (years > 0 ? " " : "") + months + " bulan";
      return result.trim() || "0 bulan";
  }, []);

  const getMinimalPangkatAK = useCallback((jenjang, golongan) => {
      if (jenjang === "Ahli Madya") {
          if (golongan === "IVb") return 300;
          if (golongan === "IVc") return 450;
      }
      switch (jenjang) {
          case "Ahli Pertama": return 50;
          case "Ahli Muda": return 100;
          case "Ahli Madya": return 150;
          case "Ahli Utama": return 200;
          default: return 0;
      }
  }, []);

  const getMinimalJenjangAK = useCallback((jenjang) => {
      switch (jenjang) {
          case "Ahli Pertama": return 100;
          case "Ahli Muda": return 200;
          case "Ahli Madya": return 450;
          case "Ahli Utama": return 200;
          default: return 0;
      }
  }, []);

  const calculateAkKonversi = useCallback((penilaian, jenjang) => {
      const multiplier = penilaianToMultiplier[penilaian] || 0;
      const baseAK = keahlianJenjangOptions[jenjang] || 0;
      return parseFloat((multiplier * baseAK).toFixed(2));
  }, [penilaianToMultiplier, keahlianJenjangOptions]);

  const calculateAkKonversi2025 = useCallback((penilaian, jenjang, bulan) => {
      const multiplier = penilaianToMultiplier[penilaian] || 0;
      const baseAK = keahlianJenjangOptions[jenjang] || 0;
      const bulanFraction = bulanToFraction[bulan] || 0;
      return parseFloat((multiplier * baseAK * bulanFraction).toFixed(2));
  }, [penilaianToMultiplier, keahlianJenjangOptions, bulanToFraction]);

  // --- State for form fields (Initialize with passed data if available) ---
  const [jenjangJabatan, setJenjangJabatan] = useState(location.state?.formData?.jenjangJabatan || '');
  const [golongan, setGolongan] = useState(location.state?.formData?.golongan || '');
  const [pendidikanKlaim, setPendidikanKlaim] = useState(location.state?.formData?.pendidikanKlaim || '');
  const [angkaKreditPendidikan, setAngkaKreditPendidikan] = useState(location.state?.formData?.angkaKreditPendidikan || 0);
  const [penyesuaianPenyetaraan, setPenyesuaianPenyetaraan] = useState(location.state?.formData?.penyesuaianPenyetaraan || '');
  const [akKonversi2022, setAkKonversi2022] = useState(location.state?.formData?.akKonversi2022 || '');
  const [akKonversi2023, setAkKonversi2023] = useState(location.state?.formData?.akKonversi2023 || '');
  const [akKonversi2024, setAkKonversi2024] = useState(location.state?.formData?.akKonversi2024 || '');
  const [akKonversi2025, setAkKonversi2025] = useState(location.state?.formData?.akKonversi2025 || '');
  const [periodeBulan2025, setPeriodeBulan2025] = useState(location.state?.formData?.periodeBulan2025 || '');

  // Calculated AK values
  const [calculatedAk2023, setCalculatedAk2023] = useState(0);
  const [calculatedAk2024, setCalculatedAk2024] = useState(0);
  const [calculatedAk2025, setCalculatedAk2025] = useState(0);

  // UI state
  const [showPendidikanAkField, setShowPendidikanAkField] = useState(location.state?.formData?.pendidikanKlaim === 'Ya');
  const [statusMessage, setStatusMessage] = useState('');

  // Dropdown options (memoized)
  const skpOptions = useMemo(() => ["Sangat Baik", "Baik", "Butuh Perbaikan", "Kurang", "Sangat Kurang"], []);
  const monthOptions = useMemo(() => ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"], []);

  // --- Effects ---
  useEffect(() => {
    if (pendidikanKlaim === 'Ya') {
      setShowPendidikanAkField(true);
      const jenjangBaseAK = keahlianJenjangOptions[jenjangJabatan] || 0;
      const akValue = parseFloat((jenjangBaseAK * 0.25).toFixed(2));
      setAngkaKreditPendidikan(akValue);
    } else {
      setShowPendidikanAkField(false);
      setAngkaKreditPendidikan(0);
    }
  }, [pendidikanKlaim, jenjangJabatan, keahlianJenjangOptions]);

  useEffect(() => {
    const jenjang = jenjangJabatan;
    const ak2023 = calculateAkKonversi(akKonversi2023, jenjang);
    setCalculatedAk2023(ak2023);
    const ak2024 = calculateAkKonversi(akKonversi2024, jenjang);
    setCalculatedAk2024(ak2024);
    const ak2025 = calculateAkKonversi2025(akKonversi2025, jenjang, periodeBulan2025);
    setCalculatedAk2025(ak2025);
  }, [jenjangJabatan, akKonversi2023, akKonversi2024, akKonversi2025, periodeBulan2025, calculateAkKonversi, calculateAkKonversi2025]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formRef.current && !formRef.current.checkValidity()) {
      setStatusMessage("Mohon lengkapi semua bidang yang wajib diisi.");
      return;
    }
    setStatusMessage('');

    const currentFormData = {
        jenjangJabatan,
        golongan,
        pendidikanKlaim,
        angkaKreditPendidikan,
        penyesuaianPenyetaraan,
        akKonversi2022,
        akKonversi2023,
        akKonversi2024,
        akKonversi2025,
        periodeBulan2025
    };

    const currentAKPendidikan = parseFloat(angkaKreditPendidikan || 0);
    const currentAKPenyesuaian = parseFloat(penyesuaianPenyetaraan || 0);
    const currentAKKonversi2022 = parseFloat(akKonversi2022 || 0);
    const currentAKKonversi2023 = calculatedAk2023;
    const currentAKKonversi2024 = calculatedAk2024;
    const currentAKKonversi2025 = calculatedAk2025;
    const bonusAK = golonganBonusAK[golongan] || 0;

    const totalAK = currentAKPendidikan + currentAKPenyesuaian + currentAKKonversi2022 +
                    currentAKKonversi2023 + currentAKKonversi2024 + currentAKKonversi2025 + bonusAK;

    const minimalPangkat = getMinimalPangkatAK(jenjangJabatan, golongan);
    const minimalJenjang = getMinimalJenjangAK(jenjangJabatan);
    const koe = keahlianJenjangOptions[jenjangJabatan] || 0;

let pangkatMessage = "";

if (golongan === "IVe" && jenjangJabatan === "Ahli Utama" && (totalAK >= minimalPangkat || totalAK <= minimalPangkat)) {
    pangkatMessage = "Anda Sudah Mencapai Pangkat Tertinggi Jejang Ahli Utama"; 
} else if (totalAK >= minimalPangkat) {
    pangkatMessage = "Dapat Dipertimbangkan Untuk Kenaikan Pangkat Setingkat Lebih Tinggi";
} else {
    const gapPangkat = minimalPangkat - totalAK;
    if (koe > 0) {
        const bln_sb_pangkat = Math.round((gapPangkat / (1.5 * koe)) * 12);
        const bln_baik_pangkat = Math.round((gapPangkat / (1 * koe)) * 12);
        const bln_bp_pangkat = Math.round((gapPangkat / (0.75 * koe)) * 12);

        pangkatMessage =
            `Kenaikan Pangkat Dapat Dicapai Jika Memperoleh :<br>` +
            `- Sangat Baik Dalam ${formatMonths(bln_sb_pangkat)}; atau<br>` +
            `- Baik Dalam ${formatMonths(bln_baik_pangkat)}; atau<br>` +
            `- Butuh Perbaikan Dalam ${formatMonths(bln_bp_pangkat)}`;
    }
}
    let jenjangMessage = "";
    if (golongan === "IVe" && jenjangJabatan === "Ahli Utama") {
        if (totalAK >= minimalJenjang || totalAK <= minimalJenjang ) {
            jenjangMessage = "Anda Sudah Mencapai Jenjang Jabatan Fungsional Keahlian Tertinggi";
        } else {
            const gapJenjang = minimalJenjang - totalAK;
            if (koe > 0) {
                const bln_sb_jenjang = Math.round(gapJenjang / (1.5 * koe) * 12);
                const bln_baik_jenjang = Math.round(gapJenjang / (1 * koe) * 12);
                const bln_bp_jenjang = Math.round(gapJenjang / (0.75 * koe) * 12);

                jenjangMessage = `Kenaikan Jenjang Dapat Dicapai Jika Memperoleh : <br>` +
                                    `- Sangat Baik Dalam ${formatMonths(bln_sb_jenjang)}; atau<br>` +
                                    `- Baik Dalam ${formatMonths(bln_baik_jenjang)}; atau<br>` +
                                    `- Butuh Perbaikan Dalam ${formatMonths(bln_bp_jenjang)}`;
            } 
        }
    } else if (totalAK >= minimalJenjang) {
        jenjangMessage = "Dapat Dipertimbangkan Untuk Kenaikan Jenjang Jabatan Fungsional";
    } else {
        const gapJenjang = minimalJenjang - totalAK;
        if (koe > 0) {
            const bln_sb_jenjang = Math.round(gapJenjang / (1.5 * koe) * 12);
            const bln_baik_jenjang = Math.round(gapJenjang / (1 * koe) * 12);
            const bln_bp_jenjang = Math.round(gapJenjang / (0.75 * koe) * 12);

            jenjangMessage = `Kenaikan Jenjang Dapat Dicapai Jika Memperoleh :<br>` +
                                `- Sangat Baik Dalam ${formatMonths(bln_sb_jenjang)}; atau<br>` +
                                `- Baik Dalam ${formatMonths(bln_baik_jenjang)}; atau<br>` +
                                `- Butuh Perbaikan Dalam ${formatMonths(bln_bp_jenjang)}`;
        } else {
            jenjangMessage = `Butuh Tambahan Angka Kredit ${gapJenjang.toFixed(2)} Untuk Kenaikan Jenjang.`;
        }
    }

    navigate('/results', {
      state: {
        results: {
          totalAK: totalAK.toFixed(2),
          akMinimalPangkat: minimalPangkat.toFixed(2),
          akMinimalJenjang: minimalJenjang.toFixed(2),
          kenaikanPangkat: pangkatMessage,
          kenaikanJenjang: jenjangMessage,
          isPangkatSufficient: totalAK >= minimalPangkat,
          isJenjangSufficient: totalAK >= minimalJenjang,
        },
        formData: currentFormData,
        originPath: '/keahlian', // <--- Add this line
      },
    });
  };

  return (
    <div className="
      max-w-[600px]
      mx-auto
      my-px-20
      p-px-15
      bg-form-bg
      rounded-lg
      shadow-xl
      text-text-light
      font-roboto
      box-border
      w-full
      opacity-100
      transition-opacity duration-500 ease-in
    ">
      <h1 className="
        font-orbitron
        text-text-accent
        text-2xl
        md:text-3xl
        font-bold
        text-center
        mb-6
      ">
        Form Perhitungan Angka Kredit JF Keahlian
      </h1>
      <form ref={formRef} onSubmit={handleSubmit} className="space-y-px-20">

        {/* Common Fields */}
        <div id="common-fields" className="
          form-section
          bg-form-bg
          p-px-0
          rounded-lg
          mb-px-20
          block
        ">
          <h2 className="
            font-orbitron
            text-text-accent
            text-xl
            md:text-2xl
            mb-px-17
            text-center
            font-bold
          ">
            Jenjang JF Keahlian dan Golongan
          </h2>
          <div className="mb-4">
            <label htmlFor="jenjangJabatan" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Jenjang Jabatan:
            </label>
            <select
              id="jenjangJabatan"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                whitespace-nowrap
              "
              value={jenjangJabatan}
              onChange={(e) => setJenjangJabatan(e.target.value)}
              required
            >
              <option value="">Pilih Jenjang...</option>
              {Object.keys(keahlianJenjangOptions).map((jenjang) => (
                <option key={jenjang} value={jenjang}>
                  {jenjang}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label htmlFor="golongan" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Golongan:
            </label>
            <select
              id="golongan"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                whitespace-nowrap
              "
              value={golongan}
              onChange={(e) => setGolongan(e.target.value)}
              required
            >
              <option value="">Pilih Golongan...</option>
              {keahlianGolonganOptions.map((gol) => (
                <option key={gol} value={gol}>
                  {gol}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Keahlian Specific Fields */}
        <div id="keahlian-specific-fields" className="
          form-section
          bg-form-bg
          p-px-0
          rounded-lg
          mb-px-20
          block
        ">
          <h2 className="
            font-orbitron
            text-text-accent
            text-xl
            md:text-2xl
            mb-px-17
            text-center
            font-bold
          ">
            Angka Kredit Jabatan Fungsional Keahlian
          </h2>

          {/* Pendidikan */}
          <h3 className="
            font-roboto
            text-text-light
            text-lg
            mt-px-21
            mb-px-11
            text-left
            font-semibold
          ">
            Angka Kredit yang Diperoleh dari Peningkatan Pendidikan
            <br />
            <span className="text-sm font-normal text-gray-400">
              (Hanya Untuk Ijazah atau Gelar Yang Belum Pernah di Klaim)
            </span>
          </h3>
          <div className="
            flex gap-px-10
            mt-px-5
            mb-px-17
          ">
            <button
              type="button"
              className={`
                flex-1
                bg-button-dark
                text-text-light
                py-px-8_5
                border border-[#7a788e]
                rounded-md
                cursor-pointer
                transition-colors duration-300
                font-semibold
                ${pendidikanKlaim === 'Ya' ? 'bg-education-green border-education-green' : 'hover:bg-button-light-hover'}
              `}
              onClick={() => setPendidikanKlaim('Ya')}
            >
              Ya
            </button>
            <button
              type="button"
              className={`
                flex-1
                bg-button-dark
                text-text-light
                py-px-8_5
                border border-[#7a788e]
                rounded-md
                cursor-pointer
                transition-colors duration-300
                font-semibold
                ${pendidikanKlaim === 'Tidak' ? 'bg-education-red border-education-red' : 'hover:bg-button-light-hover'}
              `}
              onClick={() => setPendidikanKlaim('Tidak')}
            >
              Tidak
            </button>
          </div>
          {showPendidikanAkField && (
            <div className="mb-4">
              <label htmlFor="angkaKreditPendidikan" className="
                block text-text-light
                mb-px-5
                font-bold
                text-sm
                whitespace-nowrap
              ">
                Angka Kredit Pendidikan (Otomatis):
              </label>
              <input
                type="number"
                id="angkaKreditPendidikan"
                name="angkaKreditPendidikan"
                step="0.01"
                readOnly
                className="
                  w-full
                  bg-gray-700
                  text-text-light
                  p-px-10
                  my-px-10
                  border border-border-color
                  rounded-md
                  text-base
                  box-border
                  cursor-not-allowed
                  focus:outline-none
                "
                value={angkaKreditPendidikan.toFixed(2)}
              />
            </div>
          )}

          {/* Penyesuaian/Penyetaraan */}
          <h3 className="
            font-roboto
            text-text-light
            text-lg
            mt-px-21
            mb-px-11
            text-left
            font-semibold
          ">
            Angka Kredit Penyesuaian/Penyetaraan
            <br />
            <span className="text-sm font-normal text-gray-400">(Kosongkan Bila Tidak Ada)</span>
          </h3>
          <div className="mb-4">
            <label htmlFor="penyesuaianPenyetaraan" className="sr-only">Penyesuaian/Penyetaraan</label>
            <input
              type="number"
              id="penyesuaianPenyetaraan"
              name="penyesuaianPenyetaraan"
              step="0.01"
              placeholder="e.g., 12.50"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
              value={penyesuaianPenyetaraan}
              onChange={(e) => setPenyesuaianPenyetaraan(e.target.value)}
            />
          </div>

          {/* Angka Kredit Konversi */}
          <h3 className="
            font-roboto
            text-text-light
            text-lg
            mt-px-21
            mb-px-11
            text-left
            font-semibold
          ">
            Angka Kredit Konversi
          </h3>
          <div className="mb-4">
            <label htmlFor="akKonversi2022" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Tahun 2022
            </label>
            <input
              type="number"
              id="akKonversi2022"
              name="akKonversi2022"
              step="0.01"
              placeholder="e.g., 50.00"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              "
              value={akKonversi2022}
              onChange={(e) => setAkKonversi2022(e.target.value)}
            />
          </div>

          <div className="mb-4">
            <label htmlFor="akKonversi2023" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Tahun 2023 (Penilaian SKP):
            </label>
            <select
              id="akKonversi2023"
              name="akKonversi2023"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                whitespace-nowrap
              "
              value={akKonversi2023}
              onChange={(e) => setAkKonversi2023(e.target.value)}
            >
              <option value="">Pilih...</option>
              {skpOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input type="hidden" value={calculatedAk2023} />
          </div>

          <div className="mb-4">
            <label htmlFor="akKonversi2024" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Tahun 2024 (Penilaian SKP):
            </label>
            <select
              id="akKonversi2024"
              name="akKonversi2024"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                whitespace-nowrap
              "
              value={akKonversi2024}
              onChange={(e) => setAkKonversi2024(e.target.value)}
            >
              <option value="">Pilih...</option>
              {skpOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input type="hidden" value={calculatedAk2024} />
          </div>

          <div className="mb-4">
            <label htmlFor="akKonversi2025" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Tahun 2025 (Penilaian SKP):
            </label>
            <select
              id="akKonversi2025"
              name="akKonversi2025"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                whitespace-nowrap
              "
              value={akKonversi2025}
              onChange={(e) => setAkKonversi2025(e.target.value)}
              required
            >
              <option value="">Pilih...</option>
              {skpOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input type="hidden" value={calculatedAk2025} />
          </div>

          <div className="mb-4">
            <label htmlFor="periodeBulan2025" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Periode Bulan Berjalan Tahun 2025:
            </label>
            <select
              id="periodeBulan2025"
              name="periodeBulan2025"
              className="
                w-full
                bg-input-bg
                text-text-light
                p-px-10
                my-px-10
                border border-border-color
                rounded-md
                text-base
                box-border
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                whitespace-nowrap
              "
              value={periodeBulan2025}
              onChange={(e) => setPeriodeBulan2025(e.target.value)}
              required
            >
              <option value="">Pilih...</option>
              {monthOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
        </div>

        <button
          type="submit"
          id="hitungButton"
          className="
            w-full
            bg-text-accent
            text-[#1f1f1f]
            py-px-13_5
            text-lg
            font-bold
            border-none
            rounded-md
            mt-px-17
            cursor-pointer
            transition-colors duration-300
            hover:bg-[#a9e4b5]
            focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500
          "
        >
          Hitung Angka Kredit
        </button>
        {statusMessage && (
          <div id="status" className="
            mt-px-20
            italic
            text-status-text
            text-center
          ">
            {statusMessage}
          </div>
        )}
      </form>
    </div>
  );
};

export default KeahlianPage;