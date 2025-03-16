import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL =  'http://127.0.0.1:8000' || 'http://localhost:8000';

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

export const uploadEEGFile = createAsyncThunk(
  'emotion/uploadEEGFile',
  async ({ file }, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await axios.post(
        `${API_URL}/predict`, 
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
    result: null, 
    status: 'idle', 
    error: null,
    hasNavigated: false,
  },
  reducers: {
    resetResult: (state) => {
      state.result = null;
      state.status = 'idle';
      state.error = null;
    },
    setHasNavigated: (state) => {
      state.hasNavigated = true;  
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch emotions cases
      .addCase(fetchEmotions.pending, (state) => {
        state.status = "loading";
      })
      .addCase(fetchEmotions.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.emotions = action.payload; // Simpan data ke state
      })
      .addCase(fetchEmotions.rejected, (state, action) => {
        state.status = "failed";
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

export const { resetResult, setHasNavigated } = emotionSlice.actions;

export default emotionSlice.reducer;