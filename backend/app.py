from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
import numpy as np
import joblib
import os
import json
from typing import List, Optional
import uvicorn
import mne # MNE-Python for EEG processing
import matplotlib.pyplot as plt 
import tensorflow as tf 
import io
import cv2
from io import StringIO
from pydantic import BaseModel
import logging
import pyngrok.ngrok as ngrok
import warnings
from sklearn.preprocessing import StandardScaler
from PIL import Image

# Set up logging and suppress warnings
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
warnings.filterwarnings('ignore')

# Constants
MAX_FILE_SIZE_MB = 10  # Maximum file size in MB
# Constants
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024  # Convert MB to bytes
# Constants
MODEL_PATH = "models"
# Constants
REQUIRED_COLUMNS = ["seconds", "FZ", "PO4", "P4", "T8", "AF3", "F3"]
SELECTED_CHANNELS = ["FZ", "PO4", "P4", "T8", "AF3", "F3"]
# Constants
FIGSIZE_WIDTH = 300
# Constants
FIGSIZE_HEIGHT = 300
# Constants
SFREQ = 128
# Constants
DPI = 300
# Constants
CMAP = "binary"
# Constants
CROP_HEIGHT = 12
# Constants
STRETCH_HEIGHT = 12

# MODELS = {
#     "model1": os.path.join(MODEL_PATH, "190225_model.h5"),
#     "model2": os.path.join(MODEL_PATH, "model_6_300_300_1.h5")
#     # "model3": os.path.join(MODEL_PATH, "dummy_model3.pkl")
# }

def load_models_from_directory(model_path):
    """
    Mengiterasi semua file dalam folder model_path dan mengembalikan dictionary
    dengan nama file sebagai kunci dan jalur lengkap sebagai nilai.
    """
    if not os.path.exists(model_path):  # Pastikan folder ada
        print(f"Folder {model_path} tidak ditemukan.")
        return {}

    models = {}

    for filename in os.listdir(model_path):
        if filename.endswith('.h5'):
            model_name = filename.split('.')[0]
            file_path = os.path.join(model_path, filename)
            
            try:
                models[model_name] = file_path
            except Exception as e:
                print(f"Gagal memproses file {filename}: {e}")

    # Mengurutkan model berdasarkan waktu modifikasi terbaru (descending)
    sorted_models = dict(sorted(models.items(), key=lambda item: os.path.getmtime(item[1]), reverse=True))
    
    if not sorted_models:
        print("Tidak ada model yang ditemukan dalam folder.")
    
    return sorted_models
MODELS = load_models_from_directory(MODEL_PATH)

# Create app
app = FastAPI(title="Emotion Detection API")

# Define response models
class ActualEmotion(BaseModel):
    valence: float
    arousal: float
    dominance: float
    label: str

class PredictedEmotion(BaseModel):
    valence: float
    arousal: float
    dominance: float
    label: str

class ResultResponse(BaseModel):
    success: bool
    message: str
    result: dict # Actual and predicted emotions
    filename: str

# Set up CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)

# Initialize model folder
os.makedirs(MODEL_PATH, exist_ok=True)

# Load or create mock models
def initialize_mock_models():
    """Create mock models for demonstration if real models don't exist"""
    for model_name, model_path in MODELS.items():
        if not os.path.exists(model_path):
            logger.info(f"Creating mock model: {model_name}")
            # Create a simple TensorFlow model
            model = tf.keras.Sequential([
                tf.keras.layers.Dense(64, activation='relu', input_shape=(len(SELECTED_CHANNELS) * 5,)),
                tf.keras.layers.Dense(32, activation='relu'),
                tf.keras.layers.Dense(3)
            ])
            model.compile(optimizer='adam', loss='mse')
            
            # Mock training data
            X = np.random.rand(100, len(SELECTED_CHANNELS) * 5)  # 5 features per channel
            y = np.random.rand(100, 3)  # 3 outputs: valence, arousal, dominance
            model.fit(X, y, epochs=10, verbose=0)
            
            # Create a simple scaler
            scaler = StandardScaler()
            scaler.fit(X)
            
            # Save the model and scaler
            os.makedirs(os.path.dirname(model_path), exist_ok=True)
            model.save(model_path)
            joblib.dump(scaler, os.path.join(os.path.dirname(model_path), "scaler.pkl"))

# Initialize models
initialize_mock_models()

