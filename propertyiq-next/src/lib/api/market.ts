import axios from 'axios';

// const apiClient = axios.create({
//   baseURL: 'https://api.example.com',
//   timeout: 1000,
//   headers: { 'Content-Type': 'application/json' }
// });



// Interfaces

export interface MarketFilter {
    minPrice?: number;
    maxPrice?: number;
    minArea?: number;
    maxArea?: number;
    minBedrooms?: number;
    maxBedrooms?: number;
    minBathrooms?: number;
    maxBathrooms?: number;
    minYearBuilt?: number;
    maxYearBuilt?: number;
}

interface MarketSummaryResponse {
    totalProperties?: number;
    averagePrice?: number;
    medianPrice?: number;
    minPrice?: number;
    maxPrice?: number;
    averageArea?: number;
    averagePricePerSqft?: number;
}

interface PriceDistributionResponse {
        // String priceRange,
        // long propertyCount,
        // double percentage
    
        priceRange?: string;
        propertyCount?: number;
        percentage?: number;
}

interface MarketAreaAnalysisResponse {
        // String areaRange,
        // long propertyCount,
        // double averagePrice,
        // double averagePricePerSqft

    areaRange?: string;
    propertyCount?: number;
    averagePrice?: number;
    averagePricePerSqft?: number;
}

interface MarketYearlyTrendResponse {
    yearlyRange?: string;
    propertyCount?: number;
    averagePrice?: number;
    averagePricePerSqft?: number;
}

export default class MarketApiClient {
    private apiClient = axios.create({
        baseURL: process.env.NEXT_MARKET_SERVICE_URL || 'http://localhost:8081',
        timeout: 1000,
        headers: { 'Content-Type': 'application/json' }
        });

    public async getMarketData(filter?: MarketFilter): Promise<MarketSummaryResponse> {
        try {
            let cleanedFilter = await this.cleanedFilter(filter);
            const response = await this.apiClient.get('/api/v1/market/summary', cleanedFilter ? { params: cleanedFilter } : undefined );
            return response.data as MarketSummaryResponse;
        } catch (error) {
            console.error('Error fetching market data:', error);
            throw error;
        }
    }

    public async getPriceDistribution(filter?: MarketFilter): Promise<PriceDistributionResponse[]> {
        try {
            let cleanedFilter = await this.cleanedFilter(filter);
            const response = await this.apiClient.get('/api/v1/market/price-distribution', { params: cleanedFilter });
            return response.data as PriceDistributionResponse[];
        } catch (error) {
            console.error('Error fetching price distribution data:', error);
            throw error;
        }
    }


    public async getMarketAreaAnalysis(filter?: MarketFilter): Promise<MarketAreaAnalysisResponse[]> {
        try {
            let cleanedFilter = await this.cleanedFilter(filter);
            const response = await this.apiClient.get('/api/v1/market/area-analysis', cleanedFilter ? { params: cleanedFilter } : undefined );
            return response.data as MarketAreaAnalysisResponse[];
        } catch (error) {
            console.error('Error fetching market area analysis data:', error);
            throw error;
        }
    }

    public async getMarketYearlyTrend(filter?: MarketFilter): Promise<MarketYearlyTrendResponse[]> {
        try {
            let cleanedFilter = await this.cleanedFilter(filter);
            const response = await this.apiClient.get('/api/v1/market/yearly-trend', { params: cleanedFilter });
            return response.data as MarketYearlyTrendResponse[];
        } catch (error) {
            console.error('Error fetching market yearly trend data:', error);
            throw error;
        }
    }

    private async cleanedFilter(filter?: Record<string, any>): Promise<Record<string, any>> {
        // Implement any necessary cleaning or transformation of the filter here
        let cleaned: Record<string, any> = {};
        Object.entries(filter || {}).forEach(([key, value]) => {
            if (value !== undefined && value !== null) {
                cleaned[key] = value;
            }
        });
        return cleaned;
    }
}

// export default apiClient;

// export const getMarketData = async () => {
//   try {
//     const response = await apiClient.get('/market');
//     return response.data;
//   } catch (error) {
//     console.error('Error fetching market data:', error);
//     throw error;
//   }
// };

