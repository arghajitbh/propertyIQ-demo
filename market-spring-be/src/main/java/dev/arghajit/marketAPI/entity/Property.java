package dev.arghajit.marketAPI.entity;
import jakarta.persistence.Table;
import lombok.Data;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Column;

@Data 
@Entity
@Table(name = "properties")
public class Property {

    @Id
    private Long id;

    private Double area;

    @Column(name = "lot_size")
    private Double lotSize;

    @Column(name = "distance_to_city_center")
    private Double distanceToCityCenter;

    @Column(name = "school_rating")
    private Double schoolRating;

    private Integer bedrooms;

    private Double bathrooms;

    @Column(name = "year_built")
    private Integer yearBuilt;

    private Double price;

    // getters/setters
}