# Helper functions
def map_to_emotion_label(valence, arousal, dominance):
    """Map valence, arousal and dominance to emotion label"""
    # Simple mapping logic - can be expanded
    if valence > 5 and arousal > 5 and dominance > 5:
        return "HVHAHD"  # High Valence, High Arousal, High Dominance
    elif valence > 5 and arousal > 5 and dominance <= 5:
        return "HVHALD"  # High Valence, High Arousal, Low Dominance
    elif valence > 5 and arousal <= 5 and dominance > 5:
        return "HVLAHD"  # High Valence, Low Arousal, High Dominance
    elif valence > 5 and arousal <= 5 and dominance <= 5:
        return "HVLALD"  # High Valence, Low Arousal, Low Dominance
    elif valence <= 5 and arousal > 5 and dominance > 5:
        return "LVHAHD"  # Low Valence, High Arousal, High Dominance
    elif valence <= 5 and arousal > 5 and dominance <= 5:
        return "LVHALD"  # Low Valence, High Arousal, Low Dominance
    elif valence <= 5 and arousal <= 5 and dominance > 5:
        return "LVLAHD"  # Low Valence, Low Arousal, High Dominance
    else:
        return "LVLALD"  # Low Valence, Low Arousal, Low Dominance

# def get_emoji_for_label(label):
#     """Get emoji for emotion label"""
#     emoji_map = {
#         "HVHAHD": "😀",   # Happy
#         "HVHALD": "😎",   # Confident/Cool
#         "HVLAHD": "🧐",  # Curious
#         "HVLALD": "😌",  # Peaceful
#         "LVHAHD": "😡",   # Angry
#         "LVHALD": "😰",   # Anxious
#         "LVLAHD": "😔",  # Sad
#         "LVLALD": "😪"   # Tired
#     }
#     return emoji_map.get(label, "😐")

def preprocess_eeg_data(df, required_columns=REQUIRED_COLUMNS, sfreq=SFREQ, figsize_width=FIGSIZE_WIDTH, figsize_height=FIGSIZE_HEIGHT, dpi=DPI, cmap=CMAP):
    """
    Preprocess EEG data for model input and generate scalograms.
    
    Parameters:
    - df: DataFrame containing EEG data.
    - required_columns: List of required columns in the DataFrame.
    - sfreq: Sampling frequency of the EEG data.
    - figsize_width: Width of the figure for scalogram.
    - figsize_height: Height of the figure for scalogram.
    - dpi: DPI for the figure.
    - cmap: Colormap for the scalogram.
    
    Returns:
    - stacked_images: Tensor containing stacked scalograms.
    - metadata: Dictionary containing valence, arousal, and dominance (if available).
    """
    # Check if required columns exist
    missing_columns = [col for col in required_columns if col not in df.columns]
    if missing_columns:
        raise ValueError(f"Required columns {missing_columns} not found in data")
    
    # Extract only required EEG channels
    selected_channels = [col for col in required_columns if col != "seconds"]
    data = df[selected_channels].copy()
    
    # Extract valence, arousal, and dominance if available
    metadata = {
        "valence": df["valence"].iloc[0] if "valence" in df.columns else None,
        "arousal": df["arousal"].iloc[0] if "arousal" in df.columns else None,
        "dominance": df["dominance"].iloc[0] if "dominance" in df.columns else None,
    }
    
    # Create MNE Info object
    info = mne.create_info(ch_names=selected_channels, ch_types=['eeg'] * len(selected_channels), sfreq=sfreq, verbose=False)
    raw = mne.io.RawArray(data.T, info, verbose=False)
    
    # Compute scalogram
    freqs = np.arange(1, 47, 1)
    n_cycles = 5
    Ws = mne.time_frequency.morlet(sfreq=raw.info['sfreq'], freqs=freqs, n_cycles=n_cycles)
    tfr = mne.time_frequency.tfr.cwt(X=raw.get_data(picks=selected_channels), Ws=Ws, use_fft=True, mode='same', decim=1)
    
    # Ensure the directory exists
    video_dir = "scalograms"
    os.makedirs(video_dir, exist_ok=True)
    
    # List to hold paths of scalogram images
    image_paths = []
    
    # Generate and save scalograms
    n_signals, n_freqs, n_times = tfr.shape
    for signal_index, channel in enumerate(selected_channels):
        tfr_signal = tfr[signal_index]
        filename = os.path.join(video_dir, f"{channel}_wavelet.png")
        
        # Buat scalogram dan simpan sementara
        temp_filename = os.path.join(video_dir, f"temp_{channel}.png")
        plt.figure(figsize=(figsize_width / dpi, figsize_height / dpi), dpi=dpi)
        plt.imshow(np.abs(tfr_signal), aspect='auto', origin='lower', extent=(0, n_times, 1, n_freqs), cmap=cmap)
        plt.axis("off")
        plt.savefig(temp_filename, dpi=dpi, bbox_inches='tight', pad_inches=0, format="png")
        plt.close()

        # **Proses Cropping dan Stretching**
        img = Image.open(temp_filename)
        width, height = img.size

        # Potong bagian bawah dengan crop_height
        cropped_img = img.crop((0, 0, width, height - CROP_HEIGHT))

        # Hitung ukuran baru setelah stretching
        new_height = cropped_img.height + STRETCH_HEIGHT
        new_size = (cropped_img.width, new_height)

        # Stretch gambar ke ukuran baru
        stretched_img = cropped_img.resize(new_size, Image.LANCZOS)

        # Simpan hasil akhir
        stretched_img.save(filename, format="PNG")

        # Hapus file sementara
        os.remove(temp_filename)

        # Tambahkan ke daftar path gambar
        image_paths.append(filename)

    # Load and stack images
    target_size = (figsize_height, figsize_width)  # Adjust target size as needed
    stacked_images = load_and_stack_images(image_paths, target_size)
    
    return stacked_images, metadata

