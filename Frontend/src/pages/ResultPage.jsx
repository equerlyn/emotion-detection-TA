import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResultText from '../components/ResultText';
import ResultCard from '../components/ResultCard';

const ResultPage = () => {
  const result = useSelector(state => state.emotion.result);
  const navigate = useNavigate();

  // Pastikan `result` dan `actual` serta `predicted` ada sebelum diakses
  const actual = result?.actual ?? { valence: 0, arousal: 0, dominance: 0, label: "Unknown" };
  const predicted = result?.predicted ?? { valence: 0, arousal: 0, dominance: 0, label: "Unknown" };


  // Redirect jika tidak ada data hasil prediksi
  useEffect(() => {
    console.log("Result updated:", result);
    if (!result) {
      // navigate("/");
    }
  }, [result, navigate]);

  return (
    <div className="overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="pl-4 bg flex flex-col items-center justify-center h-full">
        <ResultText />
        <div className="grid grid-cols-2 w-full justify-items-center">
          <ResultCard 
            valence={actual.valence} 
            arousal={actual.arousal} 
            dominance={actual.dominance} 
            label={actual.label} 
            type="actual" 
          />
          <ResultCard 
            valence={predicted.valence} 
            arousal={predicted.arousal} 
            dominance={predicted.dominance} 
            label={predicted.label} 
            type="predicted" 
          />
        </div>
      </div>
    </div>
  );
};

export default ResultPage;
