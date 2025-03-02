import { configureStore } from '@reduxjs/toolkit';
import emotionReducer from '../connection/emotionSlice';

export const store = configureStore({
  reducer: {
    emotion: emotionReducer,
  },
});