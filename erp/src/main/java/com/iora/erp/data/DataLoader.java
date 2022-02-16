package com.iora.erp.data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.ProductFieldException;
import com.iora.erp.exception.ProductItemException;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
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

    private void loadData() throws Exception {
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

        // Creating Product Fields
        Set<ProductField> productFields = new HashSet<>();
        ProductField pf1 = new ProductField("COLOUR", "BLACK");
        productService.createProductField(pf1);
        productFields.add(pf1);
        ProductField pf2 = new ProductField("COLOUR", "GREEN");
        productService.createProductField(pf2);
        productFields.add(pf2);
        ProductField pf3 = new ProductField("COLOUR", "KHAKI");
        productService.createProductField(pf3);
        productFields.add(pf3);
        ProductField pf4 = new ProductField("SIZE", "S");
        productService.createProductField(pf4);
        productFields.add(pf4);
        ProductField pf5 = new ProductField("SIZE", "M");
        productService.createProductField(pf5);
        productFields.add(pf5);
        ProductField pf6 = new ProductField("SIZE", "L");
        productService.createProductField(pf6);
        productFields.add(pf6);
        ProductField pf7 = new ProductField("SIZE", "XL");
        productService.createProductField(pf7);
        productFields.add(pf7);
        ProductField pf8 = new ProductField("TAG", "BOTTOM");
        productService.createProductField(pf8);
        productFields.add(pf8);
        ProductField pf9 = new ProductField("TAG", "SKIRTS");
        productService.createProductField(pf9);
        productFields.add(pf9);
        ProductField pf10 = new ProductField("COMPANY", "IORA");
        productService.createProductField(pf10);
        productFields.add(pf10);

        // Add a Model
        Model model = new Model("ASK0009968A");
        model.setAvailable(true);
        model.setDescription("Front self-tie sash. Back elasticated waistband. Fabric: Polyester");
        model.setName("Wrapped Shift Skirt");
        model.setOnlineOnly(false);
        model.setPrice(29);
        model.setProductFields(productFields);
        try {
            productService.createModel(model);
        } catch (ModelException ex) {
            System.out.println(ex.getMessage());
        }

        // Add Products of the Model
        try {
            productService.createProduct(model.getModelCode(), new ArrayList<>(productFields));
        } catch (ProductException | ProductFieldException ex) {
            ex.printStackTrace();
            System.out.println(ex.getMessage());
        }

        // Add Promotion to the Model
        try {
            productService.addPromoCategory(model.getModelCode(), "2 FOR S$49", 24.5);
        } catch (ModelException ex) {
            System.out.println(ex.getMessage());
        }

        // Add many productItems of the product
        try {
            productService.createProductItem("T1ZZ3OA60NOBK18H", "ASK0009968A-1");
            productService.createProductItem("NJCTRE9HI281F8B7", "ASK0009968A-2");
            productService.createProductItem("1HAC5IJD2Y8R2X4G", "ASK0009968A-3");
            productService.createProductItem("ANGA64O891NH0WC4", "ASK0009968A-4");
            productService.createProductItem("RBKD1XUUTN8ZVO3Z", "ASK0009968A-5");
            productService.createProductItem("T5VWY8V1V8QQUVG1", "ASK0009968A-6");
            productService.createProductItem("WQ8ED2RQ83VV1HO2", "ASK0009968A-7");
            productService.createProductItem("HAPPYM46XOVU766P", "ASK0009968A-8");
            productService.createProductItem("1V76V4FAM2NX90IU", "ASK0009968A-9");
            productService.createProductItem("1Z3G165G9DMDGQMD", "ASK0009968A-10");
            productService.createProductItem("6AND0X6G25KLNVUE", "ASK0009968A-11");
            productService.createProductItem("OZ9O75UATQ8P8QS4", "ASK0009968A-12");
        } catch (ProductItemException e) {
            e.printStackTrace();
        }

        // Generate 10 $10 vouchers
        customerService.generateVouchers(10, 10, "2022-02-16");

        // Generate 10 $5 vouchers
        customerService.generateVouchers(5, 10, "2022-02-16");
    }

}
