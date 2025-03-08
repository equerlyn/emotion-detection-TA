import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchModels, setSelectedModel } from "../connection/emotionSlice";

const Dropdown = () => {
  const dispatch = useDispatch();
  const { models, selectedModel, status } = useSelector((state) => state.emotion);

  useEffect(() => {
    dispatch(fetchModels());
  }, [dispatch]);

  const handleChange = (event) => {
    dispatch(setSelectedModel(event.target.value));
    console.log("Model selected:", event.target.value);
  };

  return (
    <div className="flex items-center gap-4">
      {/* Label for dropdown */}
      <label htmlFor="model-dropdown" className="text-sm font-medium raisin-black">
        Model
      </label>

      {/* Dropdown */}
      <select
        id="model-dropdown"
        value={selectedModel}
        onChange={handleChange}
        disabled={status === 'loading'}
        className="px-2 py-1 border border-gray-300 rounded-md text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-400 w-56 mb-5 mt-3"
      >
        <option value="" disabled>
          Select model...
        </option>
        {models.map((model) => (
          <option key={model} value={model}>
            {model}
          </option>
        ))}
      </select>
      {status === 'loading' && models.length <=0 && <span className="text-sm text-gray-500">Loading models...</span>}
    </div>
  );
};

export default Dropdown;