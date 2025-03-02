import React from 'react';
import { useSelector } from 'react-redux';

const ResultText = () => {
  const result = useSelector(state => state.emotion.result);

  // Pastikan nilai `result` tidak `undefined` sebelum mengakses propertinya
  const predictedLabel = result?.predicted?.label ?? null;
  const emoji = result?.emoji ?? '🤔';

  // Jika hasil prediksi belum tersedia, tampilkan pesan "Processing..."
  if (!predictedLabel) {
    return (
      <div className="flex flex-col items-center justify-center h-36 mb-8">
        <h1 className="text-xl font-semibold text-raisin-black mb-4">Processing your data...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-36 mb-8">
      <h1 className="text-xl font-semibold text-raisin-black mb-4">Your emotion is</h1>
      <div className="flex items-center space-x-4">
        <span className="text-5xl">{emoji}</span>
        <h2 className="text-4xl font-bold text-sunglow">{predictedLabel}</h2>
      </div>
    </div>
  );
};

export default ResultText;
