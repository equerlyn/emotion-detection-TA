import React from 'react'

const ResultText = () => {
  return (
    <div className="flex flex-col items-center justify-center h-36 mb-8">
      <h1 className="text-xl font-semibold text-raisin-black mb-4">Your emotion is</h1>
      <div className="flex items-center space-x-4">
        <span className="text-5xl">😎</span>
        <h2 className="text-4xl font-bold text-sunglow">Confidence</h2>
      </div>
    </div>
  )
}

export default ResultText