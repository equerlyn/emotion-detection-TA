import { 
  setSelectedModel, 
  setFile, 
  startUpload, 
  uploadSuccess, 
  uploadFailure, 
  startProcessing, 
  setResults
} from '../reducers/emotionReducer';

export const selectModel = (modelId) => (dispatch) => {
  dispatch(setSelectedModel(modelId));
};

// Thunk for handling file upload
export const uploadFile = (file) => (dispatch, getState) => {
  if (!file) return;
  
  dispatch(setFile(file));
};

// Thunk for processing the file
export const processFile = () => async (dispatch, getState) => {
  const { file, selectedModel } = getState().emotion;
  
  if (!file || !selectedModel) {
    dispatch(uploadFailure('Please select a model and upload a file'));
    return;
  }
  
  try {
    dispatch(startUpload());
    const uploadResult = await mockApiUpload(file, selectedModel);
    dispatch(uploadSuccess());
    
    dispatch(startProcessing());
    const processResult = await mockApiProcess(uploadResult.fileId, selectedModel);
    dispatch(setResults(processResult));
    
    // Navigate to results page could be handled here with history.push
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
