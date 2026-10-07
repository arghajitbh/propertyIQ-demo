package dev.arghajit.marketAPI.controller;
import org.springframework.cache.annotation.Cacheable;

import dev.arghajit.marketAPI.dto.MarketAreaAnalysisResponse;
import dev.arghajit.marketAPI.dto.PriceDistributionResponse;
import dev.arghajit.marketAPI.dto.MarketYearlyTrendResponse;
import java.util.List;
import dev.arghajit.marketAPI.dto.MarketFilter;
import dev.arghajit.marketAPI.dto.MarketSummaryResponse;
import dev.arghajit.marketAPI.service.MarketService;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.ModelAttribute;


@RestController
@RequestMapping("/api/v1/market")
public class MarketController {

    private final MarketService marketService;
    public MarketController(MarketService marketService) {
        this.marketService = marketService;
    }
    @Cacheable(value = "marketSummary", key = "#filter")
    @GetMapping("/summary")
    public MarketSummaryResponse getMarketSummary(@ModelAttribute MarketFilter filter) {
        System.out.println("Market Summary Filter: " + filter);
        // Implement market summary logic here
        return marketService.getMarketSummary(filter); 
    }

    @Cacheable(value = "marketAreaAnalysis", key = "#filter")
    @GetMapping ("/area-analysis")
    public List<MarketAreaAnalysisResponse> getMarketAreaAnalysis(@ModelAttribute MarketFilter filter) {
        // Implement market area analysis logic here
        System.out.println("Market Area Analysis Filter: " + filter);
        return marketService.getMarketAreaAnalysis(filter);
    }

    @Cacheable(value = "marketPriceDistribution", key = "#filter")
    @GetMapping ("/price-distribution")
    public List<PriceDistributionResponse> getMarketPriceDistribution(@ModelAttribute MarketFilter filter) {
        // Implement market price distribution logic here
        return marketService.getMarketPriceDistribution(filter);
    }

    @Cacheable(value = "marketYearlyTrend", key = "#filter")
    @GetMapping ("/yearly-trend")
    public List<MarketYearlyTrendResponse> getMarketYearlyTrend(@ModelAttribute MarketFilter filter) {
        // Implement market yearly trend logic here
        return marketService.getMarketYearlyTrend(filter);
    }
}