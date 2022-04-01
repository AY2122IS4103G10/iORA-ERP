package com.iora.erp.controller;

import java.util.List;

import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("manufacturing")
public class ManufacturingController {

    @Autowired
    private SiteService siteService;
    @Autowired
    private ProcurementService procurementService;

    /*
     * ---------------------------------------------------------
     * D.1 Inventory Management
     * ---------------------------------------------------------
     */

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

    @PutMapping(path = "/procurementOrder/accept/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> acceptProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(procurementService.acceptProcurementOrder(orderId, siteId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/cancel/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> rejectProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(procurementService.rejectProcurementOrder(orderId, siteId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/manu/{orderId}", produces = "application/json")
    public ResponseEntity<Object> manufactureProcurementOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(procurementService.manufactureProcurementOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/pickpack/{orderId}", produces = "application/json")
    public ResponseEntity<Object> pickPackProcurementOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(procurementService.pickPackProcurementOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PatchMapping(path = "/procurementOrder/scan/{orderId}", produces = "application/json")
    public ResponseEntity<Object> scanProductAtFactory(@PathVariable Long orderId, @RequestParam String barcode) {
        try {
            if (!barcode.contains("/")) {
                return ResponseEntity.ok(procurementService.scanProductAtFactory(orderId, barcode, 1));
            } else {
                return ResponseEntity
                        .ok(procurementService.scanProductAtFactory(orderId, barcode.substring(0, barcode.indexOf("/")),
                                Integer.parseInt(barcode.substring(barcode.indexOf("/") + 1))));
            }
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/{orderId}/{sku}/{qty}", produces = "application/json")
    public ResponseEntity<Object> pickpackProductAtFactory(@PathVariable Long orderId, @PathVariable String sku,
            @PathVariable int qty) {
        try {
            return ResponseEntity.ok(procurementService.pickpackAtFactory(orderId, sku, qty));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/ship/{orderId}", produces = "application/json")
    public ResponseEntity<Object> shipProcurementOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(procurementService.shipProcurementOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/shipMultiple/{orderId}", produces = "application/json")
    public ResponseEntity<Object> shipMultipleProcurementOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(procurementService.shipMultipleProcurementOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }
}