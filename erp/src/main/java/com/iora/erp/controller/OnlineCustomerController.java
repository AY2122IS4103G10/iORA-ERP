package com.iora.erp.controller;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.stream.Stream;
import java.util.stream.Collectors;

import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StockLevelLI;
import com.iora.erp.enumeration.CountryEnum;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.iora.erp.exception.AuthenticationException;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.security.JWTUtil;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.StripeService;
import com.iora.erp.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
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
    private ProductService productService;
    @Autowired
    private SiteService siteService;

    /*
     * ---------------------------------------------------------
     * G.1 Customer Purchase Management
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
            Customer out = new Customer(customer.getFirstName(), customer.getLastName(), customer.getEmail(),
                    customer.getDob(), customer.getContactNumber(), customer.getMembershipTier(), "");
            return ResponseEntity.ok(out);
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
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/searchOrder/{siteId}", produces = "application/json")
    public List<OnlineOrder> searchOnlineOrders(@PathVariable Long siteId, @RequestParam String orderId) {
        return customerOrderService.searchOnlineOrders(siteId, (orderId == "") ? null : Long.parseLong(orderId));
    }

    @Autowired
    StripeService stripeService;

    @PostMapping(path = "/pay/{isDelivery}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createPaymentIntent(@RequestBody List<CustomerOrderLI> lineItems, @PathVariable Boolean isDelivery) {
        try {
            return ResponseEntity.ok(stripeService.createPaymentIntentOnlineOrder(lineItems, isDelivery));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/create", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createOnlineOrder(@RequestBody OnlineOrder onlineOrder,
            @RequestParam String clientSecret) {
        try {
            return ResponseEntity.ok(
                    customerOrderService.createOnlineOrder(onlineOrder, (clientSecret == "") ? null : clientSecret));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    // Haven't get into making it work
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
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/deliver/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverOnlineOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(customerOrderService.deliverOnlineOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/deliverMultiple/{orderId}", produces = "application/json")
    public ResponseEntity<Object> deliverMuiltipleOnlineOrder(@PathVariable Long orderId) {
        try {
            return ResponseEntity.ok(customerOrderService.deliverMultipleOnlineOrder(orderId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/deliver/{orderId}/{siteId}", produces = "application/json")
    public ResponseEntity<Object> receiveOnlineOrder(@PathVariable Long orderId, @PathVariable Long siteId) {
        try {
            return ResponseEntity.ok(customerOrderService.receiveOnlineOrder(orderId, siteId));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
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
    
    @GetMapping(path = "/model/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getModel(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model/skuCode/{sku}", produces = "application/json")
    public ResponseEntity<Object> getModelsNameBySKU(@PathVariable String sku) {
        try {
            return ResponseEntity.ok(productService.getModelByProduct(productService.getProduct(sku)));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/model/modelCode/{modelCode}", produces = "application/json")
    public ResponseEntity<Object> getModelsNameByModelCode(@PathVariable String modelCode) {
        try {
            return ResponseEntity.ok(productService.getModel(modelCode));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/viewStock/product/{skuCode}", produces = "application/json")
    public ResponseEntity<Object> viewStockByProduct(@PathVariable String skuCode) {
        try {
            return ResponseEntity.ok(siteService.getStockLevelLI(3L, skuCode));
        } catch (Exception ex) {
            ex.printStackTrace();
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/viewStock", produces = "application/json")
    public StockLevel viewStockOfOnlineSite() {
        try {
            Site site = siteService.getSite(3L);
            return site.getStockLevel();
        } catch (Exception e) {
            return null;
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

    // @GetMapping(path = "/countries", produces = "application/json")
    // public List<String> getCountries() {
    //     try {
    //         List<String> country = Stream.of(CountryEnum.values()).map(
    //                 CountryEnum::name).collect(Collectors.toList());

    //         return country;
    //     } catch (Exception e) {
    //         return null;
    //     }
    // }

    @GetMapping(path = "/stores/{country}", produces = "application/json")
    public List<? extends Site> viewStores(@PathVariable String country) {
        return siteService.searchStores(country, "");
    }
}
