package dev.arghajit.marketAPI.controller;
import dev.arghajit.marketAPI.service.PropertyService;
import java.util.List;
import dev.arghajit.marketAPI.entity.Property;
import dev.arghajit.marketAPI.dto.PageCountFilter;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping ("/api/v1/properties")
public class PropertyController {

    private final PropertyService propertyService;

    public PropertyController(PropertyService propertyService) {
        this.propertyService = propertyService;
    }

    
    @Cacheable(value = "properties", key = "#filter.currentPage + '-' + #filter.pageSize")
    @GetMapping
    public List<Property> getAllProperties(@ModelAttribute PageCountFilter filter) {
        return propertyService.getAllProperties(filter);
    }

    @Cacheable(value = "properties", key = "#id")
    @GetMapping("/{id}")
    public Property getPropertyById(@PathVariable String id) {
        return propertyService.getPropertyById(Long.parseLong(id));
    }


}