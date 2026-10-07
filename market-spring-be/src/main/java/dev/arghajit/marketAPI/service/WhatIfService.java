package dev.arghajit.marketAPI.service;

import dev.arghajit.marketAPI.client.PredictionLLMClient;
import dev.arghajit.marketAPI.dto.PredictionLLMRequest;
import dev.arghajit.marketAPI.dto.PredictionLLMResponse;
import dev.arghajit.marketAPI.dto.WhatIfRequest;
import dev.arghajit.marketAPI.dto.WhatIfResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class WhatIfService {

    private final PredictionLLMClient predictionServiceClient;

    public WhatIfResponse calculateWhatIf(
            WhatIfRequest request) {

        List<PredictionLLMRequest> predictionRequests =
                List.of(
                        request.currentProperty(),
                        request.scenarioProperty()
                );

        List<PredictionLLMResponse> predictions =
                predictionServiceClient.predict(predictionRequests);

        if (predictions.size() != 2) {
            throw new IllegalStateException(
                    "Prediction service returned unexpected number of results"
            );
        }

        PredictionLLMResponse current = predictions.get(0);
        PredictionLLMResponse scenario = predictions.get(1);

        double currentPrice = current.predictedPrice();
        double scenarioPrice = scenario.predictedPrice();

        double difference =
                scenarioPrice - currentPrice;

        double percentageChange =
                currentPrice == 0
                        ? 0
                        : (difference / currentPrice) * 100;

        return new WhatIfResponse(
                current,
                scenario,
                difference,
                percentageChange
        );
    }
}