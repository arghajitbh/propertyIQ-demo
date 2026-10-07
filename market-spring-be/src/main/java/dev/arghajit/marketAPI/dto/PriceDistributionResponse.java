package dev.arghajit.marketAPI.dto;

public record PriceDistributionResponse(
    String priceRange,
        long propertyCount,
        double percentage
){}