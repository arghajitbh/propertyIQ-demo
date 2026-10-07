package dev.arghajit.marketAPI.config;

import dev.arghajit.marketAPI.entity.Property;
import dev.arghajit.marketAPI.repository.PropertyRepository;
import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.core.io.ClassPathResource;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.io.InputStreamReader;
import java.io.Reader;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;

@Component
public class DataLoader implements ApplicationRunner {

    private final PropertyRepository propertyRepository;

    public DataLoader(PropertyRepository propertyRepository) {
        this.propertyRepository = propertyRepository;
    }

    @Override
    public void run(ApplicationArguments args) throws Exception {

        if (propertyRepository.count() > 0) {
            return;
        }

        loadProperties();
    }

    private static Reader skipBom(Reader in) throws IOException {
        java.io.PushbackReader pb = new java.io.PushbackReader(in, 1);
        int c = pb.read();
        if (c != -1 && c != '\uFEFF') {
            pb.unread(c);
        }
        return pb;
    }

    private void loadProperties() throws IOException {

        ClassPathResource resource =
                new ClassPathResource("data/House Price Dataset.csv");

        try (
            Reader reader = skipBom(new InputStreamReader(
                resource.getInputStream(),
                StandardCharsets.UTF_8
            ));

            CSVParser parser = CSVFormat.DEFAULT
                    .builder()
                    .setHeader()
                    .setSkipHeaderRecord(true)
                    .build()
                    .parse(reader);
        ) {

            List<Property> properties = new ArrayList<>();

            for (CSVRecord record : parser) {

                Property property = new Property();

                property.setId(
                    Long.parseLong(record.get("id"))
                );

                property.setArea(
                    Double.parseDouble(record.get("square_footage"))
                );

                property.setLotSize(
                    Double.parseDouble(record.get("lot_size"))
                );

                property.setDistanceToCityCenter(
                    Double.parseDouble(record.get("distance_to_city_center"))
                );

                property.setSchoolRating(
                    Double.parseDouble(record.get("school_rating"))
                );

                property.setBedrooms(
                    Integer.parseInt(record.get("bedrooms"))
                );

                property.setBathrooms(
                    Double.parseDouble(record.get("bathrooms"))
                );

                property.setYearBuilt(
                    Integer.parseInt(record.get("year_built"))
                );

                property.setPrice(
                    Double.parseDouble(record.get("price"))
                );

                properties.add(property);
            }

            propertyRepository.saveAll(properties);
        }
    }
}