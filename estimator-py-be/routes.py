from datetime import datetime
from typing import Optional

from fastapi import APIRouter, Body, HTTPException, Query
from clients.prediction_llm import get_model_info, get_prediction, get_health
from model import EstimatorRequest, EstimatorResponse

RECENT_HISTORY_SIZE = 10
router = APIRouter()
router.prefix = "/api/estimator"
@router.post("/",
            summary="Read estimator endpoint",
            description="Endpoint to read estimator information.",
            response_model=EstimatorResponse,
            responses = {200: {"description": "Successful Response"},
                         400: {"description": "Bad Request"},
                         500: {"description": "Internal Server Error"}})
def run_estimator(payload: EstimatorRequest = Body(...)) -> EstimatorResponse:
    
    if not get_health():
        raise HTTPException(status_code=500, detail="Prediction service is not healthy")

    try:
        model_info = get_model_info()
    except (ConnectionError, RuntimeError) as e:
        # Fallback: Don't let a downstream failure crash your whole endpoint
        model_info = {"status": "unavailable", "error": str(e)}
    
    try:
        prediction_response =  get_prediction(payload)

        return EstimatorResponse(
            predicted_price=prediction_response.predicted_price,
            predicted_price_usd=prediction_response.predicted_price_usd,
            model_info=model_info,
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/health",
            summary="Read health endpoint",
            description="Endpoint to read the health status of the prediction service.",
            responses = {200: {"description": "Service is healthy"},
                         500: {"description": "Service is not healthy"}})
def read_health():
    return {"status": "healthy"}
