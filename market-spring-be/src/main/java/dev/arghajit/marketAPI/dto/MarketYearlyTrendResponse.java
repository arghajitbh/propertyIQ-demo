package dev.arghajit.marketAPI.dto;

public record MarketYearlyTrendResponse(
    String yearlyRange,
    long propertyCount,
    double averagePrice,
    double averagePricePerSqft
) {}