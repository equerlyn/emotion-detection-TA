import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

import axios from 'axios';

// Get API URL from environment or default to localhost
const API_URL = import.meta.env.VITE_REACT_APP_API_URL || 'http://localhost:8000';

// Async action to fetch all emotions
export const fetchEmotions = createAsyncThunk(
  'emotion/fetchEmotions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/emotions`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch emotions');
    }
  }
);

// Async action to fetch available models
export const fetchModels = createAsyncThunk(
  'emotion/fetchModels',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/models`);
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch models');
    }
  }
);

// Async action to upload file and get predictions
export const uploadEEGFile = createAsyncThunk(
  'emotion/uploadEEGFile',
  async ({ file, modelName }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_URL}/predict?model_name=${modelName}`, 
        formData, 
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      
      if (response.data.success) {
        return response.data; 
      } else {
        return rejectWithValue(response.data.message || "Prediction failed");
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to upload file');
    }
  }
);

const emotionSlice = createSlice({
  name: 'emotion',
  initialState: {
    emotions: [],
    models: [],
    selectedModel: '',
    result: null, // Tempat menyimpan hasil prediksi
    status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
    error: null,
  },
  reducers: {
    setSelectedModel: (state, action) => {
      state.selectedModel = action.payload;
    },
    resetPrediction: (state) => {
      state.prediction = null;
      state.status = 'idle';
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch emotions cases
      .addCase(fetchEmotions.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchEmotions.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.emotions = action.payload.emotions;
      })
      .addCase(fetchEmotions.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Fetch models cases
      .addCase(fetchModels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchModels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.models = action.payload.models;
        if (action.payload.models.length > 0 && !state.selectedModel) {
          state.selectedModel = action.payload.models[0];
        }
      })
      .addCase(fetchModels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      })
      
      // Upload file cases
      .addCase(uploadEEGFile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadEEGFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(uploadEEGFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { setSelectedModel, resetPrediction } = emotionSlice.actions;

export default emotionSlice.reducer;