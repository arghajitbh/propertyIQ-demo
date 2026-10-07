package dev.arghajit.marketAPI.dto;
import java.util.Arrays;
import java.util.List;
public record MarketSummaryResponse(
        long totalProperties,
        double averagePrice,
        double medianPrice,
        double minPrice,
        double maxPrice,
        double averageArea,
        double averagePricePerSqft
) {
        public List<List<String>> toDataRows() {
            return Arrays.asList(
                Arrays.asList(String.valueOf(totalProperties), String.valueOf(averagePrice), String.valueOf(medianPrice), String.valueOf(minPrice), String.valueOf(maxPrice), String.valueOf(averageArea), String.valueOf(averagePricePerSqft))
            );
        }

        public String toString() {
            return "MarketSummaryResponse{" +
                    "totalProperties=" + totalProperties +
                    ", averagePrice=" + averagePrice +
                    ", medianPrice=" + medianPrice +
                    ", minPrice=" + minPrice +
                    ", maxPrice=" + maxPrice +
                    ", averageArea=" + averageArea +
                    ", averagePricePerSqft=" + averagePricePerSqft +
                    '}';
        }
}
