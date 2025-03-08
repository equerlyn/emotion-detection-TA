from fastapi import APIRouter, UploadFile, File, HTTPException
from app.models import Result
from app.utils import constants, data_loading, eeg_preprocessing, emotion_mapping, model_loading
import pandas as pd
import numpy as np
import logging
import io
from io import StringIO

router = APIRouter()

@router.post("/", response_model=Result)
async def predict_emotion(file: UploadFile = File(...), model_name: str = "model1"):
  logger = logging.getLogger(__name__)
  
  # Cek ukuran file
  file_size = await file.read()
  if len(file_size) > constants.MAX_FILE_SIZE_BYTES:
    raise HTTPException(status_code=400, detail=f"File size exceeds {constants.MAX_FILE_SIZE_MB}MB limit.")
  
  # Kembalikan posisi baca file
  file.file.seek(0)
  
  # Validasi ekstensi file
  if not file.filename.endswith('.csv'):
    raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
  
  # Validasi keberadaan model
  if model_name not in constants.MODELS:
    raise HTTPException(status_code=404, detail=f"Model {model_name} not found. Available models: {', '.join(constants.MODELS.keys())}")
  
  try:
    df = pd.read_csv(StringIO(file.file.read().decode('utf-8')))
    
    # Ambil nilai actual jika ada
    actual_valence = df["valence"].iloc[0] if "valence" in df.columns else None
    actual_arousal = df["arousal"].iloc[0] if "arousal" in df.columns else None
    actual_dominance = df["dominance"].iloc[0] if "dominance" in df.columns else None

    # Preprocessing EEG data
    features, _ = eeg_preprocessing.preprocess_eeg_data(df)

    # Load model dan scaler
    model_path = constants.MODELS[model_name]
    model = model_loading.load_model(model_path)
    
    # Predict using model
    prediction = model.predict(features)
    prediction = np.squeeze(prediction)
    pred_valence, pred_arousal, pred_dominance = prediction

    # Tentukan label berdasarkan prediksi
    actual_label = emotion_mapping.map_to_emotion_label(actual_valence, actual_arousal, actual_dominance) if actual_valence is not None else "Unknown"
    pred_label = emotion_mapping.map_to_emotion_label(pred_valence, pred_arousal, pred_dominance)
    
    # Ambil nama dan emoji dari emotions.json
    actual_details = emotion_mapping.get_emotion_details(actual_label)
    predicted_details = emotion_mapping.get_emotion_details(pred_label)

    # Return response
    response_data = {
        "success": True,
        "message": "Prediction successful",
        "result": {
            "actual": {
                "valence": float(actual_valence),
                "arousal": float(actual_arousal),
                "dominance": float(actual_dominance),
                "label": actual_label,
                "name": actual_details["name"],
                "emoji": actual_details["emoji"]
            },
            "predicted": {
                "valence": float(pred_valence),
                "arousal": float(pred_arousal),
                "dominance": float(pred_dominance),
                "label": pred_label,
                "name": predicted_details["name"],
                "emoji": predicted_details["emoji"]
            }
        },
        "filename": file.filename
    }
    return response_data

  except Exception as e:
    logger.error(f"Error during prediction: {str(e)}", exc_info=True)
    raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
