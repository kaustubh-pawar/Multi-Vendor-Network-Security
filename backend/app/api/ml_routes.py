from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.schemas.schemas import MLPredictRequest, MLPredictResponse
from app.ml.predictor import predict_pattern, get_model_telemetry
from app.ml.train_model import train_and_save_models

router = APIRouter(prefix="/api/ml", tags=["AI/ML Model Hub"])

@router.get("/metrics")
def get_ml_metrics():
    return get_model_telemetry()

@router.post("/predict", response_model=MLPredictResponse)
def predict_syntax(req: MLPredictRequest):
    res = predict_pattern(req.snippet, vendor=req.vendor)
    return {
        "snippet": req.snippet,
        "predicted_category": res["predicted_category"],
        "predicted_severity": res["predicted_severity"],
        "confidence": res["confidence"],
        "requires_review": res["requires_review"],
        "similar_rules": res["similar_rules"]
    }

@router.post("/retrain")
def trigger_retraining():
    card = train_and_save_models()
    return {
        "status": "SUCCESS",
        "message": "Model retrained and updated successfully",
        "model_version": card["model_version"],
        "accuracy": card["accuracy"]
    }
