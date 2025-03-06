import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedModel: '',
  file: null,
  isUploading: false,
  isProcessing: false,
  error: null,
  result: {
    actual: {
      valence: null,
      arousal: null,
      dominance: null,
      label: null
    },
    predicted: {
      valence: null,
      arousal: null,
      dominance: null,
      label: null
    },
    emoji: null
  }
};

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    setFile: (state, action) => {
      state.file = action.payload;
    },
    startUpload: (state) => {
      state.isUploading = true;
      state.error = null;
    },
    uploadSuccess: (state) => {
      state.isUploading = false;
    },
    uploadFailure: (state, action) => {
      state.isUploading = false;
      state.error = action.payload;
    },
    startProcessing: (state) => {
      state.isProcessing = true;
      state.error = null;
    },
    setResults: (state, action) => {
      state.isProcessing = false;
      state.result = action.payload;
    },
    processingFailure: (state, action) => {
      state.isProcessing = false;
      state.error = action.payload;
    },
    resetState: () => initialState,
    setHasNavigated(state) {
      state.hasNavigated = true;
    },
  }
});

export const {
  setSelectedModel,
  setFile,
  startUpload,
  uploadSuccess,
  uploadFailure,
  startProcessing,
  setResults,
  processingFailure,
  resetState
} = emotionSlice.actions;

export default emotionSlice.reducer;