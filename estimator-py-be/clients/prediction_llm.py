import os
import requests
from model import EstimatorRequest, PredictionLLMResponse
import dotenv
from functools import cache

dotenv.load_dotenv()

PREDICTION_SERVICE_URL = os.getenv("PREDICTION_LLM_API_URL") or "http://localhost:8001"

def get_health() -> bool:
    """Check the health of the prediction service.

    Returns:
        bool: True if the service is healthy, False otherwise.
    """
    try:
        response = requests.get(PREDICTION_SERVICE_URL + "/api/health", timeout=5)
        response.raise_for_status()
        return True
    except requests.RequestException as e:
        print(f"Health check failed: {e}")
        return False

def get_model_info() -> dict:
    """Get model information from the prediction service.

    Returns:
        dict: The model information.

    Raises:
        ConnectionError: If the prediction service request fails.
        RuntimeError: If the response cannot be parsed.
    """
    try:
        response = requests.get(PREDICTION_SERVICE_URL + "/api/model-info", timeout=5)
        response.raise_for_status()
        return response.json()
    except requests.RequestException as e:
        raise ConnectionError(f"Failed to get model info: {e}") from e
    except ValueError as e:
        raise RuntimeError(f"Failed to parse model info response: {e}") from e

def get_prediction(request_data: EstimatorRequest) -> PredictionLLMResponse:
    """Get prediction from the prediction service.
    
    Args:
        request_data (EstimatorRequest): The request data for the prediction.

    Returns:
        PredictionLLMResponse: The prediction response from the service.
    
    Raises:
        ConnectionError: If the prediction service request fails.
        RuntimeError: If the response cannot be parsed.
        SystemError: If the prediction service returns an error message.
        AttributeError: If the prediction response cannot be parsed into a PredictionResponse object.
    """
    response = requests.post(PREDICTION_SERVICE_URL + "/api/predict", json=request_data.dict())
    data = response.json()
    try:
        response.raise_for_status()
    except requests.HTTPError as e:
        raise ConnectionError(f"Prediction service request failed: {e}") from e

    # If the response contains an error message, raise an exception
    if "error" in data:
        raise SystemError(f"Prediction service returned an error: {data['error']}")

    try:
        formatted_data: PredictionLLMResponse = PredictionLLMResponse(**data)
    except Exception as e:
        raise AttributeError(f"Failed to parse prediction response: {e}") from e

    return formatted_data
    # return PredictionResponse(**data)  # Removed redundant return statement
