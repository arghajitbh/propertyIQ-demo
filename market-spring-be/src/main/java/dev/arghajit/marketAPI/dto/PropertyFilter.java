package dev.arghajit.marketAPI.dto;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.PositiveOrZero;

public class PropertyFilter {
//     location
// propertyType

// minPrice
// maxPrice

// minArea
// maxArea

// minBedrooms
// maxBedrooms

// minBathrooms
// maxBathrooms

// minYearBuilt
// maxYearBuilt


    private String location;
    private String propertyType;

    @PositiveOrZero
    private Double minPrice;

    @PositiveOrZero
    private Double maxPrice;

    @PositiveOrZero
    private Double minArea;

    @PositiveOrZero
    private Double maxArea;

    @Min(0)
    private Integer minBedrooms;

    @Min(0)
    private Integer maxBedrooms;

    @Min(0)
    private Integer minBathrooms;

    @Min(0)
    private Integer maxBathrooms;

    @Min(0)
    private Integer minYearBuilt;

    @Min(0)
    private Integer maxYearBuilt;
}
