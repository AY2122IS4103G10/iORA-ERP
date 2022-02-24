package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.SiteService;
import com.iora.erp.service.StockTransferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("store")
public class StoreController {

    @Autowired
    private SiteService siteService;
    @Autowired
    private StockTransferService stockTransferService;
    @Autowired
    private CustomerOrderService customerOrderService;

    /*
     * ---------------------------------------------------------
     * F.1 Store Inventory Management
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
                    siteService.removeProductItemFromSite(item.getRfid());
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
            System.out.println("Error" + String.join("\n", errors));
            return ResponseEntity.badRequest().body(String.join("\n", errors));
        }
    }

    @GetMapping(path = "/stockTransferOrder/all", produces = "application/json")
    public List<StockTransferOrder> getStockTransferOrders() {
        return stockTransferService.getStockTransferOrders();
    }

    @GetMapping(path = "/stockTransferOrder/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getStockTransferOrderByOrderId(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.getStockTransferOrder(orderId));
        } catch (StockTransferException ex) {
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

    /*
     * ---------------------------------------------------------
     * F.3 Store Order Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/customerOrder/{siteId}", produces = "application/json")
    public List<CustomerOrder> getStoreOrders(@PathVariable Long siteId) {
        return customerOrderService.getInStoreOrdersBySite(siteId);
    }

    // YYYY-MM-dd
    @GetMapping(path = "/customerOrder/{siteId}/{date}", produces = "application/json")
    public List<CustomerOrder> getStoreOrdersByDate(@PathVariable Long siteId, @PathVariable String date) {
        return customerOrderService.getInStoreOrdersBySiteDate(siteId, date);
    }

    @GetMapping(path = "/customerOrder/view/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getCustomerOrder(Long orderId) {
        try {
            return ResponseEntity
                    .ok(customerOrderService.getCustomerOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    
}
