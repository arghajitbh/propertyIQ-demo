package dev.arghajit.marketAPI.dto;

public record PageCountFilter(
    Integer pageSize,
    Integer currentPage
) {
    public PageCountFilter {
        if (currentPage == null || currentPage < 1) {
            currentPage = 1; // Default to the first page
        }
        if (pageSize == null || pageSize < 1) {
            pageSize = 10; // Default page size
        }
    }
}