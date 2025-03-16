import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = 'http://127.0.0.1:8000' || 'http://localhost:8000';

export const uploadFile = createAsyncThunk(
  'emotion/uploadFile',
  async (file, { rejectWithValue }) => {
    if (!file) return rejectWithValue('No file selected');
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await axios.post(`${API_URL}/predict`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.success) {
        return response.data.result; 
      } else {
        return rejectWithValue(response.data.message || 'File upload failed');
      }
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to upload file');
    }
  }
);

export const fetchEmotions = createAsyncThunk(
  'emotion/fetchEmotions',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${API_URL}/emotions`);
      return response.data.emotions;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Failed to fetch emotions');
    }
  }
);
