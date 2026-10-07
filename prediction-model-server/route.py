import pickle
from typing import Annotated, List
import numpy as np
from fastapi import Body, FastAPI, Query, HTTPException, APIRouter, Request
from contextlib import asynccontextmanager
import json
from pydantic import BaseModel, Field
import sklearn
from models import PredictionRequest, PredictionResponse, ModelInfo, HealthCheckResponse

router = APIRouter()


# 2. Define the Lifespan Context Manager



@router.post("/predict",
          summary="Predict housing price based on input features",
          description="Endpoint to predict housing price based on input features",
          response_model=PredictionResponse|List[PredictionResponse],
          responses={400: {"description": "Prediction error"}, 500: {"description": "Model is not initialized."}}
          )
def predict_price( request: Request, payload: PredictionRequest|List[PredictionRequest] = Body(...)):

    model = getattr(request.app.state, 'model', None)
    # Ensure the model is loaded
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not initialized.")
    

    # Normalize input: convert single request to list for uniform processing
    is_single_request = not isinstance(payload, list)
    requests = [payload] if is_single_request else payload
    prediction_outputs = []
    failed_requests = []

    for request_item in requests:
        try:
            input_features = np.array([[
                request_item.square_footage, request_item.bedrooms, request_item.bathrooms, request_item.year_built, 
                request_item.lot_size, request_item.distance_to_city_center, request_item.school_rating
            ]])
            prediction = model.predict(input_features)[0]
            prediction_outputs.append({
                "predicted_price": float(prediction),
                "predicted_price_usd": f"${float(prediction):,.2f}"
            })
        except Exception as e:
            failed_requests.append({
                "request": request_item,
                "error": str(e)
            })
            prediction_outputs.append({
                "predicted_price": None,
                "predicted_price_usd": None
            })

    if len(failed_requests) == len(requests):
        raise HTTPException(status_code=400, detail=f"All prediction requests failed: {failed_requests}")

    return prediction_outputs if not is_single_request else prediction_outputs[0]

@router.get("/model-info",
         summary="Get information about the housing price prediction model",
         description="Endpoint to retrieve information about the currently used housing price prediction model",
         response_model=ModelInfo,
         responses={500: {"description": "Model info file not found or invalid."}}
         )
def get_model_info():
    try:
        with open("model_info.json", "r") as f:
            model_info = json.load(f)
        return model_info
    except FileNotFoundError:
        raise HTTPException(status_code=500, detail="Model info file 'model_info.json' not found.")
    except json.JSONDecodeError:
        raise HTTPException(status_code=500, detail="Model info file 'model_info.json' is not a valid JSON.")
# sample curl command
# curl -X GET "http://127.0.0.1:8000/predict?square_footage=2000&bedrooms=3&bathrooms=2&year_built=1990&lot_size=5000&distance_to_city_center=10&school_rating=8" -H "accept: application/json"

@router.get("/health",
         summary="Health check endpoint",
         description="Endpoint to check the health status of the application",
         response_model=HealthCheckResponse,
         responses={500: {"description": "Application is not healthy."}}
         )
def health_check():
    return {"status": "ok"}