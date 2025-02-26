import React from 'react';

const InfoCard = () => {
  return (
    <div className="flex flex-col items-center justify-center w-full max-w-md p-4 bg-sky-100 rounded-lg shadow-lg border-t-4 border-sky-400">
      {/* Bagian Header */}
      <div className="flex items-center space-x-2">
        <h1 className="text-lg font-semibold text-raisin-black">
          221116953
        </h1>
        <span className="text-xl text-raisin-black font-bold">|</span>
        <h2 className="text-lg font-semibold text-raisin-black">
          Felicia Pangestu
        </h2>
      </div>

      {/* Bagian Deskripsi */}
      <p className="text-center text-sm text-raisin-black mt-2">
        Peningkatan Performasi Klasifikasi Deteksi Emosi pada Sinyal EEG
        dengan pendekatan Deep Learning Menggunakan Dataset DEAP
      </p>

      {/* Footer */}
      <div className="mt-4 text-right w-full text-xs text-gray-600">
        <p>&copy;2025</p>
      </div>
    </div>
  );
};

export default InfoCard;
