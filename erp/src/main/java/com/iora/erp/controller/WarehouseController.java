package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.SiteService;
import com.iora.erp.service.StockTransferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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
    private StockTransferService stockTransferService;

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
                    siteService.addToStockLevel(item.getStockLevel(), item);
                    ;
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

    @GetMapping(path = "/procurementOrder/all", produces = "application/json")
    public List<ProcurementOrder> getProcurementsOrders() {
        return procurementService.getProcurementOrders();
    }

    @GetMapping(path = "/procurementOrder/{orderId}", produces = "application/json")
    public ProcurementOrder getProcurementOrderByOrderId(@PathVariable Long orderId) {
        return procurementService.getProcurementOrder(orderId);
    }

    @GetMapping(path = "/procurementOrder/site/{siteId}", produces = "application/json")
    public List<ProcurementOrder> getProcurementOrdersOfSite(@PathVariable Long siteId) {
        Site site = siteService.getSite(siteId);
        return procurementService.getProcurementOrdersOfSite(site);
    }

    @PutMapping(path = "/procurementOrder/verify/{siteId}")
    public ResponseEntity<Object> verifyProcurementOrder(@RequestBody ProcurementOrder procurementOrder,
            @PathVariable Long siteId) {
        try {
            procurementService.verifyProcurementOrder(procurementOrder, siteId);
            return ResponseEntity.ok("Procurement Order with ID " + procurementOrder.getId() + " is accepted.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/stockTransferOrder/all", produces = "application/json")
    public List<StockTransferOrder> getStockTransferOrders() {
        return stockTransferService.getStockTransferOrders();
    }

    @PostMapping(path = "/stockTransferOrder/create/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> createStockTransferOrder(@RequestBody StockTransferOrder stockTransferOrder,
            @PathVariable Long siteId) {
        try {
            stockTransferService.createStockTransferOrder(stockTransferOrder, siteId);
            return ResponseEntity
                    .ok("Stock Transfer Order with ID " + stockTransferOrder.getId() + " is successfully created.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/stockTransferOrder/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getStockTransferOrderByOrderId(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.getStockTransferOrder(orderId));
        } catch (StockTransferException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransferOrder/update/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> updateStockTransferOrder(@RequestBody StockTransferOrder stockTransferOrder,
            @PathVariable Long siteId) {
        try {
            stockTransferService.updateStockTransferOrder(stockTransferOrder, siteId);
            return ResponseEntity
                    .ok("Stock Transfer Order with ID " + stockTransferOrder.getId() + " is successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/stockTransferOrder/delete/{orderId}/{siteId}")
    public ResponseEntity<Object> deleteStockTransferOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            stockTransferService.deleteStockTransferOrder(orderId, siteId);
            return ResponseEntity
                    .ok("Stock Transfer Order with ID " + orderId + " is successfully deleted (cancelled).");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransferOrder/complete/{orderId}/{siteId}")
    public ResponseEntity<Object> completeStockTransferOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            stockTransferService.completeStockTransferOrder(orderId, siteId);
            return ResponseEntity
                    .ok("Stock Transfer Order with ID " + orderId + " is successfully deleted (cancelled).");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
