import os

MAX_FILE_SIZE_MB = 10  # Maximum file size in MB
MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024  # Convert MB to bytes
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))  # Dapatkan direktori `backend/app/`
MODEL_PATH = os.path.join(BASE_DIR, "static", "models")  # Path ke `models/`
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

def load_models_from_directory(model_path):
  models = {}
  
  if not os.path.exists(model_path):
    print("❌ Folder model tidak ditemukan!")
    return models
  
  for filename in os.listdir(model_path):
    if filename.endswith('.h5'):
      model_name = filename.split('.')[0]  
      file_path = os.path.join(model_path, filename)

      try:
        models[model_name] = file_path
      except Exception as e:
        print(f"Gagal memproses file {filename}: {e}")

  # Urutkan model berdasarkan waktu modifikasi terbaru
  sorted_models = dict(sorted(models.items(), key=lambda item: os.path.getmtime(item[1]), reverse=True))
  
  return sorted_models

MODELS = load_models_from_directory(MODEL_PATH)