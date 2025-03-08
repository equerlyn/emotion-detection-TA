from pydantic import BaseModel

class PredictedEmotion(BaseModel):
  valence: float
  arousal: float
  dominance: float
  label: str
  name: str
  emoji: str
