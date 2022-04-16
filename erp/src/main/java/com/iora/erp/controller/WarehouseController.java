package com.iora.erp.controller;

import java.util.List;
import java.util.Map;

import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("warehouse")
public class WarehouseController {

    @Autowired
    private SiteService siteService;
    @Autowired
    private ProcurementService procurementService;
    @Autowired
    private ProductService productService;

    /*
     * ---------------------------------------------------------
     * E.1 Inventory Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/viewStock/sites", produces = "application/json")
    public List<Site> viewStockOfSites(@RequestParam List<String> siteTypes, @RequestParam String country,
            @RequestParam String company) {
        return siteService.searchStockLevels(siteTypes, country, company);
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
    public List<Map<String, Object>> viewStockByProduct(@PathVariable String sku) {
        return siteService.getStockLevelByProduct(sku);
    }

    @PostMapping(path = "/editStock/{siteId}/{sku}/{qty}", produces = "application/json")
    public ResponseEntity<Object> editStock(@PathVariable Long siteId, @PathVariable String sku,
            @PathVariable int qty) {
        try {
            return ResponseEntity.ok(siteService.editStockLevel(siteId, sku, qty));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/procurementOrder/all", produces = "application/json")
    public List<ProcurementOrder> getProcurementsOrders() {
        return procurementService.getProcurementOrders();
    }

    @GetMapping(path = "/procurementOrder/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getProcurementOrderByOrderId(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(procurementService.getProcurementOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/procurementOrder/site/{siteId}", produces = "application/json")
    public List<ProcurementOrder> getProcurementOrdersOfSite(@PathVariable Long siteId) {
        Site site = siteService.getSite(siteId);
        return procurementService.getProcurementOrdersOfSite(site);
    }

    @PutMapping(path = "/procurementOrder/receive", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> packProcurementOrder(@RequestBody ProcurementOrder po) {
        try {
            return ResponseEntity.ok(procurementService.receiveProcurementOrder(po));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PatchMapping(path = "/procurementOrder/scan/{orderId}", produces = "application/json")
    public ResponseEntity<Object> scanProductsAtWarehouse(@PathVariable Long orderId, @RequestParam String barcode) {
        try {
            if (!barcode.contains("/")) {
                return ResponseEntity.ok(procurementService.scanProductAtWarehouse(orderId, barcode, 1));
            } else {
                return ResponseEntity
                        .ok(procurementService.scanProductAtWarehouse(orderId,
                                barcode.substring(0, barcode.indexOf("/")),
                                Integer.parseInt(barcode.substring(barcode.indexOf("/") + 1))));
            }
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/{orderId}/{sku}/{qty}", produces = "application/json")
    public ResponseEntity<Object> adjustProductAtWarehouse(@PathVariable Long orderId, @PathVariable String sku,
            @PathVariable int qty) {
        try {
            return ResponseEntity.ok(procurementService.adjustProductsAtWarehouse(orderId, sku, qty));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/complete/{orderId}", produces = "application/json")
    public ResponseEntity<Object> verifyProcurementOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(procurementService.completeProcurementOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/generateRFID", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> generateRFIDs(@RequestBody Map<String, String> body) {
        try {
            return ResponseEntity
                    .ok(productService.generateProductItems(body.get("sku"), Integer.parseInt(body.get("qty"))));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/productItems/{sku}", produces = "application/json")
    public ResponseEntity<Object> getProductItems(@PathVariable String sku) {
        try {
            return ResponseEntity
                    .ok(productService.getProductItems(sku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}