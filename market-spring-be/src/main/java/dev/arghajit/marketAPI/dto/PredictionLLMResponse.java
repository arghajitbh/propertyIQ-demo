package dev.arghajit.marketAPI.dto;
import com.fasterxml.jackson.annotation.JsonProperty;
public record PredictionLLMResponse(
        @JsonProperty("predicted_price")
        Double predictedPrice,

        @JsonProperty("predicted_price_usd")
        String predictedPriceUsd
) {
}