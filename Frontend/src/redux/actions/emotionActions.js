import { 
  setFile, 
  startUpload, 
  uploadSuccess, 
  uploadFailure, 
  startProcessing, 
  setResults
} from '../reducers/emotionReducer';

// Thunk for handling file upload
export const uploadFile = (file) => (dispatch, getState) => {
  if (!file) return;
  
  dispatch(setFile(file));
};

// Thunk for processing the file
export const processFile = () => async (dispatch, getState) => {
  const { file } = getState().emotion;
  
  if (!file) {
    dispatch(uploadFailure('Please upload a file'));
    return;
  }
  
  try {
    dispatch(startUpload());
    const uploadResult = await mockApiUpload(file);
    dispatch(uploadSuccess());
    
    dispatch(startProcessing());
    const processResult = await mockApiProcess(uploadResult.fileId);
    dispatch(setResults(processResult));

    return true;
  } catch (error) {
    dispatch(uploadFailure(error.message));
    return false;
  }
};

export const fetchEmotions = () => async (dispatch) => {
  dispatch(setEmotionsLoading());

  try {
    const response = await axios.get(`${API_URL}/emotions`);

    if (response.data.success) {
      return response.data.emotions; // Pastikan ini mengambil `emotions`
    } else {
      return rejectWithValue(response.data.message || "Failed to fetch emotions");
    }
    
  } catch (error) {
    return rejectWithValue(error.response?.data || "Failed to fetch emotions");
  }
};
