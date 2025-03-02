import React from "react";

const EmoCard = ({ label, name, emoji, description }) => {
  return (
    <div className="max-w-2xl bg-white rounded-lg border border-3 shadow-lg p-6 flex items-start gap-4">
      <div className="text-4xl">
        <span role="img" aria-label={name}>
          {emoji}
        </span>
      </div>

      {/* Card Content */}
      <div className="flex flex-col justify-start">
        {/* Title */}
        <h2 className="text-2xl font-semibold text-gray-800">{label}</h2>
        <h3 className="text-xl text-gray-700">{name}</h3>

        {/* Description */}
        <p className="text-gray-600 mt-2">
          {description}
        </p>
      </div>
    </div>
  );
};

export default EmoCard;