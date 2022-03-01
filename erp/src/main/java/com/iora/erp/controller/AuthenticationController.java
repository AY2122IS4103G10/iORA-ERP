package com.iora.erp.controller;

import com.iora.erp.service.EmployeeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("auth")
public class AuthenticationController {

    @Autowired
    private EmployeeService employeeService;

    /*
     * ---------------------------------------------------------
     * A.1 Account
     * ---------------------------------------------------------
     */

    @GetMapping(path = "/empLogin", produces = "application/json")
    public ResponseEntity<Object> employeeLogin(@RequestParam String username, @RequestParam String password) {
        try {
            return ResponseEntity.ok(employeeService.loginAuthentication(username, password));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

}
