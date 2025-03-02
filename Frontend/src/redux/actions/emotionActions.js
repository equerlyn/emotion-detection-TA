import { 
  setSelectedModel, 
  setFile, 
  startUpload, 
  uploadSuccess, 
  uploadFailure, 
  startProcessing, 
  setResults, 
  processingFailure 
} from '../reducers/emotionReducer';

// Mock API service - in a real app, you would use actual API calls
const mockApiUpload = (file, modelId) => {
  return new Promise((resolve, reject) => {
    // Simulate network delay
    setTimeout(() => {
      if (!file || !modelId) {
        reject(new Error('Missing file or model selection'));
      } else {
        resolve({ success: true, fileId: '123456' });
      }
    }, 1000);
  });
};

const mockApiProcess = (fileId, modelId) => {
  return new Promise((resolve) => {
    // Simulate processing
    setTimeout(() => {
      resolve({
        actual: {
          valence: 7.5,
          arousal: 8,
          dominance: 2.3,
          label: "HVALD"
        },
        predicted: {
          valence: 7.2,
          arousal: 7.8,
          dominance: 2.5,
          label: "HVALD"
        },
        emoji: "😎"
      });
    }, 2000);
  });
};

// Thunk for handling model selection
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