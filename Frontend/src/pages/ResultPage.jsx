import React from 'react'
import Navbar from '../components/Navbar'
import ResultText from '../components/ResultText'
import ResultCard from '../components/ResultCard'

const ResultPage = () => {
  return (
    <div className="overflow-hidden flex flex-col h-screen">
      <Navbar />
      <div className="pl-4 bg flex flex-col items-center justify-center h-full">
        <ResultText />
        <div className="grid grid-cols-2 w-full justify-items-center">
          <ResultCard valence={7.5} arousal={8} dominance={2.3} label="HVALD" type="actual" />
          <ResultCard valence={7.5} arousal={8} dominance={2.3} label="HVALD" type="predicted" />
        </div>
      </div>
    </div>
  )
}

export default ResultPage