package dev.arghajit.marketAPI.service;

import org.springframework.stereotype.Service;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.domain.Specification;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.stream.Collectors;

import dev.arghajit.marketAPI.repository.PropertyRepository;
import dev.arghajit.marketAPI.repository.PropertySpecification;
import dev.arghajit.marketAPI.dto.MarketAreaAnalysisResponse;
import dev.arghajit.marketAPI.dto.MarketFilter;
import dev.arghajit.marketAPI.dto.MarketSummaryResponse;
import dev.arghajit.marketAPI.dto.MarketYearlyTrendResponse;
import dev.arghajit.marketAPI.dto.PriceDistributionResponse;
import dev.arghajit.marketAPI.entity.Property;


@Service
@RequiredArgsConstructor
public class MarketService {

    private final PropertyRepository propertyRepository;

    public MarketSummaryResponse getMarketSummary(MarketFilter filter) {

        // 1. Build dynamic specification
        Specification<Property> specification =
                PropertySpecification.withFilters(filter);

        // 2. Fetch matching properties
        List<Property> properties =
                propertyRepository.findAll(specification);

        if (properties.isEmpty()) {
            return new MarketSummaryResponse(
                    0,
                    0,
                    0,
                    0,
                    0,
                    0,
                    0
            );
        }

        // 3. Calculate metrics
        long total = properties.size();

        double averagePrice = properties.stream()
                .mapToDouble(Property::getPrice)
                .average()
                .orElse(0);

        double minPrice = properties.stream()
                .mapToDouble(Property::getPrice)
                .min()
                .orElse(0);

        double maxPrice = properties.stream()
                .mapToDouble(Property::getPrice)
                .max()
                .orElse(0);

        double averageArea = properties.stream()
                .filter(p -> p.getArea() != null)
                .mapToDouble(Property::getArea)
                .average()
                .orElse(0);

        double averagePricePerSqft = properties.stream()
                .filter(p -> p.getArea() != null && p.getArea() > 0)
                .mapToDouble(p -> p.getPrice() / p.getArea())
                .average()
                .orElse(0);

        double medianPrice = calculateMedian(
                properties.stream()
                        .map(Property::getPrice)
                        .sorted()
                        .toList()
        );

        double medianPriceDecimal = Math.round(medianPrice * 100.0) / 100.0;
        double averagePriceDecimal = Math.round(averagePrice * 100.0) / 100.0;
        double minPriceDecimal = Math.round(minPrice * 100.0) / 100.0;
        double maxPriceDecimal = Math.round(maxPrice * 100.0) / 100.0;
        double averagePricePerSqftDecimal = Math.round(averagePricePerSqft * 100.0) / 100.0;

        return new MarketSummaryResponse(
                total,
                averagePriceDecimal,
                medianPriceDecimal,
                minPriceDecimal,
                maxPriceDecimal,
                averageArea,
                averagePricePerSqftDecimal
        );
    }



