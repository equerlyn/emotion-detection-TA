import React from "react";

const ResultCard = ({ valence, arousal, dominance, label, type }) => {
  // Helper function to determine High or Low
  const getLevel = (value) => (value >= 5 ? "High" : "Low");

  return (
    <div
      className={`flow-down p-8 rounded-lg text-center w-5/6 h-68 shadow-md ${
        type === "actual" ? "bg-french-blue columbia-blue" : "bg-columbia-blue french-blue"
      }`}
    >
      <h2 className="text-3xl font-bold mb-6">
        {type === "actual" ? "ACTUAL" : "PREDICTED"}
      </h2>
      <div className="flex justify-between my-4 text-xl">
        <span>Valence</span>
        <span>
          {valence} ({getLevel(valence)})
        </span>
      </div>
      <hr className={`${type === "actual" ? "columbia-blue" : "french-blue"}`} />
      <div className="flex justify-between my-4 text-xl">
        <span>Arousal</span>
        <span>
          {arousal} ({getLevel(arousal)})
        </span>
      </div>
      <hr className={`${type === "actual" ? "columbia-blue" : "french-blue"}`} />
      <div className="flex justify-between my-4 text-xl">
        <span>Dominance</span>
        <span>
          {dominance} ({getLevel(dominance)})
        </span>
      </div>
      {/* <h3 className="my-8 text-2xl font-bold sunglow">{label}</h3> */}
    </div>
  );
};

export default ResultCard;