def load_and_stack_images(image_paths, target_size):
    """
    Load all images, resize, and stack into a tensor.
    :param image_paths: List of paths to images.
    :param target_size: Size of images after resizing.
    :return: Tensor with shape (N, H, W, C).
    """
    images = []
    for path in image_paths:
        # img = tf.keras.utils.load_img(path, target_size=target_size, color_mode='grayscale')
        # img = tf.keras.utils.img_to_array(img) / 255.0  # Normalize [0, 1]
        # images.append(img)
        img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)  # Pastikan hanya satu channel
        img = cv2.resize(img, target_size)  # Sesuaikan ukuran
        img = img / 255.0  # Normalisasi ke [0, 1]
        images.append(img)

    # Stack images along the first axis
    stacked_images = tf.stack(images, axis=0)
    stacked_images = np.expand_dims(stacked_images, axis=0)  # Jadi (1, 6, 300, 300)
    stacked_images = np.expand_dims(stacked_images, axis=-1) # Jadi (1, 6, 300, 300, 1)

    return stacked_images

# Load emotions.json once to avoid reading the file repeatedly
with open("emotions.json", "r", encoding="utf-8") as file:
    EMOTIONS_DATA = json.load(file)
print("📂 Data dari emotions.json:", EMOTIONS_DATA) 
def get_emotion_details(label):
    """
    Cari nama dan emoji berdasarkan label di emotions.json
    """
    print(f"🔍 Mencari label: {label}")  # Debugging
    
    for emotion in EMOTIONS_DATA:
        print(f"🆚 Bandingkan dengan: {emotion['label']}")  # Debugging
        if emotion["label"].strip() == label.strip():  # Hindari spasi tersembunyi
            return {"name": emotion["name"], "emoji": emotion["emoji"]}

    print("❌ Tidak ditemukan, mengembalikan Unknown")
    return {"name": "Unknown", "emoji": "❓"}  # Default jika tidak ditemukan

@app.get("/")
def read_root():
    return {"status": "API is running", "message": "Welcome to Emotion Detection API😆🙌🏻"}

