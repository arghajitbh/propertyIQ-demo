
from pydantic import Field, BaseModel


class PredictionRequest(BaseModel):
    square_footage: float = Field(..., description="Square footage of the house")
    bedrooms: int = Field(..., description="Number of bedrooms")
    bathrooms: float = Field(..., description="Number of bathrooms")
    year_built: int = Field(..., description="Year the house was built")
    lot_size: float = Field(..., description="Lot size of the house")
    distance_to_city_center: float = Field(..., description="Distance to the city center")
    school_rating: float = Field(..., description="Rating of the nearest school")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "square_footage": 2000,
                    "bedrooms": 3,
                    "bathrooms": 2,
                    "year_built": 1990,
                    "lot_size": 5000,
                    "distance_to_city_center": 10,
                    "school_rating": 8
                }
            ]
        }
    }

class PredictionResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price of the house")
    predicted_price_usd: str = Field(..., description="Predicted price in USD")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "predicted_price": 350000,
                    "predicted_price_usd": "$350,000.00"
                }
            ]
        }
    }

class Metrics(BaseModel):
    mean_squared_error: float = Field(..., description="Mean squared error of the model")
    r2_score: float = Field(..., description="R2 score of the model")


class ModelInfo(BaseModel):
    feature_names: list[str] = Field(..., description="List of feature names used by the model")
    metrics: Metrics = Field(..., description="Performance metrics of the model")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "feature_names": [
                        "square_footage",
                        "bedrooms",
                        "bathrooms",
                        "year_built",
                        "lot_size",
                        "distance_to_city_center",
                        "school_rating"
                    ],
                    "metrics": {
                        "mean_squared_error": 105617715.0,
                        "r2_score": 0.98
                    }
                }
            ]
        }
    }

class HealthCheckResponse(BaseModel):
    status: str = Field(..., description="Status of the application")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "status": "ok"
                }
            ]
        }
    }
