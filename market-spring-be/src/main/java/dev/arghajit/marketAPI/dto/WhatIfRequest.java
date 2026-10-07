package dev.arghajit.marketAPI.dto;

public record WhatIfRequest(
        PredictionLLMRequest currentProperty,
        PredictionLLMRequest scenarioProperty
) {
}
