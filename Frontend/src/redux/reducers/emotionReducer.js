import { createSlice } from '@reduxjs/toolkit';
import { fetchEmotions, uploadFile } from '../actions/emotionActions';

const initialState = {
  file: null,
  isUploading: false,
  isProcessing: false,
  emotions: [],  
  status: 'idle', 
  error: null,
  result: {}
};

const emotionSlice = createSlice({
  name: 'emotion',
  initialState,
  reducers: {
    resetState: () => initialState,
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
      .addCase(uploadFile.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.result = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload;
      });
  },
});

export const { resetState, setHasNavigated} = emotionSlice.actions;

export default emotionSlice.reducer;