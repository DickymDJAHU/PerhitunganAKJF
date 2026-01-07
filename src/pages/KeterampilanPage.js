// src/pages/KeterampilanPage.js
import React, { useState, useEffect, useRef, useMemo, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const KeterampilanPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const formRef = useRef(null);

  // --- Configuration Objects (memoized) ---
  const keterampilanJenjangOptions = useMemo(() => ({
      "Pemula": 3.75,
      "Terampil": 5,
      "Mahir": 12.5,
      "Penyelia": 25
  }), []);

      const keterampilanGolonganOptions = useMemo(() => ["IIa", "IIb", "IIc", "IId", "IIIa", "IIIb", "IIIc", "IIId", "IVa"], []);

      // --- Month & Year dropdown state ---
        // ✅ Tambahkan ini
        // ✅ Load last choice from localStorage on page load
      const [bulantmt, setBulan] = useState("");
      const [tahuntmt, setTahun] = useState("");

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

      const bulanToFractionReverse = useMemo(() => ({
      "Desember": 1/12,
      "November": 2/12,
      "Oktober": 3/12,
      "September": 4/12,
      "Agustus": 5/12,
      "Juli": 6/12,
      "Juni": 7/12,
      "Mei": 8/12,
      "April": 9/12,
      "Maret": 10/12,
      "Februari": 11/12,
      "Januari": 12/12
    }), []);
    
      const golonganDasarAK = useMemo(() => ({
        // Special combos
        "Pemula": { "IIb": 15 },
        "Terampil": { "IIIa": 40 },
        "Mahir": { "IIIc": 50 },
  
        // General mapping (applies to all jenjang unless overridden above)
        base: {
          "IIc": 20,
          "IId": 40,
          "IIIb": 50,
          "IIId": 100,
          "IVa": 100
        }
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

  // --- Calculation Functions (memoized) ---
  const getMinimalPangkatAK = useCallback((jenjang, golongan) => {
    // special-case Terampil + certain golongan
    if (jenjang === "Terampil") {
      if (golongan === "IIc") return { display: 40, value: 40 };
      if (golongan === "IId") return { display: 40, value: 40 };
      if (golongan === "IIIa") return { display: 40, value: 60 };
    }
      if (jenjang === "Pemula") {
      if (golongan === "IIb") return { display: 15, value: 30 };
    }
        if (jenjang === "Mahir") {
      if (golongan === "IIIc") return { display: 50, value: 100 };
    }
        if (jenjang === "Penyelia") {
      if (golongan === "IVa") return { display: 100, value: 200 };
    }
    switch (jenjang) {
      case "Pemula": return { display: 15, value: 15 };
      case "Terampil":    return { display: 20, value: 20 };
      case "Mahir":   return { display: 50, value: 50 };
      case "Penyelia":   return { display: 100, value: 100 };
      default:             return { display: 0, value: 0 };
    }
  }, []);

    const getMinimalJenjangAK = useCallback((jenjang, golongan) => {
      // special case: Pemula + IIb
      if (jenjang === "Pemula" && golongan === "IIb") {
        return { display: 15, value: 30 };
      }

      // defaults by jenjang
      if (jenjang === "Pemula")   return { display: 15, value: 15 };
      if (jenjang === "Terampil") return { display: 60, value: 60 };
      if (jenjang === "Mahir")    return { display: 100, value: 100 };
      if (jenjang === "Penyelia") return { display: 200, value: 200 };

      // no default → will return undefined if not matched
    }, []);

  const calculateAkKonversi = useCallback((penilaian, jenjang) => {
      const multiplier = penilaianToMultiplier[penilaian] || 0;
      const baseAK = keterampilanJenjangOptions[jenjang] || 0;
      return Number((multiplier * baseAK).toFixed(3));
  }, [penilaianToMultiplier, keterampilanJenjangOptions]);

  const calculateAkKonversi2025 = useCallback((penilaian, jenjang, bulan) => {
      const multiplier = penilaianToMultiplier[penilaian] || 0;
      const baseAK = keterampilanJenjangOptions[jenjang] || 0;
      const bulanFraction = bulanToFraction[bulan] || 0;
      return Number((multiplier * baseAK * bulanFraction).toFixed(3));
  }, [penilaianToMultiplier, keterampilanJenjangOptions, bulanToFraction]);

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
  const [akKonversi2026, setAkKonversi2026] = useState(location.state?.formData?.akKonversi2026 || '');
  const [periodeBulan2026, setPeriodeBulan2026] = useState(location.state?.formData?.periodeBulan2026 || '');

  // Calculated AK values
  const [calculatedAk2023, setCalculatedAk2023] = useState(0);
  const [calculatedAk2024, setCalculatedAk2024] = useState(0);
  const [calculatedAk2025, setCalculatedAk2025] = useState(0);
  const [calculatedAk2026, setCalculatedAk2026] = useState(0);

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
      const jenjangBaseAK = keterampilanJenjangOptions[jenjangJabatan] || 0;
      const akValue = Number((jenjangBaseAK).toFixed(3));
      setAngkaKreditPendidikan(akValue);
    } else {
      setShowPendidikanAkField(false);
      setAngkaKreditPendidikan(0);
    }
  }, [pendidikanKlaim, jenjangJabatan, keterampilanJenjangOptions]);

  useEffect(() => {
    const jenjang = jenjangJabatan;
    const ak2023 = calculateAkKonversi(akKonversi2023, jenjang);
    setCalculatedAk2023(ak2023);
    const ak2024 = calculateAkKonversi(akKonversi2024, jenjang);
    setCalculatedAk2024(ak2024);
    const ak2025 = calculateAkKonversi(akKonversi2025, jenjang);
    setCalculatedAk2025(ak2025);
    const ak2026 = calculateAkKonversi(akKonversi2026, jenjang, periodeBulan2026);
    setCalculatedAk2026(ak2026);
  }, [jenjangJabatan, akKonversi2023, akKonversi2024, akKonversi2025, akKonversi2026, periodeBulan2026, calculateAkKonversi, calculateAkKonversi2025]);

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
        tahuntmt,
        bulantmt,
        pendidikanKlaim,
        angkaKreditPendidikan,
        penyesuaianPenyetaraan,
        akKonversi2022,
        akKonversi2023,
        akKonversi2024,
        akKonversi2025,
        akKonversi2026,
        periodeBulan2026
    };

    const currentAKPendidikan = Number(angkaKreditPendidikan || 0);
    const currentAKPenyesuaian = Number(penyesuaianPenyetaraan || 0);
    const currentAKKonversi2022 = Number(akKonversi2022 || 0);
    const fraction = bulanToFractionReverse[bulantmt] || 1;

      // === AK Konversi 2023 ===
      const currentAKKonversi2023 =
        tahuntmt === "2023"
          ? calculatedAk2023 * fraction
          : calculatedAk2023;

      // === AK Konversi 2024 ===
      const currentAKKonversi2024 =
        tahuntmt === "2024"
          ? calculatedAk2024 * fraction
          : calculatedAk2024;

      const currentAKKonversi2025 =
        tahuntmt === "2025"
          ? calculatedAk2025 * fraction
          : calculatedAk2025;

     const currentAKKonversi2026 =
      tahuntmt === "2026"
        ? calculatedAk2026 * fraction
        : calculatedAk2026;
        
    const dasarAK =
                  (golonganDasarAK[jenjangJabatan]?.[golongan]) ??
                  (golonganDasarAK.base[golongan]) ??
                  0;

    const totalAK = currentAKPendidikan + currentAKPenyesuaian + currentAKKonversi2022 +
                    currentAKKonversi2023 + currentAKKonversi2024 + currentAKKonversi2025 + currentAKKonversi2026 + dasarAK -dasarAK;

    const minimalPangkatObj = getMinimalPangkatAK(jenjangJabatan, golongan);
    const minimalPangkatDisplay = Number(minimalPangkatObj.display || 0); // for UI only
    const minimalPangkatValue   = Number(minimalPangkatObj.value || 0);   // for calculations

    const minimalJenjangObj = getMinimalJenjangAK(jenjangJabatan, golongan);
    const minimalJenjangValue = Number(minimalJenjangObj.value || 0);;
    const koe = keterampilanJenjangOptions[jenjangJabatan] || 0;

    let pangkatMessage = "";

