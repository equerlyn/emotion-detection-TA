import React, { useEffect, useCallback, useState, useRef } from "react";
import { useDropzone } from "react-dropzone";
import { useDispatch, useSelector } from "react-redux";
import { uploadEEGFile, setHasNavigated } from "../connection/emotionSlice";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import uploadImage from '../assets/upload_image_icon.png';
import loadingGif from "../assets/loading.gif";

const REQUIRED_COLUMNS = ["FZ", "PO4", "P4", "T8", "AF3", "F3"];
const EMOJIS = ["🧐", "😎", "😀", "😌", "😡", "😰", "😔", "😪"];

const UploadFile = () => {
  const result = useSelector((state) => state.emotion.result);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { status, hasNavigated } = useSelector((state) => state.emotion);
  const hasShownToast = useRef(false);
  const [isLoading, setIsLoading] = useState(false);
  const [emojiIndex, setEmojiIndex] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (result && !hasShownToast.current && !hasNavigated && location.pathname !== "/result") {
      toast.success("Analysis complete!");
      hasShownToast.current = true;
      dispatch(setHasNavigated()); // Simpan status navigasi ke Redux
      navigate("/result");
    }
  }, [result, navigate, location, hasNavigated, dispatch]);

  useEffect(() => {
    if (isLoading) {
      const interval = setInterval(() => {
        setEmojiIndex((prevIndex) => (prevIndex + 1) % EMOJIS.length);
      }, 500);
      return () => clearInterval(interval);
    }
  }, [isLoading]);

  const validateCSV = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      
      reader.onload = (event) => {
        const text = event.target.result;
        const lines = text.split("\n");
        if (lines.length < 2) {
          reject("CSV file is empty or has no data");
          return;
        }

        const headers = lines[0].split(",");
        const missingColumns = REQUIRED_COLUMNS.filter(col => !headers.includes(col));

        if (missingColumns.length > 0) {
          reject(`Missing required columns: ${missingColumns.join(", ")}`);
          return;
        }

        resolve(true);
      };

      reader.onerror = () => reject("Failed to read file");
      reader.readAsText(file);
    });
  };

  const onDrop = useCallback((acceptedFiles) => {
    const selectedFile = acceptedFiles[0];

    if (selectedFile && selectedFile.name.endsWith('.csv')) {
      validateCSV(selectedFile)
        .then(() => {
          setFile(selectedFile);
          toast.info(`File selected: ${selectedFile.name}`);
        })
        .catch((error) => {
          toast.error(error);
        });
    } else {
      toast.error('Please select a valid CSV file');
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({ 
    onDrop,
    accept: { 'text/csv': ['.csv'] },
    maxFiles: 1
  });

  const handleUpload = async () => {
    if (!file) {
      toast.error("Please select a file to upload");
      return;
    }
    setIsLoading(true); 
  
    try {
      await dispatch(uploadEEGFile({ file })).unwrap();
      toast.success("Analysis complete!");
      navigate("/result");
    } catch (error) {
      toast.error(`Error: ${error.message || "Failed to process file"}`);
    } finally {
      setIsLoading(false); 
    }
  };  

  return (
    <div className="flex flex-col items-center w-full">
      <div
        {...getRootProps()}
        className="flex flex-col items-center justify-center w-full h-96 p-6 border-2 border-dashed border-gray-400 rounded-lg bg-gray-50"
      >
        <input {...getInputProps()} />
        <div className="flex flex-col items-center gap-y-2">
          <img
            src={uploadImage}
            alt="Upload Icon"
            className="w-16 h-16"
          />
          <p className="text-gray-700 font-medium">Drag a CSV file here</p>
          <p className="text-sm text-gray-500">
            Must include FZ, PO4, P4, T8, AF3, and F3 channel
          </p>
          {file && (
            <p className="text-sm text-green-600 mt-2">
              Selected: {file.name} ({(file.size / 1024).toFixed(2)} KB)
            </p>
          )}
        </div>
        <div className="flex items-center w-full my-4">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="px-2 text-gray-500">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <button
          type="button"
          className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-400 rounded-full hover:bg-gray-100"
        >
          Browse File
        </button>
      </div>

      {/* Tombol Upload */}
      {file && (
        <button
          type="button"
          disabled={status === "loading"}
          className={`mt-4 px-6 py-3 text-white font-medium rounded-full ${
            status === "loading"
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-600 hover:bg-blue-700"
          }`}
          onClick={handleUpload}
        >
          Analyze Emotion
        </button>
      )}

      {/* Modal Loading */}
      {isLoading && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-10 rounded-lg shadow-lg flex flex-col items-center w-96 h-42 relative">
            <div className="relative">
              <img src={loadingGif} alt="Loading..." className="w-24 h-24 relative z-20" />
              <span className="absolute inset-0 flex items-center justify-center text-6xl font-bold text-black z-10">{EMOJIS[emojiIndex]}</span>
            </div>
            <p className="mt-5 text-lg text-french-blue font-medium">Analyzing...</p>
          </div>
        </div>  
      )}
    </div>
  );
};

export default UploadFile;
