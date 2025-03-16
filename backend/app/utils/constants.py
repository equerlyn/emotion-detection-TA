import os

MAX_FILE_SIZE_MB = 10  
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024  
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  
MODEL_PATH = os.path.join(BASE_DIR, "static", "models")  
EMOTIONS_PATH = os.path.join(BASE_DIR, "static", "emotions.json")
REQUIRED_COLUMNS = ["seconds", "FZ", "PO4", "P4", "T8", "AF3", "F3"]
SELECTED_CHANNELS = ["FZ", "PO4", "P4", "T8", "AF3", "F3"]
FIGSIZE_WIDTH = 300
FIGSIZE_HEIGHT = 300
SFREQ = 128
DPI = 300
CMAP = "binary"
CROP_HEIGHT = 12
STRETCH_HEIGHT = 12
MODELS = os.path.join(BASE_DIR, "static", "models", "model_6_300_300_1.h5") 