    public List<MarketAreaAnalysisResponse> getMarketAreaAnalysis(
            MarketFilter filter) {

        Specification<Property> specification =
                PropertySpecification.withFilters(filter);

        List<Property> properties =
                propertyRepository.findAll(specification);

        return properties.stream()
                .filter(p -> p.getArea() != null && p.getArea() > 0)
                .collect(Collectors.groupingBy(
                        this::getAreaBucket,
                        LinkedHashMap::new,
                        Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(entry -> {

                    List<Property> bucketProperties = entry.getValue();

                    double averagePrice = bucketProperties.stream()
                            .mapToDouble(Property::getPrice)
                            .average()
                            .orElse(0.0);

                    double averagePricePerSqft =
                            bucketProperties.stream()
                                    .filter(p ->
                                            p.getArea() != null &&
                                            p.getArea() > 0)
                                    .mapToDouble(p ->
                                            p.getPrice() / p.getArea())
                                    .average()
                                    .orElse(0.0);
                    
                    double averagePriceDecimal = Math.round(averagePrice * 100.0) / 100.0;
                    double averagePricePerSqftDecimal = Math.round(averagePricePerSqft * 100.0) / 100.0;

                    return new MarketAreaAnalysisResponse(
                            entry.getKey(),
                            bucketProperties.size(),
                            averagePriceDecimal,
                            averagePricePerSqftDecimal
                    );
                })
                .toList();
    }

    private String getAreaBucket(Property property) {

        double area = property.getArea();

        if (area < 500) {
            return "Under 500";
        }

        if (area < 1000) {
            return "500 - 999";
        }

        if (area < 1500) {
            return "1000 - 1499";
        }

        if (area < 2000) {
            return "1500 - 1999";
        }

        if (area < 3000) {
            return "2000 - 2999";
        }

        return "3000+";
    }

    public List<PriceDistributionResponse> getMarketPriceDistribution(
            MarketFilter filter) {

        Specification<Property> specification =
                PropertySpecification.withFilters(filter);

        List<Property> properties =
                propertyRepository.findAll(specification);

        long totalProperties = properties.size();

        if (totalProperties == 0) {
            return List.of();
        }

        return properties.stream()
                .filter(p -> p.getPrice() != null && p.getPrice() > 0)
                .collect(Collectors.groupingBy(
                        this::getPriceBucket,
                        LinkedHashMap::new,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> {

                    long count = entry.getValue();

                    double percentage = 
                            (count * 100.0) / totalProperties;
                    double roundedPercentage = Math.round(percentage * 100.0) / 100.0;
                    return new PriceDistributionResponse(
                            entry.getKey(),
                            count,
                            roundedPercentage
                    );
                })
                .toList();
    }

    private String getPriceBucket(Property property) {

        double price = property.getPrice();

        if (price < 100_000) {
            return "Under 100K";
        }

        if (price < 250_000) {
            return "100K - 249K";
        }

        if (price < 500_000) {
            return "250K - 499K";
        }

        if (price < 750_000) {
            return "500K - 749K";
        }

        if (price < 1_000_000) {
            return "750K - 999K";
        }

        return "1M+";
    }

    private double calculateMedian(List<Double> values) {

        int size = values.size();

        if (size == 0) {
            return 0;
        }

        if (size % 2 == 0) {
            return (values.get(size / 2 - 1)
                    + values.get(size / 2)) / 2.0;
        }

        return values.get(size / 2);
    }

    public List<MarketYearlyTrendResponse> getMarketYearlyTrend(MarketFilter filter) {
        // Implement market yearly trend logic here
       Specification<Property> specification =
                PropertySpecification.withFilters(filter);

        List<Property> properties =
                propertyRepository.findAll(specification);

        long totalProperties = properties.size();

        if (totalProperties == 0) {
            return List.of();
        }

        return properties.stream()
                .collect(Collectors.groupingBy(
                        this::getYearlyRange,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .map(entry -> {

                    long count = entry.getValue();

                    double percentage =
                            (count * 100.0) / totalProperties;

                    List<Property> bucketProperties = properties.stream()
                                    .filter(p -> getYearlyRange(p).equals(entry.getKey()))
                                    .toList();

                    double averagePrice = bucketProperties.stream()
                                    .mapToDouble(Property::getPrice)
                                    .average()
                                    .orElse(0.0);

                    double averagePricePerSquareFeet = bucketProperties.stream()
                                    .mapToDouble(p -> p.getPrice() / p.getArea())
                                    .average()
                                    .orElse(0.0);
                    
                    double roundedAveragePrice = Math.round(averagePrice * 100.0) / 100.0;
                    double roundedAveragePricePerSquareFeet = Math.round(averagePricePerSquareFeet * 100.0) / 100.0;

                    return new MarketYearlyTrendResponse(
                            entry.getKey(),
                            count,
                            roundedAveragePrice,
                            roundedAveragePricePerSquareFeet
                    );
                })
                .toList();
    }

    private String getYearlyRange(Property property) {

        if (property.getYearBuilt() < 1980) {
            return "Before 1980";
        }

        if (property.getYearBuilt() < 1990) {
            return "1980 - 1989";
        }

        if (property.getYearBuilt() < 2000) {
            return "1990 - 1999";
        }

        if (property.getYearBuilt() < 2010) {
            return "2000 - 2009";
        }

        if (property.getYearBuilt() < 2020) {
            return "2010 - 2019";
        }

        return "2020+";
    }
}