import ActionTable from "@/components/client/ActionTable";
import ComparableProgressChart from "@/components/client/ComparableProgressChart";
import MarketFilterToggle from "@/components/client/MarketFilterToggle";
import MarketSummaryCard from "@/components/client/MarketSummaryCard";
import TabularView from "@/components/client/TabularView";
import TrendBarChart from "@/components/client/TrendBarChart";
import MarketApiClient, { type MarketFilter } from "@/lib/api/market";
import PropertyApiClient, { PageCountFilter } from "@/lib/api/property";
import WhatIfApiClient, { type WhatIfResponse, type WhatIfRequest } from "@/lib/api/what_if";

type SearchParams = Record<string, string | string[] | undefined>;

function firstParam(value: string | string[] | undefined): string | undefined {
    return (Array.isArray(value) ? value[0] : value) || undefined;
}

interface MarketPageProps {
    searchParams: Promise<SearchParams>;
}

interface SummaryDataItem {
    key: string;
    title: string;
    subtext: string;
    value: string | number;
}

function numParam(value: string | string[] | undefined): number | undefined {
    const n = Number(firstParam(value));
    return firstParam(value) !== undefined && Number.isFinite(n) ? n : undefined;
}

interface PropertiesPageParams {
    pageSize?: number;
    currentPage?: number;
}
interface WhatIfParams {
    whatIfIds?: number[];
}

