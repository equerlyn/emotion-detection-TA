import React from "react";

const EmoCard = () => {
  return (
    <div className="max-w-2xl bg-white rounded-lg border border-3 shadow-lg p-6 flex items-start gap-4">
      <div className="text-4xl">
        <span role="img" aria-label="emoji">
          😀
        </span>
      </div>

      {/* Konten Card */}
      <div className="flex flex-col justify-start">
        {/* Judul */}
        <h2 className="text-2xl font-semibold text-gray-800">HAHVL</h2>

        {/* Deskripsi */}
        <p className="text-gray-600 mt-2">
          Lorem ipsum dolor sit amet, consectetur adipisicing elit. Natus repellat officiis adipisci voluptates maiores voluptatem quia autem perferendis modi eveniet illum ab fugit, dolorum est. Lorem ipsum dolor sit amet consectetur, adipisicing elit. Quod ea ipsa nemo aliquid quam, optio aut iusto, nulla possimus quaerat quibusdam dignissimos voluptates, ipsam minus.
        </p>
      </div>
    </div>
  );
};

export default EmoCard;
