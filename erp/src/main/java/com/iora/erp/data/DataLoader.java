package com.iora.erp.data;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.enumeration.FashionLine;
import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.site.HeadquartersSite;
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
        iora.setDepartments(departments);
        iora.setAddress(a1);
        em.persist(iora);

        HeadquartersSite iorahq = new HeadquartersSite("HQ", a1, "123456", iora);
        em.persist(iorahq);

        // Add a Model
        Model model = new Model("ASK0009968A");
        model.setAvailable(true);
        model.setDescription("Front self-tie sash. Back elasticated waistband. Fabric: Polyester");
        model.setFashionLine(FashionLine.IORA);
        model.setName("Wrapped Shift Skirt");
        model.setOnlineOnly(false);
        model.setPrice(29);
        try {
            productService.createModel(model);
        } catch (ModelException ex) {
            System.out.println(ex.getMessage());
        }

        // Add Products of the Model
        List<String> colours = new ArrayList<>();
        colours.add("black");
        colours.add("green");
        colours.add("khaki");

        List<String> sizes = new ArrayList<>();
        sizes.add("S");
        sizes.add("M");
        sizes.add("L");
        sizes.add("XL");

        List<String> tags = new ArrayList<>();
        tags.add("bottoms");
        tags.add("skirts");

        try {
            productService.createProduct(model.getModelCode(), colours, sizes, tags);
        } catch (ProductException ex) {
            System.out.println(ex.getMessage());
        }

        // Add Promotion to the Model
        try {
            productService.addPromoCategory(model.getModelCode(), "2 FOR S$49", 24.5);
        } catch (ModelException ex) {
            System.out.println(ex.getMessage());
        }
    }

}
