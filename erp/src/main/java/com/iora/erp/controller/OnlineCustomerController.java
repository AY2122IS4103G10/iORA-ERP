package com.iora.erp.controller;

import java.util.List;

import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.StripeService;

import org.springframework.beans.factory.annotation.Autowired;
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

    /*
     * ---------------------------------------------------------
     * G.1 Customer Purchase Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/login", produces = "application/json")
    public ResponseEntity<Object> customerLogin(@RequestParam String email, @RequestParam String password) {
        try {
            return ResponseEntity.ok(customerService.loginAuthentication(email, password));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
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

    @PostMapping(path = "/pay", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> createPaymentIntent(@RequestBody List<CustomerOrderLI> lineItems) {
        try {
            return ResponseEntity.ok(stripeService.createPaymentIntent(lineItems));
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
                    customerOrderService.createCustomerOrder(onlineOrder, (clientSecret == "") ? null : clientSecret));
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
}
