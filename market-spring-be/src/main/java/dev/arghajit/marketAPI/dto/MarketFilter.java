package dev.arghajit.marketAPI.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;

public record MarketFilter(

        @PositiveOrZero
        Double minPrice,

        @PositiveOrZero
        Double maxPrice,

        @PositiveOrZero
        Double minArea,

        @PositiveOrZero
        Double maxArea,

        @Min(0)
        Integer minBedrooms,

        @Min(0)
        Integer maxBedrooms,

        @Min(0)
        Integer minBathrooms,

        @Min(0)
        Integer maxBathrooms,

        @Min(0)
        Integer minYearBuilt,

        @Min(0)
        Integer maxYearBuilt

) {
}