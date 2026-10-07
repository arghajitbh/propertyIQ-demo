package dev.arghajit.marketAPI.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import dev.arghajit.marketAPI.dto.WhatIfRequest;
import dev.arghajit.marketAPI.service.WhatIfService;
import dev.arghajit.marketAPI.dto.WhatIfResponse;

@RestController 
@RequestMapping ("/api/v1/what-if")
public class WhatIfController {

    private final WhatIfService whatIfService;

    public WhatIfController(WhatIfService whatIfService) {
        this.whatIfService = whatIfService;
    }

    @PostMapping ("/")
    public WhatIfResponse handleWhatIf(@RequestBody WhatIfRequest request) {
        return whatIfService.calculateWhatIf(request);
    }
    
}
