import { MarketFilter } from "@/lib/api/market";
import axios from "axios";
import { NextRequest, NextResponse } from "next/server";


export async function GET(request: NextRequest): Promise<NextResponse> {

  
    
    const { searchParams } = new URL(request.url);
        const cleanParams = new URLSearchParams();
    searchParams.forEach((value, key) => {
        if (value === 'undefined' || value === 'null') {
            cleanParams.set(key, '');
        } else {
            cleanParams.set(key, value);
        }
    });

    const minPrice = cleanParams.get('minPrice') || '';
    const maxPrice = cleanParams.get('maxPrice') || '';
    const minArea = cleanParams.get('minArea') || '';
    const maxArea = cleanParams.get('maxArea') || '';
    const minBedrooms = cleanParams.get('minBedrooms') || '';
    const maxBedrooms = cleanParams.get('maxBedrooms') || '';
    const minBathrooms = cleanParams.get('minBathrooms') || '';
    const maxBathrooms = cleanParams.get('maxBathrooms') || '';
    const minYearBuilt = cleanParams.get('minYearBuilt') || '';
    const maxYearBuilt = cleanParams.get('maxYearBuilt') || '';

    try {
        const apiClient = axios.create({
            baseURL: process.env.NEXT_MARKET_SERVICE_URL || 'http://localhost:8081',
            timeout: 5000,
            headers: { 'Content-Type': 'application/json' }
        });
        
        const filter = {
            minPrice,
            maxPrice,
            minArea,
            maxArea,
            minBedrooms,
            maxBedrooms,
            minBathrooms,
            maxBathrooms,
            minYearBuilt,
            maxYearBuilt
        };
        const response = await apiClient.get('/api/v1/market/export/pdf', { params: filter });
        return new NextResponse(response.data, {
          status: 200,
          headers: {
            'Content-Type': 'application/pdf',
            'Content-Disposition': 'attachment; filename="market-report.pdf"',
          },
        });
    } catch (error) {
        return new NextResponse(JSON.stringify({ error: 'Failed to download PDF', details: String(error) }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}