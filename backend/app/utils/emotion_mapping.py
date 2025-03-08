import json
from app.utils import constants

def map_to_emotion_label(valence, arousal, dominance):
  if valence > 5 and arousal > 5 and dominance > 5:
    return "HVHAHD"
  elif valence > 5 and arousal > 5 and dominance <= 5:
    return "HVHALD"
  elif valence > 5 and arousal <= 5 and dominance > 5:
    return "HVLAHD"
  elif valence > 5 and arousal <= 5 and dominance <= 5:
    return "HVLALD"
  elif valence <= 5 and arousal > 5 and dominance > 5:
    return "LVHAHD"
  elif valence <= 5 and arousal > 5 and dominance <= 5:
    return "LVHALD"
  elif valence <= 5 and arousal <= 5 and dominance > 5:
    return "LVLAHD"
  else:
    return "LVLALD"

def get_emotion_details(label):
  emotions_data = json.load(open(constants.EMOTIONS_PATH, "r", encoding="utf-8"))
  for emotion in emotions_data:
    if emotion["label"].strip() == label.strip():
      return {"name": emotion["name"], "emoji": emotion["emoji"]}
  return {"name": "Unknown", "emoji": "❓"}