if (golongan === "IIId" && jenjangJabatan === "Penyelia" && (totalAK >= minimalPangkatValue || totalAK <= minimalPangkatValue)) {
    pangkatMessage = "Anda Sudah Mencapai Pangkat Tertinggi Jejang Penyelia";
} else if (
  totalAK >= minimalPangkatValue &&
  totalAK < minimalJenjangValue &&
  ["IIIb", "IId"].includes(golongan)
) {
  pangkatMessage = "Tidak Dapat Dipertimbangkan Untuk Kenaikan Pangkat Setingkat Lebih Tinggi";}
else if (totalAK >= minimalPangkatValue) {
    pangkatMessage = "Dapat Dipertimbangkan Untuk Kenaikan Pangkat Setingkat Lebih Tinggi";
} else {
    const gapPangkat = minimalPangkatValue - totalAK;
    if (koe > 0) {
        const bln_sb_pangkat = Math.round((gapPangkat / (1.5 * koe)) * 12);
        const bln_baik_pangkat = Math.round((gapPangkat / (1 * koe)) * 12);
        const bln_bp_pangkat = Math.round((gapPangkat / (0.75 * koe)) * 12);

        pangkatMessage = `Kenaikan Pangkat Dapat Dicapai Jika Memperoleh :<br>` +
                         `- Sangat Baik Dalam ${formatMonths(bln_sb_pangkat)}; atau<br>` +
                         `- Baik Dalam ${formatMonths(bln_baik_pangkat)}; atau<br>` +
                         `- Butuh Perbaikan Dalam ${formatMonths(bln_bp_pangkat)}`;
    }
}

    let jenjangMessage = "";
    if (golongan === "IIId" && jenjangJabatan === "Penyelia") {
        if (totalAK >= minimalJenjangValue || totalAK <= minimalJenjangValue) {
            jenjangMessage = "Anda Sudah Mencapai Jenjang Jabatan Fungsional Keterampilan Tertinggi";
        } else {
            const gapJenjang = minimalJenjangValue - totalAK;
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
    } else if (totalAK >= minimalJenjangValue) {
        jenjangMessage = "Dapat Dipertimbangkan Untuk Kenaikan Jenjang Jabatan Fungsional";
    } else {
        const gapJenjang = minimalJenjangValue - totalAK;
        if (koe > 0) {
            const bln_sb_jenjang = Math.round(gapJenjang / (1.5 * koe) * 12);
            const bln_baik_jenjang = Math.round(gapJenjang / (1 * koe) * 12);
            const bln_bp_jenjang = Math.round(gapJenjang / (0.75 * koe) * 12);

            jenjangMessage = `Kenaikan Jenjang Dapat Dicapai Jika Memperoleh :<br>` +
                                `- Sangat Baik Dalam ${formatMonths(bln_sb_jenjang)}; atau<br>` +
                                `- Baik Dalam ${formatMonths(bln_baik_jenjang)}; atau<br>` +
                                `- Butuh Perbaikan Dalam ${formatMonths(bln_bp_jenjang)}`;
        }
    }
    navigate('/results', {
      state: {
        results: {
          totalAK: totalAK.toFixed(3),
          akMinimalPangkat: minimalPangkatDisplay.toFixed(0), // for UI
          akMinimalJenjang: minimalJenjangValue.toFixed(0),
          kenaikanPangkat: pangkatMessage,
          kenaikanJenjang: jenjangMessage,
          isPangkatSufficient: totalAK >= minimalPangkatValue,
          isJenjangSufficient: totalAK >= minimalJenjangValue,
        },
        formData: currentFormData,
        originPath: '/keterampilan', // <--- Add this line
      },
    });
  };

  return (
    <div className="
      max-w-[500px]
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
        font-poppins
        text-text-accent
        text-2xl
        md:text-3xl
        font-bold
        text-center
        mb-6
      ">
        Form Perhitungan Angka Kredit JF Keterampilan
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
            font-poppins
            text-text-accent
            text-xl
            md:text-2xl
            mb-px-17
            text-center
            font-bold
          ">
            Jenjang JF Keterampilan dan Golongan
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
              {Object.keys(keterampilanJenjangOptions).map((jenjang) => (
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
              {keterampilanGolonganOptions.map((gol) => (
                <option key={gol} value={gol}>
                  {gol}
                </option>
              ))}
            </select>
          </div>
          <h2 className="
            font-poppins
            text-text-accent
            text-xl
            md:text-2xl
            mb-px-17
            text-center
            font-bold
          ">
            TMT Jabatan Fungsional
          </h2>


          {/* === BULAN & TAHUN DROPDOWN === */}
    <div className="mb-4 flex gap-4">

      {/* Bulan */}
      <div className="w-1/2">
        <label
          htmlFor="bulan"
          className="
            block text-text-light
            mb-px-5
            font-bold
            text-sm
            whitespace-nowrap
          "
        >
          Bulan TMT:
        </label>

        <select
          id="bulan"
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
          value={bulantmt}
          onChange={(e) => setBulan(e.target.value)}
          required
        >
          <option value="">Pilih Bulan...</option>
          {[
            "Januari", "Februari", "Maret", "April", "Mei", "Juni",
            "Juli", "Agustus", "September", "Oktober", "November", "Desember"
          ].map((month) => (
            <option key={month} value={month}>
              {month}
            </option>
          ))}
        </select>
      </div>

      {/* Tahun */}
      <div className="w-1/2">
        <label
          htmlFor="tahun"
          className="
            block text-text-light
            mb-px-5
            font-bold
            text-sm
            whitespace-nowrap
          "
        >
          Tahun TMT:
        </label>

        <select
          id="tahun"
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
          value={tahuntmt}
          onChange={(e) => setTahun(e.target.value)}
          required
        >
          <option value="">Pilih Tahun...</option>
          {Array.from({ length: 7 }).map((_, index) => {
            const year = new Date().getFullYear() - index;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
      </div>
      </div>
        </div>

        {/* Keterampilan Specific Fields */}
        <div id="keterampilan-specific-fields" className="
          form-section
          bg-form-bg
          p-px-0
          rounded-lg
          mb-px-20
          block
        ">
          <h2 className="
            font-poppins
            text-text-accent
            text-xl
            md:text-2xl
            mb-px-17
            text-center
            font-bold
          ">
            Angka Kredit Jabatan Fungsional Keterampilan
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
                value={angkaKreditPendidikan.toFixed(3)}
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
            <span className="text-sm font-normal text-gray-400">(Kosongkan Bila Tidak Ada/Isi Menggunakan KOMA ",")</span>
          </h3>
          <div className="mb-4">
            <label htmlFor="penyesuaianPenyetaraan" className="sr-only">Penyesuaian/Penyetaraan</label>
            <input
            type="text" // use text instead of number
            id="penyesuaianPenyetaraan"
            name="penyesuaianPenyetaraan"
            placeholder="e.g., 12,50"
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
            onChange={(e) => {
              let val = e.target.value;

              // allow only digits and one comma
              val = val.replace(/[^0-9,]/g, "").replace(/,(?=.*,)/g, "");

              // remove leading zeros unless "0," case
              val = val.replace(/^0+(?=\d)/, "");

              setPenyesuaianPenyetaraan(val);
            }}
          />
          </div>

          {/* Angka Kredit Integrasi */}
          <h3 className="
            font-poppins
            text-text-accent
            text-xl
            md:text-2xl
            mb-px-17
            text-center
            font-bold
          ">
            Angka Kredit Integrasi
          </h3>
          <div className="mb-4">
            <label htmlFor="akKonversi2022" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Tahun 2022 (Isi Menggunakan KOMA ",")
            </label>
            <input
            type="text" // use text so we can allow commas
            id="akKonversi2022"
            name="akKonversi2022"
            placeholder="e.g., 50,00"
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
            onChange={(e) => {
              let val = e.target.value;

              // allow only digits and one comma
              val = val.replace(/[^0-9,]/g, "").replace(/,(?=.*,)/g, "");

              // remove leading zeros unless "0," case
              val = val.replace(/^0+(?=\d)/, "");

              setAkKonversi2022(val);
            }}
            onBlur={() => {
              // Convert comma string to number internally if needed
              if (akKonversi2022) {
                const num = Number(akKonversi2022.replace(",", "."));
                if (!isNaN(num)) {
                  // store as string with 2 decimals and comma
                  setAkKonversi2022(num.toFixed(3).replace(".", ","));
                }
              }
            }}
          />
          </div>

 {/* Angka Kredit Konversi */}
          <h3 className="
            font-poppins
            text-text-accent
            text-xl
            md:text-2xl
            mb-px-17
            text-center
            font-bold
          ">
            Angka Kredit Konversi
          </h3>
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
            <label htmlFor="akKonversi2024" className="
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
            <label htmlFor="akKonversi2026" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Tahun 2026 (Penilaian SKP):
            </label>
            <select
              id="akKonversi2026"
              name="akKonversi2026"
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
              value={akKonversi2026}
              onChange={(e) => setAkKonversi2026(e.target.value)}
              
            >
              <option value="">Pilih...</option>
              {skpOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <input type="hidden" value={calculatedAk2026} />
          </div>

          <div className="mb-4">
            <label htmlFor="periodeBulan2026" className="
              block text-text-light
              mb-px-5
              font-bold
              text-sm
              whitespace-nowrap
            ">
              Periode Bulan Berjalan Tahun 2026:
            </label>
            <select
              id="periodeBulan2026"
              name="periodeBulan2026"
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
              value={periodeBulan2026}
              onChange={(e) => setPeriodeBulan2026(e.target.value)}
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
            hover:bg-green-600
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

export default KeterampilanPage;