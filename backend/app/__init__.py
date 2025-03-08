from fastapi import FastAPI
from app.config.cors import add_cors_middleware
from app.routes import root, predict, models, emotions

app = FastAPI(title="Emotion Detection API")

# Add CORS middleware
add_cors_middleware(app)

# Include routers
app.include_router(root.router)
app.include_router(predict.router, prefix="/predict", tags=["Prediction"])
app.include_router(models.router, prefix="/models", tags=["Models"])
app.include_router(emotions.router, prefix="/emotions", tags=["Emotions"])
@app.get("/debug_routes")
def debug_routes():
  return {"routes": [route.path for route in app.routes]}
