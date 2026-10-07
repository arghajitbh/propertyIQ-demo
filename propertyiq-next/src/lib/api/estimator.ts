


//  interfaces

import axios from "axios";

export interface EstimatorRequest {
    // //  {
    //                 "square_footage": 2000,
    //                 "bedrooms": 3,
    //                 "bathrooms": 2,
    //                 "year_built": 1990,
    //                 "lot_size": 5000,
    //                 "distance_to_city_center": 10,
    //                 "school_rating": 8
    //             }
    square_footage?: number;
    bedrooms?: number;
    bathrooms?: number;
    year_built?: number;
    lot_size?: number;
    distance_to_city_center?: number;
    school_rating?: number;
}


interface ModelInfo {
    feature_names: string[];
    metrics: {
        mean_squared_error: number;
        r2_score: number;
    };
}

export interface HistoryEntry {
    request: EstimatorRequest;
    response: EstimatorResponse;
}

export interface EstimatorResponse {
    predicted_price: number;
    predicted_price_usd: string;
    model_info: ModelInfo;
    history?: HistoryEntry[];
}

const currentHistory: HistoryEntry[] = [];

export default class EstimatorApiClient {
    private apiClient = axios.create({
        baseURL: process.env.NEXT_ESTIMATOR_SERVICE_URL ?? "http://localhost:8000",
        timeout: 1000,
        headers: { 'Content-Type': 'application/json' }
        });
    public async estimate(request: EstimatorRequest): Promise<EstimatorResponse> {
        const response = await this.apiClient.post<EstimatorResponse>('/api/estimate', request);
        const data: EstimatorResponse = response.data;
        currentHistory.unshift({
            request,
            response: data,
        });
        return {
            predicted_price: data.predicted_price,
            predicted_price_usd: data.predicted_price_usd,
            model_info: data.model_info,
            history: currentHistory,
        };
    }

    public getHistory(): HistoryEntry[] {
        return currentHistory;
    }

}

