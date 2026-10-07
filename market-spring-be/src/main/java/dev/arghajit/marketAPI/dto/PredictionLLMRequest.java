package dev.arghajit.marketAPI.dto;

import com.fasterxml.jackson.annotation.JsonProperty;

public record PredictionLLMRequest (
        @JsonProperty("square_footage")
        Double squareFootage,

        Integer bedrooms,

        Integer bathrooms,

        @JsonProperty("year_built")
        Integer yearBuilt,

        @JsonProperty("lot_size")
        Double lotSize,

        @JsonProperty("distance_to_city_center")
        Double distanceToCityCenter,

        @JsonProperty("school_rating")
        Double schoolRating
) {
}