package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.product.PromotionField;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("sam")
public class SAMController {

    @Autowired
    private ProductService productService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private SiteService siteService;
    @Autowired
    private ProcurementService procurementService;

    /*
     * ---------------------------------------------------------
     * B.1 Product Management
     * ---------------------------------------------------------
     */

    // Returns list of values by supplying fieldName
    @GetMapping(path = "/productField/{fieldName}", produces = "application/json")
    public ResponseEntity<Object> getProductFieldValues(@PathVariable String fieldName) {
        try {
            return ResponseEntity.ok(productService.getProductFieldValues(fieldName));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Returns list of all PromotionFields
    @GetMapping(path = "/promotionFields", produces = "application/json")
    public List<PromotionField> getPromotionFields() {
        return productService.getPromotionFields();
    }

    // Get Models by supplying PromotionField
    @GetMapping(path = "/model/promo", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> getModelsByPromoField(@RequestBody PromotionField promoField) {
        try {
            return ResponseEntity.ok(productService.getModelsByPromoField(promoField));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Creates new ProductField instance with given JSON body
    @PostMapping(path = "/productField", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createProductField(@RequestBody ProductField productField) {
        try {
            productService.createProductField(productField);
            return ResponseEntity.ok("Product field " + productField.getFieldName() + " : " +  productField.getFieldValue() + " is successfully created");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Retrieves all ProductField instances
    @GetMapping(path = "/productField", produces = "application/json")
    public List<ProductField> getAllProductFields() {
        return productService.getAllProductFields();
    }

    // Creates a new Model instance by supplying Model details in JSON body
    @PostMapping(path = "/model", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createModel(@RequestBody Model model) {
        try {
            return ResponseEntity.ok(productService.createModel(model));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Creates multiple Product instances with given Model Code in URL,
    @PostMapping(path = "/product/{modelCode}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createProduct(@PathVariable String modelCode,
            @RequestBody List<ProductField> productFields) {
        try {
            productService.createProduct(modelCode, productFields);
            return ResponseEntity.ok("Multiple Products are successfully created and linked to Model " + modelCode);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getModel(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model", produces = "application/json")
    public List<Model> searchModelsByModelCode(@RequestParam String modelCode) {
        return productService.searchModelsByModelCode(modelCode);
    }

    @GetMapping(path = "/model/name", produces = "application/json")
    public List<Model> searchModelsByName(@RequestParam String name) {
        return productService.searchModelsByName(name);
    }

    @GetMapping(path = "/model/{fieldName}/{fieldValue}", produces = "application/json")
    public ResponseEntity<Object> getModelsByFieldValue(@PathVariable String fieldName,
            @PathVariable String fieldValue) {
        try {
            return ResponseEntity.ok(productService.getModelsByFieldValue(fieldName, fieldValue));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Get models by fashion line (iORA) and tag (top)
    // Return empty list if no results
    @GetMapping(path = "/model/tag/{company}/{tag}", produces = "application/json")
    public ResponseEntity<Object> getModelsByCompanyAndTag(@PathVariable String company, @PathVariable String tag) {
        try {
            return ResponseEntity.ok(productService.getModelsByCompanyAndTag(company, tag));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Get models by tag (top)
    // Return empty list if no results
    @GetMapping(path = "/model/tag/{tag}", produces = "application/json")
    public ResponseEntity<Object> getModelsByTag(@PathVariable String tag) {
        try {
            return ResponseEntity.ok(productService.getModelsByTag(tag));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Get models by category (2 FOR S$49 / IORA NEW ARRIVALS)
    // Return empty list if no results
    @GetMapping(path = "/model/category/{category}", produces = "application/json")
    public ResponseEntity<Object> getModelsByCategory(@PathVariable String category) {
        try {
            return ResponseEntity.ok(productService.getModelsByCategory(category));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/model", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateModel(@RequestBody Model model) {
        try {
            return ResponseEntity.ok(productService.updateModel(model));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/product/{sku}", produces = "application/json")
    public ResponseEntity<Object> getProduct(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.getProduct(sku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/product", produces = "application/json")
    public List<Product> searchProductsBySKU(@RequestParam String sku) {
        return productService.searchProductsBySKU(sku);
    }

    @GetMapping(path = "/product/modelCode/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getProductsByModel(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getProductsByModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/product/{fieldName}/{fieldValue}", produces = "application/json")
    public ResponseEntity<Object> getProductsByFieldValue(@PathVariable String fieldValue,
            @PathVariable String fieldName) {
        try {
            return ResponseEntity.ok(productService.getProductsByFieldValue(fieldName, fieldValue));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/product", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateProduct(@PathVariable Product product) {
        try {
            productService.updateProduct(product);
            return ResponseEntity.ok("Product with SKU code " + product.getsku() + " is successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/productItem/{sku}/{rfid}", produces = "application/json")
    public ResponseEntity<Object> createProductItem(@PathVariable String sku, @PathVariable String rfid) {
        try {
            productService.createProductItem(rfid, sku);
            return ResponseEntity
                    .ok("ProductItem with RFID " + rfid + " is successfully created and linked to product " + sku);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/productItem/{rfid}", produces = "application/json")
    public ResponseEntity<Object> getProductItem(@PathVariable String rfid) {
        try {
            return ResponseEntity.ok(productService.getProductItem(rfid));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/productItem/sku/{sku}", produces = "application/json")
    public ResponseEntity<Object> getProductItemByProduct(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.getProductItemsBySKU(sku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/productItem", produces = "application/json")
    public List<ProductItem> searchProductItems(@RequestParam String rfid) {
        return productService.searchProductItems(rfid);
    }

    @PutMapping(path = "/productItem/sell/{rfid}", produces = "application/json")
    public ResponseEntity<Object> sellProductItem(@PathVariable String rfid) {
        try {
            productService.sellProductItem(rfid);
            return ResponseEntity.ok("Product Item with RFID " + rfid.trim() + " is successfully marked as sold.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/productItem/return/{rfid}", produces = "application/json")
    public ResponseEntity<Object> returnProductItem(@PathVariable String rfid) {
        try {
            productService.returnProductItem(rfid);
            return ResponseEntity.ok("Product Item with RFID " + rfid.trim() + " is successfully marked as unsold.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/promo/add/{modelCode}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addPromoCategory(@PathVariable String modelCode,
            @RequestBody Map<String, String> body) {
        try {
            productService.addPromoCategory(modelCode, body.get("category"),
                    Double.parseDouble(body.get("discountedPrice")));
            return ResponseEntity
                    .ok("Promotion " + body.get("category") + " is successfully added to the Model " + modelCode);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/voucher/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> getVoucher(@PathVariable String voucherCode) {
        try {
            return ResponseEntity.ok(customerService.getVoucher(voucherCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/voucher", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> generateVouchers(@RequestBody Map<String, String> body) {
        try {
            double amount = Double.parseDouble(body.get("amount"));
            int qty = Integer.parseInt(body.get("quantity"));
            customerService.generateVouchers(amount, qty, body.get("expDate").substring(0, 10));
            return ResponseEntity.ok(qty + " quantity of S$" + amount + " vouchers have been successfully created.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/voucher", produces = "application/json")
    public List<Voucher> getAllVouchers() {
        return customerService.getAllVouchers();
    }

    @GetMapping(path = "/voucher/amount/{amount}", produces = "application/json")
    public List<Voucher> getAvailableVouchersByAmount(@PathVariable double amount) {
        return customerService.getAvailableVouchersByAmount(amount);
    }

    @PutMapping(path = "/voucher/issue/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> issueVouchers(@PathVariable String voucherCode) {
        try {
            customerService.issueVoucher(voucherCode);
            return ResponseEntity.ok("Voucher " + voucherCode + " has been marked as issued.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/voucher/redeem/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> redeemVouchers(@PathVariable String voucherCode) {
        try {
            customerService.redeemVoucher(voucherCode);
            return ResponseEntity.ok("Voucher " + voucherCode + " has been marked as redeemed.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * B.2 Inventory Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/viewSites/all", produces = "application/json")
    public List<? extends Site> viewAllSites() {
        return siteService.getAllSites();
    }

    @GetMapping(path = "/viewSites", produces = "application/json")
    public List<? extends Site> viewSites(@RequestParam List<String> siteTypes, @RequestParam String country,
            @RequestParam String company) {
        return siteService.searchAllSites(siteTypes, country, company);
    }

    @GetMapping(path = "/viewSites/{siteType}", produces = "application/json")
    public List<? extends Site> viewSitesBySubclass(@PathVariable String siteType, @RequestParam String country,
            @RequestParam String company) {
        switch (siteType) {
            case "Headquarters":
                return siteService.searchHeadquarters(country, company);
            case "Manufacturing":
                return siteService.searchManufacturing(country, company);
            case "OnlineStore":
                return siteService.searchOnlineStores(country, company);
            case "Store":
                return siteService.searchStores(country, company);
            case "Warehouse":
                return siteService.searchWarehouses(country, company);
            default:
                return new ArrayList<>();
        }
    }

    @GetMapping(path = "/viewStock/product/{sku}", produces = "application/json")
    public Map<Long, Long> viewStockByProduct(@PathVariable String sku) {
        return siteService.getStockLevelByProduct(sku);
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
}