package dev.arghajit.marketAPI.dto;

public record MarketAreaAnalysisResponse(
    String areaRange,
        long propertyCount,
        double averagePrice,
        double averagePricePerSqft
) {}