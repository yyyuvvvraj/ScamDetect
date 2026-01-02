from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from scam_detector import analyze_message

app = FastAPI(title="ScamDetect API")

# Allow frontend to call backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # tighten later
    allow_methods=["*"],
    allow_headers=["*"],
)

class MessageRequest(BaseModel):
    message: str

@app.post("/analyze")
def analyze(req: MessageRequest):
    return analyze_message(req.message)
