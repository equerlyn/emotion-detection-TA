import React, { useState } from "react";

const Dropdown = () => {
  const [selectedModel, setSelectedModel] = useState("");

  const handleChange = (event) => {
    setSelectedModel(event.target.value);
    console.log("Model terpilih:", event.target.value);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Label untuk dropdown */}
      <label htmlFor="model-dropdown" className="text-sm font-medium raisin-black">
        Model
      </label>

      {/* Dropdown */}
      <select
        id="model-dropdown"
        value={selectedModel}
        onChange={handleChange}
        className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-56 mb-5 mt-3"
      >
        <option value="" disabled>
          Pilih model...
        </option>
        <option value="model1">Model 1</option>
        <option value="model2">Model 2</option>
        <option value="model3">Model 3</option>
      </select>
    </div>
  );
};

export default Dropdown;
