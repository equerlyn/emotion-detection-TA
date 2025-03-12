import { CheckCircle, XCircle } from "lucide-react";

export default function ResultComparison({ actual, predicted }) {
  // Fungsi untuk membulatkan angka hingga 2 desimal
  const roundToTwo = (num) => num.toFixed(2);

  // Fungsi untuk menentukan warna berdasarkan kategori High/Low
  const getCategoryColor = (value) => {
    return value > 5 ? "text-green-600 font-bold" : "text-red-600 font-bold";
  };

  // Fungsi untuk menentukan ikon yang akan ditampilkan
  const getMatchIcon = (actualValue, predictedValue) => {
    if (actualValue > 5 && predictedValue > 5) {
      return <CheckCircle className="text-green-500" size={24} />;
    } else if ((actualValue > 5 && predictedValue <= 5) || (actualValue <= 5 && predictedValue > 5)) {
      return <XCircle className="text-red-500" size={24} />;
    }
    return null;
  };

  return (
    <div className="w-full max-w-6xl p-8 shadow-2xl rounded-3xl bg-white border border-gray-300">
      <div className="grid grid-cols-3 text-center font-medium text-lg">
        {/* Header */}
        <div className="text-2xl font-bold border-b-2 border-gray-300 pb-2">Actual</div>
        <div className="text-2xl font-bold border-b-2 border-gray-300 pb-2">Predicted</div>
        <div className="text-2xl font-bold border-b-2 border-gray-300 pb-2">Match</div>

        {/* Valence */}
        <div className="py-4 border-b border-gray-200">
          <span className="text-gray-500 text-lg">Valence</span>
          <p className="text-2xl font-semibold">
            {roundToTwo(actual.valence)} {" "}
            <span className={getCategoryColor(actual.valence)}>
              ({actual.valence > 5 ? "High" : "Low"})
            </span>
          </p>
        </div>
        <div className="py-4 border-b border-gray-200">
          <span className="text-gray-500 text-lg">Valence</span>
          <p className="text-2xl font-semibold">
            {roundToTwo(predicted.valence)} {" "}
            <span className={getCategoryColor(predicted.valence)}>
              ({predicted.valence > 5 ? "High" : "Low"})
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center py-4 border-b border-gray-200">
          {getMatchIcon(actual.valence, predicted.valence)}
        </div>

        {/* Arousal */}
        <div className="py-4 border-b border-gray-200">
          <span className="text-gray-500 text-lg">Arousal</span>
          <p className="text-2xl font-semibold">
            {roundToTwo(actual.arousal)} {" "}
            <span className={getCategoryColor(actual.arousal)}>
              ({actual.arousal > 5 ? "High" : "Low"})
            </span>
          </p>
        </div>
        <div className="py-4 border-b border-gray-200">
          <span className="text-gray-500 text-lg">Arousal</span>
          <p className="text-2xl font-semibold">
            {roundToTwo(predicted.arousal)} {" "}
            <span className={getCategoryColor(predicted.arousal)}>
              ({predicted.arousal > 5 ? "High" : "Low"})
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center py-4 border-b border-gray-200">
          {getMatchIcon(actual.arousal, predicted.arousal)}
        </div>

        {/* Dominance */}
        <div className="py-4">
          <span className="text-gray-500 text-lg">Dominance</span>
          <p className="text-2xl font-semibold">
            {roundToTwo(actual.dominance)} {" "}
            <span className={getCategoryColor(actual.dominance)}>
              ({actual.dominance > 5 ? "High" : "Low"})
            </span>
          </p>
        </div>
        <div className="py-4">
          <span className="text-gray-500 text-lg">Dominance</span>
          <p className="text-2xl font-semibold">
            {roundToTwo(predicted.dominance)} {" "}
            <span className={getCategoryColor(predicted.dominance)}>
              ({predicted.dominance > 5 ? "High" : "Low"})
            </span>
          </p>
        </div>
        <div className="flex items-center justify-center py-4">
          {getMatchIcon(actual.dominance, predicted.dominance)}
        </div>
      </div>
    </div>
  );
}
