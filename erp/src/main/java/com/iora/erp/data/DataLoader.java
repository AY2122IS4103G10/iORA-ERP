package com.iora.erp.data;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.service.AdminService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.EmployeeService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class DataLoader implements CommandLineRunner {

    @Autowired
    private AdminService adminService;
    @Autowired
    private CustomerService customerService;
    @Autowired
    private EmployeeService employeeService;
    @Autowired
    private ProductService productService;
    @Autowired
    private SiteService siteService;
    @PersistenceContext
    private EntityManager em;

    @Override
    public void run(String... args) throws Exception {
        loadData();
    }

    private void loadData() {
        // Insert Data-Init here

        Address a1 = new Address("Singapore", "Singapore", "iORA HQ", "Singapore", "10Q", "Singapore 629841", false,
                1.333525, 103.703666688);
        em.persist(a1);

        List<Department> departments = new ArrayList<Department>();
        Department sam = new Department("Sales and Marketing");
        em.persist(sam);
        departments.add(sam);

        Company iora = new Company("iORA Fashion Pte. Ltd.", "199703089W", "63610056");
        iora.setActive(true);
        iora.setDepartments(departments);
        iora.setAddress(a1);
        em.persist(iora);
    }

}
