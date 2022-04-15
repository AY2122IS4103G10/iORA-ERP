package com.iora.erp.controller;

import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletResponse;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.SupportTicket;
import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrderLI;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.PromotionField;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;
import com.iora.erp.service.StockTransferService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import net.sf.jasperreports.engine.JREmptyDataSource;
import net.sf.jasperreports.engine.JasperCompileManager;
import net.sf.jasperreports.engine.JasperFillManager;
import net.sf.jasperreports.engine.JasperPrint;
import net.sf.jasperreports.engine.JasperReport;
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource;
import net.sf.jasperreports.engine.export.JRCsvExporter;
import net.sf.jasperreports.export.SimpleExporterInput;
import net.sf.jasperreports.export.SimpleWriterExporterOutput;

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
    @Autowired
    private CustomerOrderService customerOrderService;
    @Autowired
    private StockTransferService stockTransferService;

    /*
     * ---------------------------------------------------------
     * B.1 Product Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/productField/{fieldName}", produces = "application/json")
    public ResponseEntity<Object> getProductFieldValues(@PathVariable String fieldName) {
        try {
            return ResponseEntity.ok(productService.getProductFieldValues(fieldName));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/promotionFields", produces = "application/json")
    public List<PromotionField> getPromotionFields() {
        return productService.getPromotionFields();
    }

    @GetMapping(path = "/model/promo", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> getModelsByPromoField(@RequestBody PromotionField promoField) {
        try {
            return ResponseEntity.ok(productService.getModelsByPromoField(promoField));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

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

    @GetMapping(path = "/productField", produces = "application/json")
    public List<ProductField> getAllProductFields() {
        return productService.getAllProductFields();
    }

    @PostMapping(path = "/model", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createModel(@RequestBody Model model) {
        try {
            return ResponseEntity.ok(productService.createModel(model));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
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

    @GetMapping(path = "/model/tag/{company}/{tag}", produces = "application/json")
    public ResponseEntity<Object> getModelsByCompanyAndTag(@PathVariable String company, @PathVariable String tag) {
        try {
            return ResponseEntity.ok(productService.getModelsByCompanyAndTag(company, tag));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model/tag/{tag}", produces = "application/json")
    public ResponseEntity<Object> getModelsByTag(@PathVariable String tag) {
        try {
            return ResponseEntity.ok(productService.getModelsByTag(tag));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model/category/{category}", produces = "application/json")
    public ResponseEntity<Object> getModelsByCategory(@PathVariable String category) {
        try {
            return ResponseEntity.ok(productService.getModelsByCategory(category));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model/name/{sku}", produces = "application/json")
    public ResponseEntity<Object> getModelsNameBySKU(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.getModelByProduct(productService.getProduct(sku)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/model", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateModel(@RequestBody Model model) {
        try {
            return ResponseEntity.ok(productService.updateModel(model));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
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

    @PostMapping(path = "/products", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> getProducts(@RequestBody List<String> rfidskus) {
        try {
            return ResponseEntity.ok(productService.getProducts(rfidskus));
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

    @PostMapping(path = "/product", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createProduct(@RequestBody Product product) {
        try {
            return ResponseEntity.ok(productService.createProduct(product));
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

    @DeleteMapping(path = "/product/delete/{sku}", produces = "application/json")
    public ResponseEntity<Object> deleteProduct(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.deleteProduct(sku));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/product/baseline/{sku}/{qty}", produces = "application/json")
    public ResponseEntity<Object> updateBaselineQty(@PathVariable String sku, @PathVariable int qty) {
        try {
            Product product = productService.getProduct(sku);
            product.setBaselineQty(qty);
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

    @GetMapping(path = "/voucher/{voucherCode}", produces = "application/json")
    public ResponseEntity<Object> getVoucher(@PathVariable String voucherCode) {
        try {
            return ResponseEntity.ok(customerService.getVoucher(voucherCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @SuppressWarnings("unchecked")
    @PostMapping(path = "/voucher", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> generateVouchers(@RequestBody Map<String, Object> body, @RequestParam int qty) {
        try {
            return ResponseEntity
                    .ok(customerService.generateVouchers((String) body.get("campaign"),
                            Double.parseDouble((String) body.get("amount")), new Date((Long) body.get("expiry")),
                            (List<Integer>) body.get("customerIds"), qty));
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
    public ResponseEntity<Object> issueVouchers(@PathVariable String voucherCode, @RequestBody List<Long> customerIds) {
        try {
            return ResponseEntity.ok(customerService.issueVouchers(voucherCode, customerIds));
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
    public List<Map<String, Object>> viewStockByProduct(@PathVariable String sku) {
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
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
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

    @PutMapping(path = "/procurementOrder/update/{siteId}", consumes = "application/json")
    public ResponseEntity<Object> updateProcurementOrder(@RequestBody ProcurementOrder procurementOrder,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(procurementService.updateProcurementOrderDetails(procurementOrder, siteId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/procurementOrder/delete/{orderId}/{siteId}")
    public ResponseEntity<Object> deleteProcurementOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(procurementService.deleteProcurementOrder(orderId, siteId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * B.3 Report and Analytics
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/dashboard/customerOrders", produces = "application/json")
    public ResponseEntity<Object> getCustomerOrdersInDateRange(
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date end) {
        try {
            return ResponseEntity.ok(customerOrderService.getCustomerOrdersInDateRange(start, end));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/dashboard/storeOrders", produces = "application/json")
    public ResponseEntity<Object> getStoreOrdersInDateRange(
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date end) {
        try {
            return ResponseEntity.ok(customerOrderService.getStoreOrdersInDateRange(start, end));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/dashboard/onlineOrders", produces = "application/json")
    public ResponseEntity<Object> getOnlineOrdersInDateRange(
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date end) {
        try {
            return ResponseEntity.ok(customerOrderService.getOnlineOrdersInDateRange(start, end));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/dashboard/customerOrders/{siteId}", produces = "application/json")
    public ResponseEntity<Object> getDailyCustomerOrders(
            @RequestParam(required = false) @DateTimeFormat(pattern = "ddMMyyyy") Date date,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(customerOrderService.getDailyCustomerOrders(siteId, date == null ? new Date() : date));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/dashboard/procurementOrders/{siteId}", produces = "application/json")
    public ResponseEntity<Object> getDailyProcurementOrders(
            @RequestParam(required = false) @DateTimeFormat(pattern = "ddMMyyyy") Date date,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(procurementService.getDailyProcurementOrders(siteId, date == null ? new Date() : date));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/dashboard/stockTransferOrders/{siteId}", produces = "application/json")
    public ResponseEntity<Object> getDailyStockTransferOrders(
            @RequestParam(required = false) @DateTimeFormat(pattern = "ddMMyyyy") Date date,
            @PathVariable Long siteId) {
        try {
            return ResponseEntity
                    .ok(stockTransferService.getDailyStockTransferOrders(siteId, date == null ? new Date() : date));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/dashboard/vouchers", produces = "application/json")
    public ResponseEntity<Object> getVouchersPerformance() {
        try {
            return ResponseEntity.ok(customerService.getVouchersPerformance());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/reports/dailySales")
    public void generateSalesReport(
            HttpServletResponse response,
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date end) {
        try {
            List<CustomerOrder> orders = customerOrderService.getAllCustomerOrderInRange(start, end);
            System.out.println(orders);

            JRBeanCollectionDataSource beanCollectionDataSource = new JRBeanCollectionDataSource(orders);
            HashMap<String, Object> map = new HashMap<>();
            map.put("DS1", beanCollectionDataSource);
            JasperReport compileReport = JasperCompileManager
                    .compileReport(new FileInputStream("src/main/resources/templates/DailySales.jrxml"));
            JasperPrint finalReport = JasperFillManager.fillReport(compileReport, map, new JREmptyDataSource());
            JRCsvExporter exporter = new JRCsvExporter();
            exporter.setExporterInput(new SimpleExporterInput(finalReport));
            exporter.setExporterOutput(new SimpleWriterExporterOutput(response.getOutputStream()));

            response.setHeader(
                    HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=SalesReport.csv;");
            response.setContentType("text/csv");
            exporter.exportReport();

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }


    @GetMapping(path = "/reports/po")
    public void generateProcurementReport(
            HttpServletResponse response,
            @RequestParam Long siteId, 
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date end) {
        try {
            List<ProcurementOrder> orders = procurementService.getProcurementOrdersInRange(siteId, start, end);
            System.out.println(orders);

            JRBeanCollectionDataSource beanCollectionDataSource = new JRBeanCollectionDataSource(orders);
            HashMap<String, Object> map = new HashMap<>();
            map.put("DS1", beanCollectionDataSource);
            JasperReport compileReport = JasperCompileManager
                    .compileReport(new FileInputStream("src/main/resources/templates/PO.jrxml"));
            JasperPrint finalReport = JasperFillManager.fillReport(compileReport, map, new JREmptyDataSource());
            JRCsvExporter exporter = new JRCsvExporter();
            exporter.setExporterInput(new SimpleExporterInput(finalReport));
            exporter.setExporterOutput(new SimpleWriterExporterOutput(response.getOutputStream()));

            response.setHeader(
                    HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=ProcurementReport.csv;");
            response.setContentType("text/csv");
            exporter.exportReport();

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    @GetMapping(path = "/reports/poli")
    public void generateSimpleProcurementReport(
            HttpServletResponse response,
            @RequestParam Long siteId, 
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date start,
            @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date end) {
        try {
            List<ProcurementOrderLI> lineItems = procurementService.getProcurementLineItemsInRange(siteId, start, end);
            System.out.println(lineItems);

            JRBeanCollectionDataSource beanCollectionDataSource = new JRBeanCollectionDataSource(lineItems);
            HashMap<String, Object> map = new HashMap<>();
            map.put("DS1", beanCollectionDataSource);

            JasperReport compileReport = JasperCompileManager
                    .compileReport(new FileInputStream("src/main/resources/templates/SimplePO.jrxml"));
            JasperPrint finalReport = JasperFillManager.fillReport(compileReport, map, new JREmptyDataSource());
            JRCsvExporter exporter = new JRCsvExporter();
            exporter.setExporterInput(new SimpleExporterInput(finalReport));
            exporter.setExporterOutput(new SimpleWriterExporterOutput(response.getOutputStream()));

            response.setHeader(
                    HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=ProcurementReport.csv;");
            response.setContentType("text/csv");
            exporter.exportReport();

        } catch (Exception ex) {
            ex.printStackTrace();
        }
    }

    /*
     * ---------------------------------------------------------
     * B.4 CRM
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/ticket/{id}", produces = "application/json")
    public ResponseEntity<Object> getSupportTicket(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(customerService.getSupportTicket(id));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/ticket/all", produces = "application/json")
    public List<SupportTicket> getAllSupportTickets() {
        return customerService.getAllSupportTickets();
    }

    @PutMapping(path = "/ticket", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> updateSupportTicket(@RequestBody SupportTicket supportTicket) {
        try {
            return ResponseEntity.ok(customerService.updateSupportTicket(supportTicket));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/ticket/resolve/{id}", produces = "application/json")
    public ResponseEntity<Object> resolveSupportTicket(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(customerService.resolveSupportTicket(id));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/ticket/reply/{ticketId}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> replySupportTicket(@PathVariable Long ticketId, @RequestParam String name,
            @RequestBody Map<String, String> message) {
        try {
            System.out.println(message);
            return ResponseEntity.ok(
                    customerService.replySupportTicket(ticketId, message.get("input"), name, message.get("url")));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/ticket/delete/{id}", produces = "application/json")
    public ResponseEntity<Object> deleteSupportTicket(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(customerService.deleteSupportTicket(id));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * B.5 Rewards and Loyalty
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

    @GetMapping(path = "/customer/phone/{phone}", produces = "application/json")
    public ResponseEntity<Object> getCustomerByPhone(@PathVariable String phone) {
        try {
            return ResponseEntity.ok(customerService.getCustomerByPhone(phone));
        } catch (CustomerException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/customer/email/{email}", produces = "application/json")
    public ResponseEntity<Object> getCustomerByEmail(@PathVariable String email) {
        try {
            return ResponseEntity.ok(customerService.getCustomerByEmail(email));
        } catch (CustomerException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
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
            return ResponseEntity.ok(customerService.createCustomerAccountPOS(customer));
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
    public ResponseEntity<Object> editCustomer(@RequestBody Customer customer) {
        try {
            return ResponseEntity.ok(customerService.updateCustomerAccount(customer));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }
}