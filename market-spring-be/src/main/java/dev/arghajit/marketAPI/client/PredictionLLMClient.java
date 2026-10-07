package dev.arghajit.marketAPI.client;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.http.MediaType;
import java.util.List;
import org.springframework.stereotype.Component;
import dev.arghajit.marketAPI.dto.PredictionLLMRequest;
import dev.arghajit.marketAPI.dto.PredictionLLMResponse;
import org.springframework.web.client.RestClient;


@Component 
public class PredictionLLMClient {
    
    private final RestClient restClient;

    public boolean isPredictionServiceHealthy() {

        try {
            restClient.get()
                    .uri("/health")
                    .retrieve()
                    .toBodilessEntity();

            return true;

        } catch (Exception e) {
            return false;
        }
    }

    public PredictionLLMClient(
            @Value("${prediction.service.url}") String predictionUrl) {

        this.restClient = RestClient.builder()
                .baseUrl(predictionUrl)
                .build();
    }

    public List<PredictionLLMResponse> predict(
            List<PredictionLLMRequest> requests) {

        return restClient.post()
                .uri("/predict")
                .contentType(MediaType.APPLICATION_JSON)
                .body(requests)
                .retrieve()
                .body(new ParameterizedTypeReference<
                        List<PredictionLLMResponse>>() {});
    }
}