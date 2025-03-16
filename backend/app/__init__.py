from fastapi import FastAPI
from app.config.cors import add_cors_middleware
from app.routes import root, predict, emotions

app = FastAPI(title="Emotion Detection API")

# Add CORS middleware
add_cors_middleware(app)

app.include_router(root.router)
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(emotions.router, prefix="/emotions", tags=["Emotions"])
