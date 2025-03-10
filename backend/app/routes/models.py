from fastapi import APIRouter
import app.utils.constants as constants  

router = APIRouter()

@router.get("/")
def get_models():
    return {"success": True, "models": list(constants.MODELS.keys())}
