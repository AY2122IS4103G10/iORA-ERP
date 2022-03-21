package com.iora.erp.controller;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;
import java.util.stream.Stream;

import com.iora.erp.enumeration.Country;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.company.Vendor;
import com.iora.erp.model.site.Site;
import com.iora.erp.service.AdminService;
import com.iora.erp.service.EmployeeService;
import com.iora.erp.service.SiteService;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping(path = "/addJobTitle", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addJobTitle(@RequestBody JobTitle jt) {
        try {
            return ResponseEntity.ok(adminService.createJobTitle(jt));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PutMapping(path = "/editJobTitle", consumes = "application/json", produces = "application/json")
    public JobTitle editJobTitle(@RequestBody JobTitle jt) {
        try {
            return adminService.updateJobTitle(jt);
        } catch (Exception ex) {
            return null;
        }
    }

    @DeleteMapping(path = "/deleteJobTitle/{jobTitleId}")
    public ResponseEntity<Object> deleteJobTitle(@PathVariable Long jobTitleId) {
        try {
            adminService.deleteJobTitle(jobTitleId);
            return ResponseEntity.ok("Job Tiltle with ID " + jobTitleId + " has been successfully deleted.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/accessRights", produces = "application/json")
    public List<String> getAccessRights() {
        return adminService.getAccessRights();
    }

    @GetMapping(path = "/viewJobTitles", produces = "application/json")
    public List<JobTitle> viewJobTitles(@RequestParam("search") String search) {
        try {
            if (search == null) {
                search = "";
            }
            return adminService.getJobTitlesByFields(search);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewJobTitle/{id}", produces = "application/json")
    public JobTitle viewJobTitle(@PathVariable Long id) {
        try {
            return adminService.getJobTitleById(id);
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping(path = "/addVendor", consumes = "application/json", produces = "application/json")
    public Vendor addVendor(@RequestBody Vendor v) {
        try {
            return adminService.createVendor(v);
        } catch (Exception ex) {
            return null;
        }
    }

    @GetMapping(path = "/viewVendors", produces = "application/json")
    public List<Vendor> viewVendors(@RequestParam("search") String search) {
        try {
            if (search == null) {
                search = "";
            }
            return adminService.getListofVendor(search);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewVendor", produces = "application/json")
    public Vendor viewVendor(@RequestParam Long id) {
        try {
            return adminService.getVendorById(id);
        } catch (Exception e) {
            return null;
        }
    }

    @PutMapping(path = "/editVendor", consumes = "application/json", produces = "application/json")
    public Vendor editVendor(@RequestBody Vendor v) {
        try {
            return adminService.updateVendor(v);
        } catch (Exception ex) {
            return null;
        }
    }

    @DeleteMapping(path = "/deleteVendor")
    public ResponseEntity<Object> deleteVendor(@RequestParam Long id) {
        try {
            adminService.deleteVendor(id);
            return ResponseEntity.ok("Vendor with ID " + id + " has been successfully deleted.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/addCompany", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addCompany(@RequestBody Company company) {
        try {
            return ResponseEntity.ok(adminService.createCompany(company));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/viewCompanies", produces = "application/json")
    public List<Company> viewCompanies(@RequestParam("search") String search) {
        try {
            if (search == null) {
                search = "";
            }
            return adminService.getCompanysByFields(search);
        } catch (Exception ex) {
            return null;
        }
    }

    @GetMapping(path = "/viewCompany", produces = "application/json")
    public Company viewCompany(@RequestParam Long id) {
        try {
            return adminService.getCompanyById(id);
        } catch (Exception ex) {
            return null;
        }
    }

    @PutMapping(path = "/editCompany", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editCompany(@RequestBody Company company) {
        try {
            return ResponseEntity.ok(adminService.editCompany(company));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/deleteCompany")
    public ResponseEntity<Object> deleteCompany(@RequestParam Long id) {
        try {
            adminService.deleteCompany(id);
            return ResponseEntity.ok(id);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
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
            if (search == null) {
                search = "";
            }
            return adminService.getListAddressFields(search);
        } catch (Exception e) {
            return null;
        }
    }

    @PostMapping(path = "/addDepartment", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addDepartment(@RequestBody Department d) {
        try {
            return ResponseEntity.ok(adminService.createDepartment(d));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @GetMapping(path = "/viewDepartments", produces = "application/json")
    public List<Department> viewDeparments(@RequestParam("search") String search) {
        try {
            if (search == null) {
                search = "";
            }
            return adminService.getDepartmentsByFields(search);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewDepartment", produces = "application/json")
    public Department viewDeparment(@RequestParam Long id) {
        try {
            return adminService.getDepartmentById(id);
        } catch (Exception e) {
            return null;
        }
    }

    @PutMapping(path = "/editDepartment", consumes = "application/json", produces = "application/json")
    public Department editDepartment(@RequestBody Department d) {
        try {
            return adminService.editDepartment(d);
        } catch (Exception ex) {
            return null;
        }
    }

    @DeleteMapping(path = "/deleteDepartment")
    public ResponseEntity<Object> deleteDepartment(@RequestParam Long id) {
        try {
            adminService.deleteDepartment(id);
            return ResponseEntity.ok("Department with ID " + id + " has been successfully deleted.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/addEmployee", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addEmployee(@RequestBody Employee employee) {
        try {
            return ResponseEntity.ok(employeeService.createEmployee(employee));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @PostMapping(path = "/addEmployees", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addAllEmployee(@RequestBody List<Employee> employee) {
        try {
            String msg = "Except for employee(s): ";
            Boolean checkFail = false;

            for (Employee e : employee) {
                try {
                    employeeService.createEmployee(e);
                } catch (EmployeeException ex) {
                    if (checkFail == false) {
                        msg += e.getName();
                        checkFail = true;
                    } else {
                        msg += ", " + e.getName();
                    }
                }
            }
            msg += ", all employees has been created.";

            if (checkFail == false) {
                return ResponseEntity.ok("All employees has been successfully created");
            } else {
                return ResponseEntity.ok(msg);
            }
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @GetMapping(path = "/viewEmployees", produces = "application/json")
    public List<Employee> viewEmployees(@RequestParam("search") String search) {
        try {
            if (search == null) {
                search = "";
            }
            return employeeService.getEmployeeByFields(search);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/viewEmployee", produces = "application/json")
    public Employee viewEmployee(@RequestParam Long id) {
        try {
            return employeeService.getEmployeeById(id);
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path= "/usernameAvailable/{username}", produces = "application/json")
    public Boolean isUsernameAvailable(@PathVariable("username") String username) {
        try {
            return employeeService.usernameAvailability(username);
        } catch (Exception e) {
            return null;
        }
    }

    @PutMapping(path = "/editEmployee", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editEmployee(@RequestBody Employee employee) {
        try {
            return ResponseEntity.ok(employeeService.updateEmployeeAccount(employee));
        } catch (Exception ex) {
            System.err.println(ex.getMessage());
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(ex.getMessage());
        }
    }

    @DeleteMapping(path = "/deleteEmployee")
    public ResponseEntity<Object> deleteEmployee(@RequestParam Long id) {
        try {
            employeeService.removeEmployee(id);
            return ResponseEntity.ok(id);
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/enableEmployee", produces = "application/json")
    public Employee enableEmployee(@RequestParam Long id) {
        try {
            return employeeService.unblockEmployee(id);
        } catch (Exception ex) {
            return null;
        }
    }

    @PutMapping(path = "/disableEmployee", produces = "application/json")
    public Employee disableEmployee(@RequestParam Long id) {
        try {
            return employeeService.blockEmployee(id);
        } catch (Exception ex) {
            return null;
        }
    }

    @PostMapping(path = "/resetpw/{id}", produces = "application/json")
    public ResponseEntity<Object> resetPassword(@PathVariable Long id) {
        try {
            employeeService.resetPassword(id);
            return ResponseEntity.ok("Email with temporary password has been sent.");
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PostMapping(path = "/addSite/{storeType}", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> addSite(@RequestBody Site site, @PathVariable String storeType) {
        try {
            return ResponseEntity.ok(siteService.createSite(site, storeType));
        } catch (Exception ex) {
            return ResponseEntity.badRequest().body(ex.getMessage());
        }
    }

    @PutMapping(path = "/editSite", consumes = "application/json", produces = "application/json")
    public ResponseEntity<Object> editSite(@RequestBody Site site) {
        try {
            return ResponseEntity.ok(siteService.updateSite(site));
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

    @GetMapping(path = "/countries", produces = "application/json")
    public List<String> getCountries() {
        try {
            List<String> country = Stream.of(Country.values()).map(
                    Country::name).collect(Collectors.toList());

            return country;
        } catch (Exception e) {
            return null;
        }
    }

    @GetMapping(path = "/noti/{siteId}", produces = "application/json")
    public List<Notification> getNotifications(@PathVariable String siteId) {
        if (siteId.equals("0") || siteId.equals("null")) {
            return new ArrayList<>();
        }
        return siteService.getNotifications(Long.valueOf(siteId));
    }
}