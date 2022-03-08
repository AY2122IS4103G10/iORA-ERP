package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import com.iora.erp.exception.CustomerException;
// import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.product.PromotionField;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevelLI;
// import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;
// import com.iora.erp.service.StockTransferService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    // @Autowired
    // private StockTransferService stockTransferService;

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
            return ResponseEntity.ok(productService.createProductField(productField));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/promoField", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createPromoField(@RequestBody PromotionField promotionField) {
        try {
            return ResponseEntity.ok(productService.createPromoField(promotionField));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/promoField", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updatePromoField(@RequestBody PromotionField promotionField) {
        try {
            return ResponseEntity.ok(productService.updatePromoField(promotionField));
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
            return ResponseEntity.ok(productService.createProduct(modelCode, productFields));
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
    public ResponseEntity<Object> updateProduct(@RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.updateProduct(product));
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

    /* Deprecated
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
    */

    // // Links a PromotionField to Model.
    // // A new PromotionField will be created if it does not exist.
    // @PutMapping(path = "/promo/add/{modelCode}", consumes = "application/json", produces = "application/json")
    // public ResponseEntity<Object> addPromoCategory(@PathVariable String modelCode,
    //         @RequestBody Map<String, String> body) {
    //     try {
    //         return ResponseEntity.ok(productService.addPromoCategory(modelCode, body.get("category"),
    //                 Double.parseDouble(body.get("discountedPrice"))));
    //     } catch (Exception ex) {
    //         return ResponseEntity.badRequest().body(ex.getMessage());
    //     }
    // }

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
            return ResponseEntity
                    .ok(customerService.generateVouchers(amount, qty, body.get("expDate").substring(0, 10)));
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

    @DeleteMapping(path = "/voucher/delete/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> deleteVoucher(@PathVariable String voucherCode) {
        try {
            customerService.deleteVoucher(voucherCode);
            return ResponseEntity.ok("Voucher with voucher code " + voucherCode + " has been deleted successfully.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/voucher/issue/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> issueVouchers(@PathVariable String voucherCode) {
        try {
            return ResponseEntity.ok(customerService.issueVoucher(voucherCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/voucher/redeem/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> redeemVouchers(@PathVariable String voucherCode) {
        try {
            return ResponseEntity.ok(customerService.redeemVoucher(voucherCode));
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

    @GetMapping(path = "/viewSite/{siteId}", produces = "application/json")
    public Site viewSite(@PathVariable Long siteId) {
        try {
            Site site = siteService.getSite(siteId);
            site.getStockLevel();
            return site;
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewStock/product/{sku}", produces = "application/json")
    public List<StockLevelLI> viewStockByProduct(@PathVariable String sku) {
        return siteService.getStockLevelByProduct(sku);
    }

    @GetMapping(path = "/procurementOrder/all", produces = "application/json")
    public List<ProcurementOrder> getProcurementsOrders() {
        return procurementService.getProcurementOrders();
    }

    @PostMapping(path = "/procurementOrder/create/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> createProcurementOrder(@RequestBody ProcurementOrder procurementOrder,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(procurementService.createProcurementOrder(procurementOrder, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
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

    @PutMapping(path = "/procurementOrder/update/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> updateProcurementOrder(@RequestBody ProcurementOrder procurementOrder,
            @PathVariable Long siteId) {
        try {

            return ResponseEntity
                    .ok(procurementService.updateProcurementOrder(procurementOrder, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/procurementOrder/delete/{orderId}/{siteId}")
    public ResponseEntity<Object> deleteProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(procurementService.deleteProcurementOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/procurementOrder/complete/{orderId}/{siteId}")
    public ResponseEntity<Object> completeProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(procurementService.completeProcurementOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * B.5 CRM
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/membershipTier/all", produces = "application/json")
    public List<MembershipTier> getAllMembershipTiers() {
        return customerService.listOfMembershipTier();
    }

    @GetMapping(path = "/membershipTier", produces = "application/json")
    public MembershipTier viewMembershipTier(@RequestParam String name) {
        try {
            return customerService.findMembershipTierById(name);
        } catch (Exception ex) {
            return null;
        }
    }

    @PostMapping(path = "/membershipTier/create", consumes = "application/json")
    public ResponseEntity<Object> createMembershipTier(@RequestBody MembershipTier tier) {
        try {
            return ResponseEntity.ok(customerService.createMembershipTier(tier));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/membershipTier/edit", consumes = "application/json")
    public ResponseEntity<Object> editMembershipTier(@RequestBody MembershipTier tier) {
        try {
            return ResponseEntity.ok(customerService.createMembershipTier(tier));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/membershipTier/delete/{name}")
    public ResponseEntity<Object> deleteMembershipTier(@PathVariable String name) {
        try {
            customerService.deleteMembershipTier(name);
            return ResponseEntity.ok(customerService.listOfMembershipTier());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/customer/view/all", produces = "application/json")
    public List<Customer> viewAllCustomers() {
        return customerService.listOfCustomer();
    }

    @GetMapping(path = "/customer/search/{query}", produces = "application/json")
    public List<Customer> searchCustomers(@PathVariable String query) {
        return customerService.getCustomerByFields(query);
    }

    @GetMapping(path = "/customer/view/{id}", produces = "application/json")
    public ResponseEntity<Object> getCustomerById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(customerService.getCustomerById(id));
        } catch (CustomerException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/customer/create", consumes = "application/json")
    public ResponseEntity<Object> createCustomer(@RequestBody Customer customer) {
        try {
            return ResponseEntity.ok(customerService.createCustomerAccount(customer));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/customer/block/{id}")
    public ResponseEntity<Object> blockCustomerById(@PathVariable Long id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            customerService.blockCustomer(customer);
            return ResponseEntity.ok(customer);
        } catch (CustomerException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/customer/unblock/{id}")
    public ResponseEntity<Object> unblockCustomerById(@PathVariable Long id) {
        try {
            Customer customer = customerService.getCustomerById(id);
            customerService.unblockCustomer(customer);
            return ResponseEntity.ok(customer);
        } catch (CustomerException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/customer/edit", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> completeProcurementOrder(@RequestBody Customer customer) {
        try {
            return ResponseEntity.ok(customerService.editCustomerAccount(customer));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}