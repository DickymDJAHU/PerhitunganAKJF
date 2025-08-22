// src/pages/PengajuanKenaikan.js
import React, { useState } from "react";

export default function PengajuanKenaikan() {
  const [nip, setNip] = useState("");
  const [statusMessage, setStatusMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nip) {
      setStatusMessage("Masukkan NIP terlebih dahulu.");
      return;
    }

    try {
      const response = await fetch(
        "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec",
        {
          method: "POST",
          body: JSON.stringify({ nip }),
          headers: { "Content-Type": "application/json" },
        }
      );

      const result = await response.json();
      setStatusMessage(result.message || "Dokumen berhasil dikirim!");
    } catch (error) {
      console.error("Error:", error);
      setStatusMessage("Gagal mengirim dokumen.");
    }
  };

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center p-6">
      <div className="bg-form-bg rounded-2xl shadow-lg p-8 w-full max-w-2xl text-text-light">
        {/* Title */}
        <h1 className="text-2xl font-bold text-center text-text-accent mb-6">
          Pengajuan Kenaikan
        </h1>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Input NIP */}
          <div>
            <label
              htmlFor="nip"
              className="block text-text-light font-medium mb-2"
            >
              Masukkan NIP
            </label>
            <input
              type="text"
              id="nip"
              placeholder="Contoh: 198712121999012002"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              className="w-full bg-input-bg border border-border-color rounded-lg p-3 text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:outline-none"
              style={{
                WebkitBoxShadow: "0 0 0px 1000px #403f4c inset", // keep dark bg on autofill
                WebkitTextFillColor: "#ffffff",
              }}
            />
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="w-full bg-button-dark hover:bg-button-light-hover active:bg-text-light active:text-black text-white font-semibold px-6 py-3 rounded-lg transition duration-200"
          >
            Kirim Dokumen Pengajuan Kenaikan
          </button>
        </form>

        {/* Status message */}
        {statusMessage && (
          <p className="mt-4 text-center text-status-text italic">
            {statusMessage}
          </p>
        )}
      </div>
    </div>
  );
}
