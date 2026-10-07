package dev.arghajit.marketAPI.service;
import dev.arghajit.marketAPI.repository.PropertyRepository;
import dev.arghajit.marketAPI.entity.Property;
import dev.arghajit.marketAPI.dto.PageCountFilter;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class PropertyService {
    
    private final PropertyRepository propertyRepository;

    public PropertyService(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    public Property getPropertyById(Long id) {
        return propertyRepository.findById(id).orElse(null);
    }

    public List<Property> getAllProperties(PageCountFilter filter) {

        Integer itemsToSkip = (filter.currentPage() - 1) * filter.pageSize();
        return propertyRepository.findAll().stream()
                .skip(itemsToSkip)
                .limit(filter.pageSize())
                .toList();
    }


}
