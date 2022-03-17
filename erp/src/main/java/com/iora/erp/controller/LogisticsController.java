package com.iora.erp.controller;

import java.util.List;

import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.service.StockTransferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("logistics")
public class LogisticsController {

    @Autowired
    private StockTransferService stockTransferService;

    /*
     * ---------------------------------------------------------
     * H.1 Delivery Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/stockTransferOrders", produces = "application/json")
    public List<StockTransferOrder> getStockTransferOrdersForDelivery() {
        return stockTransferService.getStockTransferOrdersForDelivery();
    }

    @GetMapping(path = "/stockTransferOrder/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getStockTransferOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.getStockTransferOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/deliver/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverStockTransferOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.deliverStockTransferOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
