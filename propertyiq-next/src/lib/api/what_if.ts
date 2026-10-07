import axios from 'axios';

// interfaces

interface PredictionLLMResponse {

    predictedPrice?: number;
    predictedPriceUsd?: string;
}

export interface WhatIfResponse {
    
    currentPrediction?: PredictionLLMResponse;
    scenarioPrediction?: PredictionLLMResponse;
    priceDifference?: number;
    percentageChange?: number;
}

export interface WhatIfRequest {

    currentProperty?: PredictionLLMRequest;
    scenarioProperty?: PredictionLLMRequest;
}

interface PredictionLLMRequest {

    squareFootage?: number;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    lotSize?: number;
    distanceToCityCenter?: number;
    schoolRating?: number;
}

export default class WhatIfApiClient {
    private apiClient = axios.create({
            baseURL: process.env.NEXT_MARKET_SERVICE_URL || 'http://localhost:8081',
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' }
            });


    async getWhatIfPrediction(request: WhatIfRequest): Promise<WhatIfResponse> {
        const response = await this.apiClient.post<WhatIfResponse>('/what-if', request);
        return response.data as WhatIfResponse;
    }
}