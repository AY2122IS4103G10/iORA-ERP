package com.iora.erp.controller;

import com.iora.erp.model.customer.Customer;
import com.iora.erp.service.CustomerService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
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

    /*
     * ---------------------------------------------------------
     * G.1 Customer Purchase Management
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/login", produces = "application/json")
    public Customer customerLogin(@RequestParam String email, @RequestParam String password) {
        try {
            return customerService.loginAuthentication(email, password);
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping(path = "/register", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addJobTitle(@RequestBody Customer customer) {
        try {
            customerService.createCustomerAccount(customer);
            return ResponseEntity.ok("Your customer Account has been successfully created");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/profile/edit", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editProfile(@RequestBody Customer customer) {
        try {
            return ResponseEntity.ok(customerService.updateCustomerAccount(customer));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

}
