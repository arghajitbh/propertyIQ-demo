import axios from 'axios';

// interfaces


interface PropertyResponse {


    id?: number;
    location?: string;
    propertyType?: string;
    area?: number;
    lotSize?: number;
    distanceToCityCenter?: number;
    schoolRating?: number;
    bedrooms?: number;
    bathrooms?: number;
    yearBuilt?: number;
    price?: number;
}

export interface PageCountFilter {
    pageSize: number;
    currentPage: number;
}



export default class PropertyApiClient {
    private apiClient = axios.create({
            baseURL: process.env.NEXT_MARKET_SERVICE_URL || 'http://localhost:8081',
            timeout: 1000,
            headers: { 'Content-Type': 'application/json' }
            });

    async getProperties(pageCountFilter: PageCountFilter): Promise<PropertyResponse[]> {
        console.log("Page count filter:", pageCountFilter);
        if (!pageCountFilter || !pageCountFilter.pageSize || !pageCountFilter.currentPage) {
            throw new Error("Invalid page count filter");
        }
        const response = await this.apiClient.get<PropertyResponse[]>('/api/v1/properties', { params: { ...pageCountFilter } });
        return response.data as PropertyResponse[];
    }

    async getPropertyById(id: number): Promise<PropertyResponse> {
        const response = await this.apiClient.get<PropertyResponse>(`/api/v1/properties/${id}`);
        return response.data as PropertyResponse;
    }

}