function summaryDataEnricher(data: Record<string, any>): SummaryDataItem[] {
        console.log("Raw summary data:", data);
        let mapper = [
            { key:"totalProperties", title: "Total Properties", type: "count", subtext: "Matching current filters"},
            { key:"averagePrice", title: "Average Price", type: "currency", subtext: "Matching current filters"},
            { key:"medianPrice", title: "Median Price", type: "currency", subtext: "Middle market value"},
            { key:"minPrice", title: "Min Price", type: "currency", subtext: "Lowest market value"},
            { key:"maxPrice", title: "Max Price", type: "currency", subtext: "Highest market value"},
            { key:"averageArea", title: "Average Area", type: "count", subtext: "Matching current filters"},
            { key:"averagePricePerSqft", title: "Average Price Per Sqft", type: "currency", subtext: "Based on available area"},
        ];

        const enrichedData: SummaryDataItem[] = [];
        for (const [key, value] of Object.entries(data)) {
            let title = mapper.find(item => item.key === key)?.title || key;
            let type = mapper.find(item => item.key === key)?.type || "count";
            let subtext = mapper.find(item => item.key === key)?.subtext || "";
            let updatedValue = type === "currency" ? `$${Number(value).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : value;
            enrichedData.push({ key, title, subtext, value: updatedValue });
        }
        console.log("Enriched summary data:", enrichedData);
        return enrichedData;
    }

export default async function MarketPage(props: MarketPageProps) {
    const searchParams = await props.searchParams;

    const appliedMarketFilter: MarketFilter = {
        minPrice: numParam(searchParams.minPrice),
        maxPrice: numParam(searchParams.maxPrice),
        minArea: numParam(searchParams.minArea),
        maxArea: numParam(searchParams.maxArea),
        minBedrooms: numParam(searchParams.minBedrooms),
        maxBedrooms: numParam(searchParams.maxBedrooms),
        minBathrooms: numParam(searchParams.minBathrooms),
        maxBathrooms: numParam(searchParams.maxBathrooms),
        minYearBuilt: numParam(searchParams.minYearBuilt),
        maxYearBuilt: numParam(searchParams.maxYearBuilt),
    };

    const appliedPropertiesPageParams: PropertiesPageParams = {
        pageSize: numParam(searchParams.pageSize),
        currentPage: numParam(searchParams.currentPage),
    };
    
    const appliedWhatIfParams: WhatIfParams = {
        whatIfIds: searchParams.whatIfIds ? (Array.isArray(searchParams.whatIfIds) ? searchParams.whatIfIds.map(Number) : [Number(searchParams.whatIfIds)]) : undefined,
    };

    const mc = new MarketApiClient();
    const pc = new PropertyApiClient();
    const wc = new WhatIfApiClient();


    let summaryData:SummaryDataItem[] = [];
    let areaChartData: any[] = [];
    let priceDistributionData: any[] = [];
    let yearlyTrendData: any[] = [];
    let allMarketProperties: any[] = [];
    let whatIfData: WhatIfResponse | undefined = undefined;

    let pageCountFilter: PageCountFilter = { pageSize: appliedPropertiesPageParams.pageSize || 50, currentPage: appliedPropertiesPageParams.currentPage || 1    };

    try {
        const rawData = await mc.getMarketData(appliedMarketFilter);
        summaryData = summaryDataEnricher(rawData || {});
    } catch (error) {
        console.error("Failed to fetch summary data:", error);
    }

    try {
        areaChartData = await mc.getMarketAreaAnalysis(appliedMarketFilter) || [];
    } catch (error) {
        console.error("Failed to fetch area analysis data:", error);
    }

    try {
        priceDistributionData = await mc.getPriceDistribution(appliedMarketFilter) || [];
    } catch (error) {
        console.error("Failed to fetch price distribution data:", error);
    }

    try {
        yearlyTrendData = await mc.getMarketYearlyTrend(appliedMarketFilter) || [];
    } catch (error) {
        console.error("Failed to fetch yearly trend data:", error);
    }

    try {
        allMarketProperties = await pc.getProperties(pageCountFilter) || [];
    } catch (error) {
        console.error("Failed to fetch market properties:", error);
    }

    try {
        if(appliedWhatIfParams && appliedWhatIfParams.whatIfIds && appliedWhatIfParams.whatIfIds.length > 1) {
            const currentProperty = await pc.getPropertyById(appliedWhatIfParams.whatIfIds[0]);
            const scenarioProperty = await pc.getPropertyById(appliedWhatIfParams.whatIfIds[1]);
            whatIfData = await wc.getWhatIfPrediction({ currentProperty: currentProperty, scenarioProperty: scenarioProperty });
            delete searchParams.whatIfIds;
            
        }
    } catch (error) {
        console.error("Failed to fetch what-if data:", error);
    }

    let yearlyTrendTableDataArray = yearlyTrendData.map((item) => 
                                Object.values(item).map((value) => String(value ?? ""))
                                );
    let yearlyTrendTableColumns = yearlyTrendData[0] ? Object.keys(yearlyTrendData[0]) : [];
    let allPropertiesTableDataArray = allMarketProperties.map((item) => 
                                Object.values(item).map((value) => String(value ?? ""))
                                );
    let allPropertiesTableColumns = allMarketProperties[0] ? Object.keys(allMarketProperties[0]) : [];

    const filterQueryString = new URLSearchParams(appliedMarketFilter as any).toString();

    return (
        <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
                    <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                        <div>
                            <p className="mb-2 text-sm font-bold uppercase tracking-wider text-yellow-300">
                                Market Analysis
                            </p>
                            <h1 className="text-3xl font-extrabold tracking-tight sm:text-4xl">
                                Property market dashboard
                            </h1>
                            <p className="mt-3 text-slate-300">
                                Dummy market indicators for a selected geography
                                and property segment.
                            </p>
                        </div>
                        <div className="flex gap-2">
                            <a 
                                href={`/api/download/csv?${filterQueryString}`} 
                                download={true}
                                target="_blank"
                                className="inline-block rounded bg-yellow-300 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400"
                                aria-label="Download CSV"
                            >
                                CSV
                            </a>
                            <a 
                                href={`/api/download/pdf?${filterQueryString}`} 
                                target="_blank"
                                download={true}
                                className="inline-block rounded bg-yellow-300 px-4 py-2 text-sm font-semibold text-black hover:bg-yellow-400 ml-2"
                                aria-label="Download PDF"
                            >
                                PDF
                            </a>
                        </div>
                    </div>
                    <MarketFilterToggle activeFilters={appliedMarketFilter}/>
                    <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                        {summaryData.map(({key, title, subtext, value}) => (
                            <MarketSummaryCard 
                                key={key} 
                                title={title} 
                                value={String(value)} 
                                subtext={subtext}
                                srLabel={`Market summary for ${title} is ${value}`} />
                        ))}

                        {summaryData.length === 0 && (
                            Array(4).fill(null).map((_, index) => (
                                <MarketSummaryCard 
                                    key={index} 
                                    title="N/A" 
                                    value="N/A" 
                                    subtext="No data available"
                                    srLabel="No data available for this market summary"
                                />
                            ))
                        )}
                        
                    </div>
                    <div className="mt-8 grid gap-8 lg:grid-cols-3">
                        <TrendBarChart
                            title="Area vs Average Price Analysis"
                            legends={areaChartData.map((item) => (item.areaRange as string) || "")}
                            data={areaChartData.map((item) => item.averagePrice || 0)} 
                        srLabel="Area vs Average Price Analysis chart showing the average price for different area ranges."
                        />


                        <ComparableProgressChart
                            title="Price Distribution Analysis"
                            subtext="Comparison of price distribution across different ranges"
                            data={priceDistributionData.reduce((acc, item) => {
                                acc[item.priceRange] = item.percentage || 0;
                                return acc;
                            }, {} as Record<string, number>)}
                            srLabel="Price Distribution Analysis chart showing the percentage of properties in different price ranges."
                        />
                    </div>
                    <TabularView
                        title="Market Yearly Trend"
                        data={yearlyTrendTableDataArray}
                        columns={yearlyTrendTableColumns}
                        srLabel="Market Yearly Trend table showing the yearly range, property count, average price, and average price per sqft."
                    />
                    <ActionTable
                        title="All Properties"
                        data={allPropertiesTableDataArray}
                        columns={allPropertiesTableColumns}
                        onSubmitUrl="/market" 
                        pagination={true}
                        search={true}
                        searchColumn="yearBuilt"
                        maxSelectable={2}
                        actionColumn="What-If"
                        srLabel="Table showing all properties with their respective details."
                    />

                    {whatIfData && (
                        <div className="mt-8 border-2 border-slate-600 p-4 rounded-xl bg-gray-800">
                            <h2 className="text-xl font-bold">Applied What-If Scenarios</h2>
                            <div className="mt-4 space-y-2 text-yellow-300">
                                <p>Current Prediction: {whatIfData.currentPrediction?.predictedPriceUsd || 'N/A'}</p>
                                <p>Scenario Prediction: {whatIfData.scenarioPrediction?.predictedPriceUsd || 'N/A'}</p>
                                <p>Price Difference: {whatIfData.priceDifference || 'N/A'}</p>
                                <p>Percentage Change: {whatIfData.percentageChange || 'N/A'}</p>
                            </div>
                        </div>
                    )}
                </section>
    );
}
