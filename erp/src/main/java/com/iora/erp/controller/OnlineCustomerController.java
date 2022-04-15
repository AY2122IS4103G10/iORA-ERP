package com.iora.erp.controller;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Date;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.websocket.server.PathParam;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iora.erp.enumeration.ParcelSizeEnum;
import com.iora.erp.exception.AuthenticationException;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.SupportTicket;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrderLI;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.security.JWTUtil;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.ShippItService;
import com.iora.erp.service.SiteService;
import com.iora.erp.service.StripeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;


@RestController
@RequestMapping("online")
public class OnlineCustomerController {

    @Autowired
    private CustomerService customerService;
    @Autowired
    private CustomerOrderService customerOrderService;
    @Autowired
    private ProcurementService procurementService;
    @Autowired
    private ProductService productService;
    @Autowired
    private SiteService siteService;
    @Autowired
    StripeService stripeService;
    @Autowired
    private ShippItService shippIt;

    /*
     * ---------------------------------------------------------
     * Customer Purchase Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/loginOld", produces = "application/json")
    public ResponseEntity<Object> customerLogin(@RequestParam String email, @RequestParam String password) {
        try {
            return ResponseEntity.ok(customerService.loginAuthentication(email, password));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/refreshToken")
    public void refreshToken(HttpServletRequest request, HttpServletResponse response) throws IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            DecodedJWT decodedJWT = JWTUtil.decodeHeader(authHeader);
            String username = decodedJWT.getSubject();
            Customer customer = customerService.getCustomerByEmail(username);
            String issuer = request.getRequestURL().toString();
            List<String> authorities = List.of("CUSTOMER");
            String accessToken = JWTUtil.generateAccessToken(username, issuer, authorities);
            String refreshToken = authHeader.substring("Bearer ".length());
            Map<String, String> tokens = new HashMap<>();
            tokens.put("accessToken", accessToken);
            tokens.put("refreshToken", refreshToken);
            tokens.put("username", customer.getEmail());
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), tokens);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Refresh token is missing");
        } catch (CustomerException | JWTVerificationException e) {
            response.setHeader("error", e.getMessage());
            response.setStatus(HttpStatus.FORBIDDEN.value());
            Map<String, String> error = new HashMap<>();
            error.put("errorMessage", e.getMessage());
            response.setContentType("application/json");
            new ObjectMapper().writeValue(response.getOutputStream(), error);
        }
    }

    @GetMapping(path = "/postLogin")
    public ResponseEntity<Object> postLogin(HttpServletRequest request, HttpServletResponse response)
            throws IOException {
        String authHeader = request.getHeader(HttpHeaders.AUTHORIZATION);
        try {
            DecodedJWT decodedJWT = JWTUtil.decodeHeader(authHeader);
            String username = decodedJWT.getSubject();
            Customer customer = customerService.getCustomerByEmail(username);
            customer.setPassword("");
            return ResponseEntity.ok(customer);
        } catch (AuthenticationException e) {
            throw new RuntimeException("Refresh token is missing");
        } catch (CustomerException | JWTVerificationException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping(path = "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> registerAccount(@RequestBody Customer customer) {
        try {
            return ResponseEntity.ok(customerService.createCustomerAccount(customer));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/profile/edit", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editProfile(@RequestBody Customer customer) {
        try {
            return ResponseEntity.ok(customerService.updateCustomerAccount(customer));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PostMapping(path = "/profile/password/{id}/{oldPassword}/{newPassword}", produces = "application/json")
    public ResponseEntity<Object> changePassword(@PathVariable Long id, @PathVariable String oldPassword,
            @PathVariable String newPassword) {
        try {
            return ResponseEntity.ok(customerService.updateCustomerPassword(id, oldPassword, newPassword));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PostMapping(path = "/resetpw/{id}", produces = "application/json")
    public ResponseEntity<Object> resetPassword(@PathVariable Long id) {
        try {
            customerService.resetPassword(id);
            return ResponseEntity.ok("Email with generated password has been sent to customer.");
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/history/{customerId}", produces = "application/json")
    public ResponseEntity<Object> getTransactionHistory(@PathVariable Long customerId) {
        try {
            return ResponseEntity.ok(customerService.getCustomerById(customerId).getOrders());
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/redeemPoints/{email}/{amount}", produces = "application/json")
    public ResponseEntity<Object> redeemPoints(@PathVariable String email, @PathVariable int amount) {
        try {
            return ResponseEntity.ok(customerService.redeemPoints(email, amount));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/ticket/all", produces = "application/json")
    public List<SupportTicket> getAllSupportTickets() {
        return customerService.getAllSupportTickets();
    }

    @GetMapping(path = "/ticket/public", produces = "application/json")
    public List<SupportTicket> getPublicSupportTickets() {
        return customerService.getPublicSupportTickets();
    }

    @GetMapping(path = "/ticket/user/{customerId}", produces = "application/json")
    public List<SupportTicket> getUserSupportTickets(@PathVariable Long customerId) {
        try {
            return customerService.getCustomerById(customerId).getSupportTickets();
        } catch (CustomerException e) {
            e.printStackTrace();
            return null;
        }
    }

    @PostMapping(path = "/ticket", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createSupportTicket(@RequestBody SupportTicket supportTicket) {
        try {
            return ResponseEntity.ok(customerService.createSupportTicket(supportTicket));
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

    /*
     * ---------------------------------------------------------
     * Online Order
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/order/{orderId}", produces = "application/json")
    public ResponseEntity<Object> getOnlineOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok((OnlineOrder) customerOrderService.getCustomerOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/order/site/{siteId}", produces = "application/json")
    public List<OnlineOrder> getOnlineOrdersOfSite(@PathVariable Long siteId) {
        Site site = siteService.getSite(siteId);
        return customerOrderService.getOnlineOrdersOfSite(site);
    }

    @GetMapping(path = "/order/status/{status}", produces = "application/json")
    public ResponseEntity<Object> getOnlineOrdersByStatus(@PathVariable String status) {
        try {
            return ResponseEntity.ok(customerOrderService.getOnlineOrdersByStatus(status));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/order/{siteId}/{status}", produces = "application/json")
    public ResponseEntity<Object> getOOBySiteStatus(@PathVariable Long siteId, @PathVariable String status) {
        try {
            return ResponseEntity.ok(customerOrderService.getOOBySiteStatus(siteId, status));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/searchOrder/{siteId}", produces = "application/json")
    public List<OnlineOrder> searchOnlineOrders(@PathVariable Long siteId, @RequestParam String orderId) {
        return customerOrderService.searchOnlineOrders(siteId, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @PostMapping(path = "/pay", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createPaymentIntent(@RequestParam(required = false) Long amt,
            @RequestBody List<CustomerOrderLI> lineItems) {
        try {
            return ResponseEntity.ok(stripeService.createPaymentIntent(lineItems, (amt == null) ? 0L : amt * 100));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/public/pay/{totalAmount}/{isDelivery}", produces = "application/json")
    public ResponseEntity<Object> createPaymentIntentOnlineOrder(@PathVariable Long totalAmount,
            @PathVariable Boolean isDelivery) {
        try {
            return ResponseEntity.ok(stripeService.createPaymentIntentOnlineOrder(totalAmount, isDelivery));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/public/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createOnlineOrder(@RequestBody OnlineOrder onlineOrder,
            @RequestParam(required = false) String paymentIntentId) {
        try {
            return ResponseEntity.ok(
                    customerOrderService.createOnlineOrder(onlineOrder,
                            (paymentIntentId == "") ? null : paymentIntentId));
        } catch (Exception ex) {
            System.out.println(ex.getMessage());
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/customer/cancel/{orderId}/{customerId}", produces = "application/json")
    public ResponseEntity<Object> customerCancelancelOnlineOrder(@PathVariable Long orderId,
            @PathVariable Long customerId) {
        try {
            return ResponseEntity.ok(customerOrderService.customerCancelOnlineOrder(orderId, customerId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/cancel/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> cancelOnlineOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(customerOrderService.cancelOnlineOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/pickpack/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> pickPackOnlineOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(customerOrderService.pickPackOnlineOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/pickingList/{siteId}", produces = "application/json")
    public ResponseEntity<Object> getPickingList(@PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(customerOrderService.getPickingList(siteId));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/startPick", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> startPick(@RequestBody List<Long> orderIds) {
        try {
            customerOrderService.startPick(orderIds);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/finishPick", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> finishPick(@RequestBody List<Long> orderIds) {
        try {
            customerOrderService.finishPick(orderIds);
            return ResponseEntity.ok().build();
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PatchMapping(path = "/scan/{orderId}", produces = "application/json")
    public ResponseEntity<Object> scanProduct(@PathVariable Long orderId, @RequestParam String barcode) {
        try {
            if (!barcode.contains("/")) {
                return ResponseEntity.ok(customerOrderService.scanProduct(orderId, barcode, 1));
            } else {
                return ResponseEntity.ok(
                        customerOrderService.scanProduct(orderId, barcode.substring(0, barcode.indexOf("/")),
                                Integer.parseInt(barcode.substring(barcode.indexOf("/") + 1))));
            }
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/order/{orderId}/{sku}/{qty}", produces = "application/json")
    public ResponseEntity<Object> todeliverOnlineOrder(@PathVariable Long orderId, @PathVariable String sku,
            @PathVariable int qty) {
        try {
            return ResponseEntity.ok(customerOrderService.adjustProduct(orderId, sku, qty));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/order/parcelSize", produces = "application/json")
    public List<ParcelSizeEnum> getParcelSize() {
        return customerOrderService.getParcelSizes();
    }

    @RequestMapping(value = "/order/delivery/{orderId}/{siteId}", consumes = "application/json", method = RequestMethod.POST)
    public ResponseEntity<Object> deliverOnlineOrder(@PathVariable Long orderId, @PathVariable Long siteId,
            @RequestBody OnlineOrder parcelSizes) {
        try {
            // OnlineOrder oo = shippIt.deliveryOrder(orderId, siteId, parcelSizes);
            shippIt.deliveryOrder(orderId, siteId, parcelSizes);
            return ResponseEntity.ok(customerOrderService.pickPackOnlineOrder(orderId, siteId));
        } catch (Exception ex) {
            ex.printStackTrace();
            System.err.println(ex.getMessage());
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/order/delivery/declareMultiple/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverMuiltipleOnlineOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(customerOrderService.deliverMultipleOnlineOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(value = "/deliver/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverOnlineOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(customerOrderService.deliverOnlineOrder(orderId));

        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/deliverMultiple/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverMultipleOnlineOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(customerOrderService.deliverMultipleOnlineOrder(orderId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/order/delivery/retreivelabel/{parcelId}", produces = "application/json")
    public String getLabel(@PathVariable Long parcelId) {
        return shippIt.retreiveLabel(parcelId);
    }

    @GetMapping(path = "/order/delivery/{deliveryId}", produces = "application/json")
    public Delivery getDeliveryDetails(@PathVariable Long deliveryId) {
        return customerOrderService.getDeliveryInfoById(deliveryId);
    }

    // tracking

    @PutMapping(path = "/deliver/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> receiveOnlineOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(customerOrderService.receiveOnlineOrder(orderId, siteId));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/collect/{orderId}", produces = "application/json")
    public ResponseEntity<Object> collectOnlineOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(customerOrderService.collectOnlineOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    /*
     * ---------------------------------------------------------
     * Ecommerce
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/public/model/tag/{company}/{tag}", produces = "application/json")
    public ResponseEntity<Object> getModelsByCompanyAndTag(@PathVariable String company, @PathVariable String tag) {
        try {
            return ResponseEntity.ok(productService.getModelsByCompanyAndTag(company, tag));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/model/tag/{tag}", produces = "application/json")
    public ResponseEntity<Object> getModelsByTag(@PathVariable String tag) {
        try {
            return ResponseEntity.ok(productService.getModelsByTag(tag));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/model/category/{category}", produces = "application/json")
    public ResponseEntity<Object> getModelsByCategory(@PathVariable String category) {
        try {
            return ResponseEntity.ok(productService.getModelsByCategory(category));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/model/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getModel(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/model/skuCode/{sku}", produces = "application/json")
    public ResponseEntity<Object> getModelsNameBySKU(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.getModelByProduct(productService.getProduct(sku)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/modelSearch", produces = "application/json")
    public List<Model> searchModelsByName(@RequestParam String name) {
        return productService.searchModelsByName(name);
    }

    @PostMapping(path = "/public/model/skulist", produces = "application/json")
    public ResponseEntity<Object> getModelsBySKUList(@RequestBody List<String> skuList) {
        try {
            return ResponseEntity.ok(productService.getModelsBySKUList(skuList));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/model/modelCode/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getModelsNameByModelCode(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/viewStock/product/{skuCode}", produces = "application/json")
    public ResponseEntity<Object> viewStockByProduct(@PathVariable String skuCode) {
        try {
            return ResponseEntity.ok(siteService.getStockLevelLI(3L, skuCode));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/viewStock", produces = "application/json")
    public StockLevel viewStockOfOnlineSite() {
        try {
            Site site = siteService.getSite(3L);
            return site.getStockLevel();
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping(path = "/public/customerOrder/calculate", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> calculatePromotions(@RequestBody List<CustomerOrderLI> lineItems) {
        try {
            return ResponseEntity.ok(customerOrderService.calculatePromotions(lineItems));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/public/stores/{country}", produces = "application/json")
    public List<? extends Site> viewStores(@PathVariable String country) {
        return siteService.searchStores(country, "");
    }

    @GetMapping(path = "/customer/vouchers/{customerId}", produces = "application/json")
    public ResponseEntity<Object> getVouchersOfCustomer(@PathVariable Long customerId) {
        try {
            return ResponseEntity.ok(customerService.getVouchersOfCustomer(customerId));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // @GetMapping(path = "/public/reports/po")
    // public void generateProcurementReport(
    //         HttpServletResponse response,
    //         @RequestParam Long siteId, 
    //         @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date start,
    //         @RequestParam @DateTimeFormat(pattern = "ddMMyyyy") Date end) {
    //     try {
    //         List<ProcurementOrder> orders = procurementService.getProcurementOrdersInRange(siteId, start, end);
    //         System.out.println(orders);

    //         JRBeanCollectionDataSource beanCollectionDataSource = new JRBeanCollectionDataSource(orders);
    //         HashMap<String, Object> map = new HashMap<>();
    //         map.put("JasperCustomSubReportLocation", "podetails.jrxml");
    //         map.put("JasperCustomSubReportDataSource", beanCollectionDataSource);
    //         map.put("DS1", beanCollectionDataSource);

    //         JasperReport compileReport = JasperCompileManager
    //                 .compileReport(new FileInputStream("src/main/resources/templates/PO.jrxml"));
    //         JasperPrint finalReport = JasperFillManager.fillReport(compileReport, map, new JREmptyDataSource());
    //         JRCsvExporter exporter = new JRCsvExporter();
    //         exporter.setExporterInput(new SimpleExporterInput(finalReport));
    //         exporter.setExporterOutput(new SimpleWriterExporterOutput(response.getOutputStream()));

    //         response.setHeader(
    //                 HttpHeaders.CONTENT_DISPOSITION, "attachment;filename=ProcurementReport.csv;");
    //         response.setContentType("text/csv");
    //         exporter.exportReport();

    //     } catch (Exception ex) {
    //         ex.printStackTrace();
    //     }
    // }


}
