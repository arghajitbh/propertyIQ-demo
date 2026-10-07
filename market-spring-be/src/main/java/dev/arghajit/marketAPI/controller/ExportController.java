package dev.arghajit.marketAPI.controller;
import org.springframework.http.ResponseEntity;

import com.lowagie.text.Document;
import com.lowagie.text.DocumentException;
import com.lowagie.text.Paragraph;
import com.lowagie.text.pdf.PdfWriter;
import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.PrintWriter;
import java.util.List;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVPrinter;
import org.springframework.core.io.InputStreamResource;
import org.springframework.http.HttpHeaders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import dev.arghajit.marketAPI.dto.MarketFilter;
import dev.arghajit.marketAPI.dto.MarketSummaryResponse;
import dev.arghajit.marketAPI.service.MarketService;
import jakarta.servlet.http.HttpServletResponse;

@RestController
@RequestMapping ("/api/v1/market/export")
public class ExportController {

    private final MarketService marketService;
    public ExportController(MarketService marketService) {
        this.marketService = marketService;
    }

    @GetMapping ("/csv")
    public ResponseEntity<InputStreamResource> exportCsv(MarketFilter filter, HttpServletResponse response) {
        MarketSummaryResponse summary = marketService.getMarketSummary(filter);
        response.setContentType("text/csv");
        response.setHeader(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"users_export.csv\"");
        System.out.println("Exporting CSV with filter: " + filter);

        List<List<String>> dataRows = summary.toDataRows();

        // 3. Write data using Apache Commons CSV
        try{
            PrintWriter writer = response.getWriter();
            CSVPrinter csvPrinter = new CSVPrinter(writer, CSVFormat.DEFAULT.builder()
                    .setHeader("Total Properties", "Average Price", "Median Price", "Min Price", "Max Price", "Average Area", "Average Price Per Sqft")
                    .build());
            
            for (List<String> row : dataRows) {
                csvPrinter.printRecord(row);
            }
            
            csvPrinter.flush(); 
            writer.flush();
            csvPrinter.close();
            
            ByteArrayOutputStream out = new ByteArrayOutputStream();
            ByteArrayInputStream inStream = new ByteArrayInputStream(out.toByteArray());
            InputStreamResource resource = new InputStreamResource(inStream);

            HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.csv");
        headers.add(HttpHeaders.CONTENT_TYPE, "text/csv; charset=UTF-8");

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);
        } catch (Exception e) {
            e.printStackTrace();
            throw new RuntimeException("Error exporting CSV", e);
        }
    }

    @GetMapping("/pdf")
    public ResponseEntity<InputStreamResource> exportPdf(MarketFilter filter) {
        
        MarketSummaryResponse summary = marketService.getMarketSummary(filter);
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        System.out.println("Exporting PDF with filter: " + filter);
        // List<List<String>> dataRows = summary.toDataRows();
        // List<String> headers = List.of("Total Properties", "Average Price", "Median Price", "Min Price", "Max Price", "Average Area", "Average Price Per Sqft");
        String data = summary.toString();
        try {
            Document document = new Document();
            PdfWriter.getInstance(document, out);
            document.open();
            document.add(new Paragraph("Market Summary"));
            document.add(new Paragraph(data));
            document.close();
        } catch (DocumentException e) {
            e.printStackTrace();
            throw new RuntimeException("Error exporting PDF", e);
        }

        ByteArrayInputStream inStream = new ByteArrayInputStream(out.toByteArray());
        InputStreamResource resource = new InputStreamResource(inStream);

        HttpHeaders headers = new HttpHeaders();
        headers.add(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=report.pdf");
        headers.add(HttpHeaders.CONTENT_TYPE, "application/pdf; charset=UTF-8");

        return ResponseEntity.ok()
                .headers(headers)
                .body(resource);

    }
}
