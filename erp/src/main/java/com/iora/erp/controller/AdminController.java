package com.iora.erp.controller;

import java.net.URI;
import java.util.List;

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
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
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

    @PostMapping(path = "/addSite", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addSite(@RequestBody Site site, @RequestParam String storeType) {
        try {
            siteService.createSite(site, storeType);

            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(site.getId())
                    .toUri();

            return ResponseEntity.created(location).build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @PutMapping(path = "/editSite", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editSite(@RequestBody Site site) {
        try {
            siteService.updateSite(site);

            URI location = ServletUriComponentsBuilder
                    .fromCurrentRequest()
                    .path("/{id}")
                    .buildAndExpand(site.getId())
                    .toUri();

            return ResponseEntity.created(location).build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @DeleteMapping(path = "/deleteSite")
    public ResponseEntity<Object> deleteSite(@RequestParam Long siteId) {
        try {
            siteService.deleteSite(siteId);

            return ResponseEntity.accepted().build();
        } catch (Exception ex) {
            return ResponseEntity.badRequest().build();
        }
    }

    @GetMapping(path = "/viewSites", produces = "application/json")
    public List<? extends Site> viewSites(@RequestParam String country, @RequestParam String storeType) {

        boolean hasCountry = country != null;
        Country countryEnum = Country.valueOf(country.toUpperCase());

        switch (storeType) {
            case "Headquarters":
                return hasCountry ? siteService.getHeadquartersByCountry(countryEnum)
                        : siteService.getAllHeadquarters();

            case "Manufacturing":
                return hasCountry ? siteService.getManufacturingByCountry(countryEnum)
                        : siteService.getAllManufacturing();

            case "OnlineStore":
                return hasCountry ? siteService.getOnlineStoresByCountry(countryEnum)
                        : siteService.getAllOnlineStores();

            case "Store":
                return hasCountry ? siteService.getStoresByCountry(countryEnum)
                        : siteService.getAllStores();

            case "Warehouse":
                return hasCountry ? siteService.getWarehousesByCountry(countryEnum)
                        : siteService.getAllWarehouses();

            default:
                return hasCountry ? siteService.getSitesByCountry(countryEnum)
                        : siteService.getAllSites();
        }
    }

    @GetMapping(path = "/viewSite", produces = "application/json")
    public Site viewSite(@RequestParam Long siteId) {
        try {
            return siteService.getSite(siteId);
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
            for(Employee e : employee) {
                employeeService.createEmployee(e);
            }
            return ResponseEntity.ok("All employees has been successfully created");
        } catch (EmployeeException ex) {
            return ResponseEntity.badRequest().body(ex.getMessage()); 
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    //faulty
    @GetMapping(path = "/viewEmployees", produces = "application/json")
    public List<Employee> viewEmployees(@RequestParam String keyword) {
        try {
            return employeeService.getEmployeeByFields(keyword);
        } catch (Exception e) {
            return null;
        }
    }
}