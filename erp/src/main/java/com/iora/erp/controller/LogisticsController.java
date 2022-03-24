package com.iora.erp.controller;

import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.SiteService;
import com.iora.erp.service.StockTransferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("logistics")
public class LogisticsController {

    @Autowired
    private StockTransferService stockTransferService;
    @Autowired
    private ProcurementService procurementService;
    @Autowired
    private SiteService siteService;

    /*
     * ---------------------------------------------------------
     * H.1 Delivery Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/stockTransfer/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getStockTransferOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.getStockTransferOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/stockTransfer/site/{siteId}", produces = "application/json")
    public ResponseEntity<Object> getStockTransferOrdersBySite(@PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(stockTransferService.getStockTransferOrderOfSite(siteService.getSite(siteId)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/stockTransfer/status/{status}", produces = "application/json")
    public ResponseEntity<Object> getStockTransferOrdersByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(stockTransferService.getStockTransferOrdersByStatus(status));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/stockTransfer/{siteId}/{status}", produces = "application/json")
    public ResponseEntity<Object> getSTOBySiteStatus(@PathVariable Long siteId, @PathVariable String status) {
        try {
            return ResponseEntity.ok(stockTransferService.getSTOBySiteStatus(siteId, status));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/procurementOrder/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getProcurementOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(procurementService.getProcurementOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/procurementOrder/site/{siteId}", produces = "application/json")
    public ResponseEntity<Object> getProcurementOrdersBySite(@PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(procurementService.getProcurementOrdersOfSite(siteService.getSite(siteId)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/procurementOrder/status/{status}", produces = "application/json")
    public ResponseEntity<Object> getProcurementOrdersByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(procurementService.getProcurementOrdersByStatus(status));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/procurementOrder/{siteId}/{status}", produces = "application/json")
    public ResponseEntity<Object> getPOBySiteStatus(@PathVariable Long siteId, @PathVariable String status) {
        try {
            return ResponseEntity.ok(procurementService.getPOBySiteStatus(siteId, status));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
