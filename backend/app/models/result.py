from pydantic import BaseModel
from typing import Dict

class Result(BaseModel):
  success: bool
  message: str
  result: Dict
  filename: str