@app.post("/predict", response_model=ResultResponse)
async def predict_emotion(file: UploadFile = File(...), model_name: str = "model1"):
    """
    Predict emotion from EEG data.
    """
    # Cek ukuran file
    file_size = await file.read()
    if len(file_size) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(status_code=400, detail=f"File size exceeds {MAX_FILE_SIZE_MB}MB limit.")
    
    # Kembalikan posisi baca file
    file.file.seek(0)
    
    # Validasi ekstensi file
    if not file.filename.endswith('.csv'):
        raise HTTPException(status_code=400, detail="Only CSV files are allowed.")
    
    # Validasi keberadaan model
    if model_name not in MODELS:
        raise HTTPException(status_code=404, detail=f"Model {model_name} not found. Available models: {', '.join(MODELS.keys())}")
    
    try:
        # Baca CSV
        df = pd.read_csv(io.StringIO(file.file.read().decode('utf-8')))
        
       # Ambil nilai actual jika ada
        actual_valence = df["valence"].iloc[0] if "valence" in df.columns else None
        actual_arousal = df["arousal"].iloc[0] if "arousal" in df.columns else None
        actual_dominance = df["dominance"].iloc[0] if "dominance" in df.columns else None

        # Preprocessing EEG data
        features, _ = preprocess_eeg_data(df)

        # Load model dan scaler
        model_path = MODELS[model_name]
        # scaler_path = os.path.join(os.path.dirname(model_path), "scaler.pkl")
        
        if not os.path.exists(model_path):
            raise HTTPException(status_code=500, detail=f"Model file not found at {model_path}")
        
        model = tf.keras.models.load_model(
            model_path, 
            custom_objects={"mse": tf.keras.losses.MeanSquaredError()}
        )
        # scaler = joblib.load(scaler_path)

        # Scale EEG features
        # scaled_features = scaler.transform(features)

        # Predict using model
        prediction = model.predict(features)
        # pred_valence, pred_arousal, pred_dominance = map(float, prediction)
        # pred_valence, pred_arousal, pred_dominance = map(float, prediction.tolist())
        # pred_valence, pred_arousal, pred_dominance = prediction[0], prediction[1], prediction[2]

        prediction = np.squeeze(prediction)
        pred_valence, pred_arousal, pred_dominance = prediction

        # Tentukan label berdasarkan prediksi
        actual_label = map_to_emotion_label(actual_valence, actual_arousal, actual_dominance) if actual_valence is not None else "Unknown"
        pred_label = map_to_emotion_label(pred_valence, pred_arousal, pred_dominance)
        
        # Ambil nama dan emoji dari emotions.json
        actual_details = get_emotion_details(actual_label)
        predicted_details = get_emotion_details(pred_label)

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
                    "name": actual_details["name"],  # Tambahkan nama
                    "emoji": actual_details["emoji"]  # Tambahkan emoji
                },
                "predicted": {
                    "valence": float(pred_valence),  # Konversi np.float32 ke float
                    "arousal": float(pred_arousal),
                    "dominance": float(pred_dominance),
                    "label": pred_label,
                    "name": predicted_details["name"],  # Tambahkan nama
                    "emoji": predicted_details["emoji"]  # Tambahkan emoji
                }
            },
            "filename": file.filename  # Pastikan filename berada di luar result
        }
        return response_data

    except Exception as e:
        logger.error(f"Error during prediction: {str(e)}", exc_info=True)
        raise HTTPException(status_code=500, detail=f"Internal server error: {str(e)}")
    
@app.get("/models")
def get_models():
    """Get list of available models"""
    return {"success": True, "models": list(MODELS.keys())}

@app.get("/emotions")
def get_emotions():
    """Get list of emotion labels with descriptions from an external file"""
    try:
        with open("emotions.json", "r", encoding="utf-8") as file:
            emotions = json.load(file)
        return {"success": True, "emotions": emotions}
    except FileNotFoundError:
        return {"success": False, "message": "Emotion data file not found."}
    except json.JSONDecodeError:
        return {"success": False, "message": "Error decoding the emotion data file."}
    except Exception as e:
        return {"success": False, "message": f"An error occurred: {str(e)}"}

def start_ngrok():
    """Start ngrok tunnel to expose the API to the internet"""
    port = int(os.environ.get("PORT", 8000))
    # Get ngrok auth token from environment variable or use a dummy value for demo
    ngrok_auth = os.environ.get("NGROK_AUTH_TOKEN", "")
    if ngrok_auth:
        ngrok.set_auth_token(ngrok_auth)
    
    # Open a ngrok tunnel to the API
    public_url = ngrok.connect(port).public_url
    logger.info(f"ngrok tunnel created: {public_url}")
    logger.info(f"Local API accessible at: http://127.0.0.1:{port}")
    
    # Update the FastAPI config to include the ngrok URL
    app.root_path = public_url
    
    return public_url

if __name__ == "__main__":
    # Start ngrok if NGROK_ENABLED environment variable is set to "true"
    if os.environ.get("NGROK_ENABLED", "false").lower() == "true":
        start_ngrok()
    
    # Start the FastAPI application
    uvicorn.run("app:app", host="0.0.0.0", port=8000, reload=True)