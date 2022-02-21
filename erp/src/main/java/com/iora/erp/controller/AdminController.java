package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.AdminService;
import com.iora.erp.service.EmployeeService;
import com.iora.erp.service.SiteService;

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
@RequestMapping("admin")
public class AdminController {

    @Autowired
    private SiteService siteService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private AdminService adminService;

    /*
     * ---------------------------------------------------------
     * C.1 Account Management
     * ---------------------------------------------------------
     */

    // Employee/JobTitle/Department stuff here


    //need to edit
    @PostMapping(path = "/addJobTitle", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addJobTitle(@RequestBody JobTitle jt) {
        try {
            adminService.createJobTitle(jt);
            return ResponseEntity.ok("Job title has been successfully created");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/editJobTitle", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editJobTitle(@RequestBody JobTitle jt) {
        try {
            adminService.updateJobTitle(jt);
            return ResponseEntity.ok("Job Tiltle with ID " + jt.getId() + " has been successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }


    @GetMapping(path = "/viewJobTitles", produces = "application/json")
    public List<JobTitle> viewJobTitles(@RequestParam("search") String search) {
        try {
            if(search == null) {
                search ="";
            }
            return adminService.getJobTitlesByFields(search);
        } catch (Exception e) {
            return null;
        }
    }

    
    @GetMapping(path = "/viewAllAddress", produces = "application/json")
    public List<Address> viewAllAddress() {
        try {
            return adminService.getListAddress();
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewAddress", produces = "application/json")
    public List<Address> viewAddress(@RequestParam("search") String search) {
        try {
            if(search == null) {
                search ="";
            }
            return adminService.getListAddressFields(search);
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
    public ResponseEntity<Object> addAllEmployee(@RequestBody List<Employee> employee) {
        try {
            for(Employee e : employee) {
                employeeService.createEmployee(e);
            }
            return ResponseEntity.ok("All employees has been successfully created");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/viewEmployees", produces = "application/json")
    public List<Employee> viewEmployees(@RequestParam("search") String search) {
        try {
            return employeeService.getEmployeeByFields(search);
        } catch (Exception e) {
            return null;
        }
    }

    @PutMapping(path = "/editEmployee", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editEmployee(@RequestBody Employee employee) {
        try {
            employeeService.updateEmployeeAccount(employee);
            return ResponseEntity.ok("Employee with employee ID " + employee.getId() + " is successfully updated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/enableEmployee", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> enableEmployee(@RequestBody Employee employee) {
        try {
            employeeService.unblockEmployee(employee);
            return ResponseEntity.ok("Employee with employee ID " + employee.getId() + " has been activated.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/disableEmployee", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> disableEmployee(@RequestBody Employee employee) {
        try {
            employeeService.blockEmployee(employee);
            return ResponseEntity.ok("Employee with employee ID " + employee.getId() + " has been blocked.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/addSite/{storeType}", consumes = "application/json")
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
}