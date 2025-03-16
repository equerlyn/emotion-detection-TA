import { configureStore } from '@reduxjs/toolkit';
import emotionReducer from './reducers/emotionReducer';

export const store = configureStore({
  reducer: {
    emotion: emotionReducer,
  },
});