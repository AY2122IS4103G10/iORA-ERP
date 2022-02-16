package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
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

    @GetMapping(path = "/viewStock/sites", produces = "application/json")
    public List<Site> viewStockOfSites(@RequestParam List<String> storeTypes, @RequestParam String country,
            @RequestParam String company) {
        return siteService.searchStockLevels(storeTypes, country, company);
    }

    @GetMapping(path = "/viewStock/sites/{siteId}", produces = "application/json")
    public StockLevel viewStock(@PathVariable Long siteId) {
        try {
            Site site = siteService.getSite(siteId);
            return site.getStockLevel();
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewStock/product/{sku}", produces = "application/json")
    public Map<Long, Long> viewStockByProduct(@PathVariable String sku) {
        return siteService.getStockLevelByProduct(sku);
    }

    @PostMapping(path = "/editStock/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> editStock(@RequestBody List<ProductItem> toUpdate, @PathVariable Long siteId) {
        List<String> errors = new ArrayList<>();
        for (ProductItem item : toUpdate) {
            try {
                if (item.getStockLevel() == null) {
                    siteService.removeProductItemFromSite(siteId, item.getRfid());
                } else {
                    siteService.addToStockLevel(item.getStockLevel(), item);;
                }
            } catch (Exception ex) {
                errors.add(ex.getMessage());
            }
        }

        if (errors.isEmpty()) {
            return ResponseEntity.ok("Transaction successful");
        } else {
            return ResponseEntity.badRequest().body(String.join("\n", errors));
        }
    }

}
