from fastapi import APIRouter

router = APIRouter()

@router.get("/")
def read_root():
  return {"status": "API is running", "message": "Welcome to Emotion Detection API😆🙌🏻"}
