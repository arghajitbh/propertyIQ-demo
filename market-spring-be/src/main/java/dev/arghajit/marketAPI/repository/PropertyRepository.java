package dev.arghajit.marketAPI.repository;
import dev.arghajit.marketAPI.entity.Property;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.domain.Specification;

import java.util.List;
import java.util.Optional;

public interface PropertyRepository extends JpaRepository<Property, Long> {

    List<Property> findByPriceBetween(Double minPrice, Double maxPrice);

    List<Property> findByBedrooms(Integer bedrooms);

    List<Property> findByBathrooms(Double bathrooms);

    List<Property> findByYearBuilt(Integer yearBuilt);

    Optional<Property> findById(Long id);

    List<Property> findAll(Specification<Property> specification);

}