package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import com.iora.erp.enumeration.Country;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.AdminServiceImpl;
import com.iora.erp.service.EmployeeService;
import com.iora.erp.service.SiteService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;

@RestController
@RequestMapping("admin")
public class AdminController {

    @Autowired
    private SiteService siteService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private AdminServiceImpl adminService;

    // Employee/JobTitle/Department stuff here

    @PostMapping(path = "/addSite/{storeType}", consumes = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> addSite(@RequestBody Site site, @PathVariable String storeType) {
        try {
            siteService.createSite(site, storeType);
            return ResponseEntity.ok("Site with site ID " + site.getId() + " is successfully created.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/editSite", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editSite(@RequestBody Site site) {
        try {
            siteService.updateSite(site);
            return ResponseEntity.ok("Site with site ID " + site.getId() + " is successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/deleteSite")
    public ResponseEntity<Object> deleteSite(@RequestParam Long siteId) {
        try {
            siteService.deleteSite(siteId);
            return ResponseEntity.ok("Site with site ID " + siteId + " is successfully deleted/deactivated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/viewSites", produces = "application/json")
    public List<? extends Site> viewSites(@RequestParam List<String> storeTypes, @RequestParam String country,
            @RequestParam String company) {
        return siteService.searchAllSites(storeTypes, country, company);
    }

    @GetMapping(path = "/viewSites/{storeType}", produces = "application/json")
    public List<? extends Site> viewSitesBySubclass(@PathVariable String storeType, @RequestParam String country,
            @RequestParam String company) {
        switch (storeType) {
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

    @PostMapping(path = "/addEmployee", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addEmployee(@RequestBody Employee employee) {
        try {
            employeeService.createEmployee(employee);
            return ResponseEntity.ok("Employee " + employee.getName() + " is successfully created");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/addEmployees", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addEmployee(@RequestBody List<Employee> employee) {
        try {
            for (Employee e : employee) {
                employeeService.createEmployee(e);
            }
            return ResponseEntity.ok("All employees has been successfully created");
        } catch (EmployeeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    public List<Employee> viewEmployees(@RequestParam("search") String search) {
        try {
            return employeeService.getEmployeeByFields(search);
        } catch (Exception e) {
            return null;
        }
    }


    //need do management update
    @PutMapping(path = "/editEmployee", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editSite(@RequestBody Employee employee) {
        try {
            employeeService.updateEmployeeAccount(employee);
            return ResponseEntity.ok("Employee with employee ID " + employee.getId() + " is successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }




}