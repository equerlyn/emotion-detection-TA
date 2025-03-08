from fastapi import APIRouter, HTTPException
import json

router = APIRouter()

@router.get("/")
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
