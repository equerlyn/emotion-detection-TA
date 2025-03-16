import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import ResultText from '../components/ResultText';
import ResultComparison from '../components/ResultComparison';

const ResultPage = () => {
  const result = useSelector(state => state.emotion.result);
  const status = useSelector(state => state.emotion.status);

  console.log(result);

  const navigate = useNavigate();

  const actual = result.actual ?? { valence: 0, arousal: 0, dominance: 0, label: "Unknown" };
  const predicted = result.predicted ?? { valence: 0, arousal: 0, dominance: 0, label: "Unknown" };

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'failed' || !result || Object.keys(result).length === 0) {
      setLoading(true);
      setTimeout(() => {
        navigate("/"); 
      }, 2000);
    } else {
      setLoading(false);
    }
  }, [result, navigate]);

  if (!result || loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-2xl font-bold french-blue">Loading...</h1>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen">
      <Navbar />
      <div className="pl-4 bg flex flex-col items-center justify-center h-full">
        <ResultText />
        <ResultComparison actual={actual} predicted={predicted} />
      </div>
    </div>
  );
};

export default ResultPage;
