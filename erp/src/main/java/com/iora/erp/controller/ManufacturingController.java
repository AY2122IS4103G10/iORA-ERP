package com.iora.erp.controller;

import java.util.List;

import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
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
    public ProcurementOrder getProcurementOrderByOrderId(@PathVariable Long orderId) {
        return procurementService.getProcurementOrder(orderId);
    }

    @GetMapping(path = "/procurementOrder/site/{siteId}", produces = "application/json")
    public List<ProcurementOrder> getProcurementOrdersOfSite(@PathVariable Long siteId) {
        Site site = siteService.getSite(siteId);
        return procurementService.getProcurementOrdersOfSite(site);
    }

    @PutMapping(path = "/procurementOrder/accept/{orderId}/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> acceptProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            procurementService.confirmProcurementOrder(orderId, siteId);
            return ResponseEntity.ok("Procurement Order with ID " + orderId + " is accepted.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/cancel/{orderId}/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> cancelProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            procurementService.rejectProcurementOrder(orderId, siteId);
            return ResponseEntity.ok("Procurement Order with ID " + orderId + " is rejected.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Fulfil
}