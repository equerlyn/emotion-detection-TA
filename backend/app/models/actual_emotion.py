from pydantic import BaseModel

class ActualEmotion(BaseModel):
  valence: float
  arousal: float
  dominance: float
  label: str
  name: str
  emoji: str
