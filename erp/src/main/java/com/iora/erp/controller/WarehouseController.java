package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StockLevelLI;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;
// import com.iora.erp.service.StockTransferService;

import org.springframework.beans.factory.annotation.Autowired;
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
    private ProductService productService;
    @Autowired
    private ProcurementService procurementService;
    @Autowired
    private CustomerOrderService customerOrderService;

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
    public List<StockLevelLI> viewStockByProduct(@PathVariable String sku) {
        return siteService.getStockLevelByProduct(sku);
    }

    @PostMapping(path = "/editStock/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> editStock(@RequestBody List<Map<String, Long>> toUpdate, @PathVariable Long siteId) {
        List<String> errors = new ArrayList<>();

        for (Map.Entry<String, Long> entry : toUpdate.get(0).entrySet()) {
            try {
                Product p = productService.getProduct(entry.getKey());
                if (entry.getValue() < 0) {
                    siteService.removeProducts(entry.getValue(), p.getSku(), entry.getValue().intValue());
                } else {
                    siteService.addProducts(entry.getValue(), p.getSku(), entry.getValue().intValue());
                }
            } catch (Exception ex) {
                errors.add(ex.getMessage());
            }
        }

        for (Map.Entry<String, Long> entry : toUpdate.get(1).entrySet()) {
            try {
                if (entry.getValue().equals(0L)) {
                    siteService.removeProductsWithRfid(entry.getValue(), List.of(entry.getKey()));
                } else {
                    siteService.addProductsWithRfid(entry.getValue(), List.of(entry.getKey()));
                }
            } catch (Exception ex) {
                errors.add(ex.getMessage());
            }
        }

        if (errors.isEmpty()) {
            return ResponseEntity.ok(viewStock(siteId));
        } else {
            System.err.println(errors);
            return ResponseEntity.badRequest().body(String.join("\n", errors));
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
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/procurementOrder/site/{siteId}", produces = "application/json")
    public List<ProcurementOrder> getProcurementOrdersOfSite(@PathVariable Long siteId) {
        Site site = siteService.getSite(siteId);
        return procurementService.getProcurementOrdersOfSite(site);
    }

    @PutMapping(path = "/procurementOrder/receive/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> receiveProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(procurementService.receiveProcurementOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
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
            return ResponseEntity.badRequest().body(ex.getMessage());
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

    @PostMapping(path = "/customerOrder", produces = "application/json")
    public ResponseEntity<Object> createCustomerOrder(@RequestBody CustomerOrder customerOrder) {
        try {
            return ResponseEntity.ok(customerOrderService.createCustomerOrder(customerOrder));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping(path = "/scan/{orderId}", produces = "application/json")
    public ResponseEntity<Object> scanProduct(@PathVariable Long orderId, @RequestParam String barcode) {
        try {
            if (!barcode.contains("/")) {
                return ResponseEntity.ok(customerOrderService.scanProduct(orderId, barcode, 1));
            } else {
                return ResponseEntity
                        .ok(customerOrderService.scanProduct(orderId, barcode.substring(0, barcode.indexOf("/")),
                                Integer.parseInt(barcode.substring(barcode.indexOf("/") + 1))));
            }

        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}