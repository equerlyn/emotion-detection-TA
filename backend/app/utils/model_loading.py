import tensorflow as tf
import os
import joblib

def load_model(model_path):
  if not os.path.exists(model_path):
    raise FileNotFoundError(f"Model file not found at {model_path}")
  
  model = tf.keras.models.load_model(
    model_path, 
    custom_objects={"mse": tf.keras.losses.MeanSquaredError()}
  )
  return model

def load_scaler(model_path):
  scaler_path = os.path.join(os.path.dirname(model_path), "scaler.pkl")
  if not os.path.exists(scaler_path):
    raise FileNotFoundError(f"Scaler file not found at {scaler_path}")
  
  scaler = joblib.load(scaler_path)
  return scaler
