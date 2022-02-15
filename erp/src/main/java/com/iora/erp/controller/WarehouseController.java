package com.iora.erp.controller;

import java.util.List;

import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("warehouse")
public class WarehouseController {

    @Autowired
    private SiteService siteService;

    /*
     * ---------------------------------------------------------
     * E.1 Inventory Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/viewStockOfSites", produces = "application/json")
    public List<Site> viewStockOfSites(@RequestParam List<String> storeTypes, @RequestParam String country,
            @RequestParam String company) {
        return siteService.searchStockLevels(storeTypes, country, company);
    }

    @GetMapping(path = "/viewStock/{siteId}", produces = "application/json")
    public StockLevel viewStocke(@PathVariable Long siteId) {
        try {
            Site site = siteService.getSite(siteId);
            return site.getStockLevel();
        } catch (Exception e) {
            return null;
        }
    }

}
