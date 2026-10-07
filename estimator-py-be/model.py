from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime

class EstimatorRequest(BaseModel):
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

class PredictionLLMResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price of the house")
    predicted_price_usd: str = Field(..., description="Predicted price in USD")


class EstimatorResponse(BaseModel):
    predicted_price: float = Field(..., description="Predicted price of the house")
    predicted_price_usd: str = Field(..., description="Predicted price in USD")
    model_info: Optional[dict] = Field(..., description="Information about the model used for prediction")

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "predicted_price": 350000,
                    "predicted_price_usd": "$350,000",
                        "model_info": {
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
                }
            ]
        }
    }
