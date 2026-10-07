import axios from 'axios';
import { NextResponse, type NextRequest } from 'next/server';
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

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const currentProperty = searchParams.get('currentProperty');
    const scenarioProperty = searchParams.get('scenarioProperty');

    try {
        const apiClient = axios.create({
            baseURL: process.env.NEXT_MARKET_SERVICE_URL || 'http://localhost:8081',
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
        });

        const data = await apiClient.get('/what-if', {
            params: {
                currentProperty: currentProperty || '{}',
                scenarioProperty: scenarioProperty || '{}'
            }
        }).then(res => res.data);
        return new NextResponse(
            JSON.stringify(data),
            {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            }
        );
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to fetch what-if prediction', details: String(error) }), { status: 500 });
    }

}