import os
import json

def load_emotions_data():
  with open("emotions.json", "r", encoding="utf-8") as file:
    return json.load(file)
