package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProductService;
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
@RequestMapping("store")
public class StoreController {

    @Autowired
    private SiteService siteService;
    @Autowired
    private StockTransferService stockTransferService;
    @Autowired
    private CustomerOrderService customerOrderService;
    @Autowired
    private ProductService productService;
    @Autowired
    private CustomerService customerService;

    /*
     * ---------------------------------------------------------
     * F.1 Store Inventory Management
     * ---------------------------------------------------------
     */

    @GetMapping(value = "/storeNames", produces = "application/json")
    public ResponseEntity<Object> getStoreNames() {
        return ResponseEntity
                .ok(siteService.searchStores("", "").stream().collect(Collectors.toMap(Site::getId, Site::getName)));
    }

    @GetMapping(path = "/storeLogin", produces = "application/json")
    public ResponseEntity<Object> login(@RequestParam Long id, @RequestParam String siteCode) {
        try {
            StoreSite s = siteService.storeLogin(id, siteCode);
            if (s != null) {
                return ResponseEntity.ok(s);
            }
            return ResponseEntity.badRequest().body("No such site");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

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
    public ResponseEntity<Object> editStock(@RequestBody Map<String,Long> toUpdate, @PathVariable Long siteId) {
        List<String> errors = new ArrayList<>();
        for (Map.Entry<String,Long> entry : toUpdate.entrySet()) {
            try {
                if (entry.getValue().equals(0L)) {
                    siteService.removeProductItemFromSite(entry.getKey());;
                } else {
                    siteService.addProductItemToSite(entry.getValue(), entry.getKey());
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

    @PostMapping(path = "/editStockList/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> editStockList(@RequestBody List<ProductItem> toUpdate, @PathVariable Long siteId) {
        List<String> errors = new ArrayList<>();
        for (ProductItem item : toUpdate) {
            try {
                if (item.getStockLevel() == null) {
                    siteService.removeProductItemFromSite(item.getRfid());
                } else {
                    siteService.addToStockLevel(item.getStockLevel(), item);
                }
            } catch (Exception ex) {
                errors.add(ex.getMessage());
            }
        }

        if (errors.isEmpty()) {
            return ResponseEntity.ok(viewStock(siteId));
        } else {
            System.out.println("Error" + String.join("\n", errors));
            return ResponseEntity.badRequest().body(String.join("\n", errors));
        }
    }

    @GetMapping(path = "/stockTransfer/all", produces = "application/json")
    public List<StockTransferOrder> getStockTransferOrders() {
        return stockTransferService.getStockTransferOrders();
    }

    @GetMapping(path = "/stockTransfer/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getStockTransferOrderByOrderId(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.getStockTransferOrder(orderId));
        } catch (StockTransferException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/stockTransfer/site/{siteId}", produces = "application/json")
    public List<StockTransferOrder> getStockTransferOrdersOfSite(@PathVariable Long siteId) {
        Site site = siteService.getSite(siteId);
        return stockTransferService.getStockTransferOrderOfSite(site);
    }

    @PostMapping(path = "/stockTransfer/create/{siteId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createStockTransferOrder(@RequestBody StockTransferOrder stockTransferOrder,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.createStockTransferOrder(stockTransferOrder, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/update/{siteId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateStockTransferOrder(@RequestBody StockTransferOrder stockTransferOrder,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.updateStockTransferOrder(stockTransferOrder, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/stockTransfer/cancel/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> cancelStockTransferOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.cancelStockTransferOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/reject/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> rejectStockTransferOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.rejectStockTransferOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/confirm/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> confirmStockTransferOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.confirmStockTransferOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/ready/{siteId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> fulfilStockTransferOrder(@RequestBody StockTransferOrder stockTransferOrder,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.fulfilStockTransferOrder(stockTransferOrder, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/deliver/{siteId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> deliverStockTransferOrder(@RequestBody StockTransferOrder stockTransferOrder,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.deliverStockTransferOrder(stockTransferOrder, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/complete/{siteId}", produces = "application/json")
    public ResponseEntity<Object> completeStockTransferOrder(@RequestBody StockTransferOrder stockTransferOrder, @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.completeStockTransferOrder(stockTransferOrder, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * F.3 Store Order Management / F.4 Store Order Management
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
    public ResponseEntity<Object> getCustomerOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity
                    .ok(customerOrderService.getCustomerOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
    
    @GetMapping(path = "/productDetails/{rfid}", produces = "application/json")
    public ResponseEntity<Object> getProductDetails(@PathVariable String rfid) {
        try {
            return ResponseEntity
                    .ok(productService.getProductCartDetails(rfid).toString());
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/member/{phone}", produces = "application/json")
    public ResponseEntity<Object> getCustomerByPhone(@PathVariable String phone) {
        try {
            return ResponseEntity
                    .ok(customerService.getCustomerByPhone(phone));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
