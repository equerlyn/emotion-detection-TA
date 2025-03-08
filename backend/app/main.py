import uvicorn
import os
from app import app

def start_ngrok():
  """Start ngrok tunnel to expose the API to the internet"""
  port = int(os.environ.get("PORT", 8000))
  ngrok_auth = os.environ.get("NGROK_AUTH_TOKEN", "")
  if ngrok_auth:
      import pyngrok.ngrok as ngrok
      ngrok.set_auth_token(ngrok_auth)
  
  public_url = ngrok.connect(port).public_url
  app.logger.info(f"ngrok tunnel created: {public_url}")
  app.logger.info(f"Local API accessible at: http://127.0.0.1:{port}")
  
  app.root_path = public_url
  
  return public_url

if __name__ == "__main__":
  if os.environ.get("NGROK_ENABLED", "false").lower() == "true":
    start_ngrok()
  
  uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
