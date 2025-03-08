import pandas as pd
import numpy as np
import mne
import matplotlib.pyplot as plt
import cv2
from PIL import Image
from app.utils import constants
import os

def preprocess_eeg_data(df, required_columns=constants.REQUIRED_COLUMNS, sfreq=constants.SFREQ, figsize_width=constants.FIGSIZE_WIDTH, figsize_height=constants.FIGSIZE_HEIGHT, dpi=constants.DPI, cmap=constants.CMAP):
  missing_columns = [col for col in required_columns if col not in df.columns]
  if missing_columns:
    raise ValueError(f"Required columns {missing_columns} not found in data")
  
  selected_channels = [col for col in required_columns if col != "seconds"]
  data = df[selected_channels].copy()
  
  metadata = {
    "valence": df["valence"].iloc[0] if "valence" in df.columns else None,
    "arousal": df["arousal"].iloc[0] if "arousal" in df.columns else None,
    "dominance": df["dominance"].iloc[0] if "dominance" in df.columns else None,
  }
  
  info = mne.create_info(ch_names=selected_channels, ch_types=['eeg'] * len(selected_channels), sfreq=sfreq, verbose=False)
  raw = mne.io.RawArray(data.T, info, verbose=False)
  
  freqs = np.arange(1, 47, 1)
  n_cycles = 5
  Ws = mne.time_frequency.morlet(sfreq=raw.info['sfreq'], freqs=freqs, n_cycles=n_cycles)
  tfr = mne.time_frequency.tfr.cwt(X=raw.get_data(picks=selected_channels), Ws=Ws, use_fft=True, mode='same', decim=1)
  
  video_dir = "scalograms"
  os.makedirs(video_dir, exist_ok=True)
  
  image_paths = []
  n_signals, n_freqs, n_times = tfr.shape
  for signal_index, channel in enumerate(selected_channels):
    tfr_signal = tfr[signal_index]
    filename = os.path.join(video_dir, f"{channel}_wavelet.png")
    
    temp_filename = os.path.join(video_dir, f"temp_{channel}.png")
    plt.figure(figsize=(figsize_width / dpi, figsize_height / dpi), dpi=dpi)
    plt.imshow(np.abs(tfr_signal), aspect='auto', origin='lower', extent=(0, n_times, 1, n_freqs), cmap=cmap)
    plt.axis("off")
    plt.savefig(temp_filename, dpi=dpi, bbox_inches='tight', pad_inches=0, format="png")
    plt.close()

    img = Image.open(temp_filename)
    width, height = img.size

    cropped_img = img.crop((0, 0, width, height - constants.CROP_HEIGHT))
    new_height = cropped_img.height + constants.STRETCH_HEIGHT
    new_size = (cropped_img.width, new_height)

    stretched_img = cropped_img.resize(new_size, Image.LANCZOS)
    stretched_img.save(filename, format="PNG")
    os.remove(temp_filename)

    image_paths.append(filename)

  stacked_images = load_and_stack_images(image_paths, (figsize_height, figsize_width))
  
  return stacked_images, metadata

def load_and_stack_images(image_paths, target_size):
  images = []
  for path in image_paths:
    img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
    img = cv2.resize(img, target_size)
    img = img / 255.0
    images.append(img)

  stacked_images = np.stack(images, axis=0)
  stacked_images = np.expand_dims(stacked_images, axis=0)
  stacked_images = np.expand_dims(stacked_images, axis=-1)

  return stacked_images
