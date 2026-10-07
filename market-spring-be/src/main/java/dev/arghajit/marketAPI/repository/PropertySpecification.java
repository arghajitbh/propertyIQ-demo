package dev.arghajit.marketAPI.repository;

import dev.arghajit.marketAPI.dto.MarketFilter;
import dev.arghajit.marketAPI.entity.Property;
import org.springframework.data.jpa.domain.Specification;

public final class PropertySpecification {

    private PropertySpecification() {
    }

    public static Specification<Property> withFilters(MarketFilter filter) {

        return Specification
                .where(priceGreaterThanOrEqual(filter.minPrice()))
                .and(priceLessThanOrEqual(filter.maxPrice()))
                .and(areaGreaterThanOrEqual(filter.minArea()))
                .and(areaLessThanOrEqual(filter.maxArea()))
                .and(bedroomsGreaterThanOrEqual(filter.minBedrooms()))
                .and(bedroomsLessThanOrEqual(filter.maxBedrooms()))
                .and(bathroomsGreaterThanOrEqual(filter.minBathrooms()))
                .and(bathroomsLessThanOrEqual(filter.maxBathrooms()))
                .and(yearBuiltGreaterThanOrEqual(filter.minYearBuilt()))
                .and(yearBuiltLessThanOrEqual(filter.maxYearBuilt()));
    }


    private static Specification<Property> priceGreaterThanOrEqual(
            Double minPrice) {

        return (root, query, cb) ->
                minPrice == null
                        ? null
                        : cb.greaterThanOrEqualTo(
                                root.get("price"), minPrice);
    }

    private static Specification<Property> priceLessThanOrEqual(
            Double maxPrice) {

        return (root, query, cb) ->
                maxPrice == null
                        ? null
                        : cb.lessThanOrEqualTo(
                                root.get("price"), maxPrice);
    }

    private static Specification<Property> areaGreaterThanOrEqual(
            Double minArea) {

        return (root, query, cb) ->
                minArea == null
                        ? null
                        : cb.greaterThanOrEqualTo(
                                root.get("area"), minArea);
    }

    private static Specification<Property> areaLessThanOrEqual(
            Double maxArea) {

        return (root, query, cb) ->
                maxArea == null
                        ? null
                        : cb.lessThanOrEqualTo(
                                root.get("area"), maxArea);
    }

    private static Specification<Property> bedroomsGreaterThanOrEqual(
            Integer minBedrooms) {

        return (root, query, cb) ->
                minBedrooms == null
                        ? null
                        : cb.greaterThanOrEqualTo(
                                root.get("bedrooms"), minBedrooms);
    }

    private static Specification<Property> bedroomsLessThanOrEqual(
            Integer maxBedrooms) {

        return (root, query, cb) ->
                maxBedrooms == null
                        ? null
                        : cb.lessThanOrEqualTo(
                                root.get("bedrooms"), maxBedrooms);
    }

    private static Specification<Property> bathroomsGreaterThanOrEqual(
            Integer minBathrooms) {

        return (root, query, cb) ->
                minBathrooms == null
                        ? null
                        : cb.greaterThanOrEqualTo(
                                root.get("bathrooms"), minBathrooms);
    }

    private static Specification<Property> bathroomsLessThanOrEqual(
            Integer maxBathrooms) {

        return (root, query, cb) ->
                maxBathrooms == null
                        ? null
                        : cb.lessThanOrEqualTo(
                                root.get("bathrooms"), maxBathrooms);
    }

    private static Specification<Property> yearBuiltGreaterThanOrEqual(
            Integer minYearBuilt) {

        return (root, query, cb) ->
                minYearBuilt == null
                        ? null
                        : cb.greaterThanOrEqualTo(
                                root.get("yearBuilt"), minYearBuilt);
    }

    private static Specification<Property> yearBuiltLessThanOrEqual(
            Integer maxYearBuilt) {

        return (root, query, cb) ->
                maxYearBuilt == null
                        ? null
                        : cb.lessThanOrEqualTo(
                                root.get("yearBuilt"), maxYearBuilt);
    }
}