package dev.arghajit.marketAPI.dto;

import dev.arghajit.marketAPI.dto.PredictionLLMResponse;

public record WhatIfResponse(
        PredictionLLMResponse currentPrediction,
        PredictionLLMResponse scenarioPrediction,
        double priceDifference,
        double percentageChange
) {
}