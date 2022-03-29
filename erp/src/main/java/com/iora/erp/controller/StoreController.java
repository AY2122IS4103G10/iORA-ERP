package com.iora.erp.controller;

import java.util.List;
import java.util.stream.Collectors;

import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.RefundLI;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StockLevelLI;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;
import com.iora.erp.service.StockTransferService;
import com.iora.erp.service.StripeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    @Autowired
    private StripeService stripeService;

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

    @GetMapping(path = "/viewStock/sites/{siteId}/{skuCode}", produces = "application/json")
    public StockLevelLI viewStockByProductAndSite(@PathVariable Long siteId, @PathVariable String skuCode) {
        try {
            return siteService.getStockLevelLI(siteId, skuCode);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewStock/product/{sku}", produces = "application/json")
    public List<StockLevelLI> viewStockByProduct(@PathVariable String sku) {
        return siteService.getStockLevelByProduct(sku);
    }

    @PostMapping(path = "/editStock/{siteId}/{sku}/{qty}", produces = "application/json")
    public ResponseEntity<Object> editStockLevel(@PathVariable Long siteId, @PathVariable String sku,
            @PathVariable int qty) {
        try {
            return ResponseEntity.ok(siteService.editStockLevel(siteId, sku, qty));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * Stock Transfer Order
     * ---------------------------------------------------------
     */

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
                    .ok(stockTransferService.updateOrderDetails(stockTransferOrder, siteId));
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

    @PutMapping(path = "/stockTransfer/pickpack/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> pickPackStockTransferOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(stockTransferService.pickPackTransferOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping(path = "/stockTransfer/scanFrom/{orderId}", produces = "application/json")
    public ResponseEntity<Object> scanProductAtFromSite(@PathVariable Long orderId, @RequestParam String barcode) {
        try {
            if (!barcode.contains("/")) {
                return ResponseEntity.ok(stockTransferService.scanProductAtFromSite(orderId, barcode, 1));
            } else {
                return ResponseEntity.ok(
                        stockTransferService.scanProductAtFromSite(orderId, barcode.substring(0, barcode.indexOf("/")),
                                Integer.parseInt(barcode.substring(barcode.indexOf("/") + 1))));
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/deliver/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverStockTransferOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.deliverStockTransferOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/deliverMultiple/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverMultipleStockTransferOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.deliverMultipleStockTransferOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping(path = "/stockTransfer/scanTo/{orderId}", produces = "application/json")
    public ResponseEntity<Object> scanProductAtToSite(@PathVariable Long orderId, @RequestParam String barcode) {
        try {
            if (!barcode.contains("/")) {
                return ResponseEntity.ok(stockTransferService.scanProductAtToSite(orderId, barcode, 1));
            } else {
                return ResponseEntity.ok(
                        stockTransferService.scanProductAtToSite(orderId, barcode.substring(0, barcode.indexOf("/")),
                                Integer.parseInt(barcode.substring(barcode.indexOf("/") + 1))));
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/stockTransfer/complete/{orderId}", produces = "application/json")
    public ResponseEntity<Object> completeStockTransferOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(stockTransferService.completeStockTransferOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * F.3 Store Order Management / F.4 Store Order Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/customerOrder/view/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getCustomerOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity
                    .ok(customerOrderService.getCustomerOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/customerOrder", produces = "application/json")
    public List<CustomerOrder> searchCustomerOrders(@RequestParam String orderId) {
        return customerOrderService.searchCustomerOrders(0L, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @GetMapping(path = "/customerOrder/{siteId}", produces = "application/json")
    public List<CustomerOrder> searchCustomerOrdersBySite(@PathVariable Long siteId, @RequestParam String orderId) {
        return customerOrderService.searchCustomerOrders(siteId, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @GetMapping(path = "/storeOrder", produces = "application/json")
    public List<CustomerOrder> searchStoreOrders(@RequestParam String orderId) {
        return customerOrderService.searchStoreOrders(0L, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @GetMapping(path = "/storeOrder/{siteId}", produces = "application/json")
    public List<CustomerOrder> searchStoreOrdersBySite(@PathVariable Long siteId, @RequestParam String orderId) {
        return customerOrderService.searchStoreOrders(siteId, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @GetMapping(path = "/onlineOrder", produces = "application/json")
    public List<OnlineOrder> searchOnlineOrders(@RequestParam String orderId) {
        return customerOrderService.searchOnlineOrders(0L, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @GetMapping(path = "/onlineOrder/{siteId}", produces = "application/json")
    public List<OnlineOrder> searchOnlineOrdersBySite(@PathVariable Long siteId, @RequestParam String orderId) {
        return customerOrderService.searchOnlineOrders(siteId, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @GetMapping(path = "/onlineOrder/pickup/{siteId}", produces = "application/json")
    public List<OnlineOrder> getPickupOrdersOfSite(@PathVariable Long siteId) {
        return customerOrderService.getPickupOrdersBySite(siteId);
    }

    @PostMapping(path = "/customerOrder/add/{rfidsku}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addItemToLineItems(@RequestBody List<CustomerOrderLI> lineItems,
            @PathVariable String rfidsku) {
        try {
            return ResponseEntity.ok(customerOrderService.addToCustomerOrderLIs(lineItems, rfidsku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/remove/{rfidsku}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> removeItemFromLineItems(@RequestBody List<CustomerOrderLI> lineItems,
            @PathVariable String rfidsku) {
        try {
            return ResponseEntity.ok(customerOrderService.removeFromCustomerOrderLIs(lineItems, rfidsku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/calculate", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> calculatePromotions(@RequestBody List<CustomerOrderLI> lineItems) {
        try {
            return ResponseEntity.ok(customerOrderService.calculatePromotions(lineItems));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/add/{rfidsku}/calculate", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addItemToLineItemsAndCalculatePromotions(@RequestBody List<CustomerOrderLI> lineItems,
            @PathVariable String rfidsku) {
        try {
            List<CustomerOrderLI> newLineItems = customerOrderService.addToCustomerOrderLIs(lineItems, rfidsku);
            return ResponseEntity.ok(customerOrderService.calculatePromotions(newLineItems));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/connectionToken", produces = "application/json")
    public ResponseEntity<Object> createConnectionToken() {
        try {
            return ResponseEntity.ok(stripeService.createConnnectionToken());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createCustomerOrder(@RequestBody CustomerOrder customerOrder,
            @RequestParam(required = false) String clientSecret) {
        try {
            return ResponseEntity.ok(customerOrderService.createCustomerOrder(customerOrder, clientSecret));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/pay", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createPaymentIntent(@RequestParam(required = false) Long amt,
            @RequestBody List<CustomerOrderLI> lineItems) {
        try {
            return ResponseEntity.ok(stripeService.createPaymentIntent(lineItems, (amt == null) ? 0L : amt * 100));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/refund/{orderId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addRefundLineItem(@PathVariable Long orderId, @RequestBody RefundLI refundLineItem) {
        try {
            return ResponseEntity.ok(customerOrderService.createRefundLI(orderId, refundLineItem));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customerOrder/exchange/{orderId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addExchangeLineItem(@PathVariable Long orderId, @RequestBody ExchangeLI exchangeLineItem) {
        try {
            return ResponseEntity.ok(customerOrderService.createExchangeLI(orderId, exchangeLineItem));
        } catch (Exception ex) {
            ex.printStackTrace();
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

    @GetMapping(path = "/voucher/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> getVoucher(@PathVariable String voucherCode) {
        try {
            Voucher v = customerService.getVoucher(voucherCode);
            if (v.isIssued() && !v.isRedeemed()) {
                return ResponseEntity.ok(v);
            } else {
                throw new RuntimeException("Invalid voucher");
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}
