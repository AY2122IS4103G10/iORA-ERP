package com.iora.erp.data;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.*;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.fasterxml.jackson.annotation.JsonProperty.Access;
import com.iora.erp.enumeration.AccessRights;
import com.iora.erp.enumeration.Country;
import com.iora.erp.enumeration.PayType;
import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.ProductFieldException;
import com.iora.erp.exception.ProductItemException;
import com.iora.erp.model.Currency;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.customer.BirthdayPoints;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;
import com.iora.erp.model.company.Vendor;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;
import com.iora.erp.service.AdminService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.EmployeeService;
import com.iora.erp.service.ProductService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component
@Transactional
public class DataLoader implements CommandLineRunner {

        @Autowired
        private CustomerService customerService;
        @Autowired
        private ProductService productService;
        @Autowired
        private AdminService adminService;
        @Autowired
        private EmployeeService employeeService;
        @PersistenceContext
        private EntityManager em;

        @Override
        public void run(String... args) throws Exception {
                if (em.createQuery("SELECT s FROM Site s", Site.class).getResultList().size() == 0) {
                        loadData();
                }
        }

        private void loadData() throws Exception {
                // Insert Data-Init here

                Address a1 = new Address(Country.Singapore, "Singapore", "Enterprise 10", "Singapore", "NIL",
                                "10P Enterprise Road", "Singapore 629840", false, 1.334251, 103.704246);

                em.persist(a1);

                //JobTitle
                Set<AccessRights> s = new HashSet<>();
                s.add(AccessRights.MARKETING_BASIC);

                Set<AccessRights> ar = new HashSet<>();
                ar.add(AccessRights.MARKETING_BASIC);
                ar.add(AccessRights.MARKETING_CRM);
                JobTitle jobTitle1 = new JobTitle("Sales", "Sales and Marketing Product", ar);
                adminService.createJobTitle(jobTitle1);

                Set<AccessRights> ar2 = new HashSet<>();
                ar2.add(AccessRights.STORE_BASIC);
                ar2.add(AccessRights.STORE_INVENTORY);
                JobTitle jobTitle2 = new JobTitle("Store Manager", "Managnig the physical store", ar2);
                em.persist(jobTitle2);
                adminService.createJobTitle(jobTitle2);

                Set<AccessRights> ar3 = new HashSet<>();
                ar2.add(AccessRights.WAREHOUSE_BASIC);
                ar2.add(AccessRights.WAREHOUSE_ORDER);
                JobTitle jobTitle3 = new JobTitle("Manufacturing Manager", "Managnig the products production", ar3);
                em.persist(jobTitle3);
                adminService.createJobTitle(jobTitle3);

                //Department
                Department sam = new Department("Sales and Marketing");
                List<JobTitle> jt = new ArrayList<>();
                jt.add(adminService.getJobTitleById(Long.valueOf(1)));
                sam.setJobTitles(jt);
                adminService.createDepartment(sam);

                Department sam2 = new Department("Online Marketing");
                sam.setJobTitles(jt);
                adminService.createDepartment(sam2);

                Department sam3 = new Department("Manufacturing");
                List<JobTitle> jt3 = new ArrayList<>();
                jt3.add(adminService.getJobTitleById(Long.valueOf(3)));
                sam.setJobTitles(jt3);
                adminService.createDepartment(sam3);

                //Vendor
                Address a2 = new Address(Country.Singapore, "Singapore", "Kewalram House", "Singapore", "02-01",
                "8 Jln Kilang Timor", "Singapore 159305", false, 1.334251, 103.704246);
                em.persist(a2);
                
                List<Address> listAdd = new ArrayList<>();
                listAdd.add(a2);
                Vendor v1 = new Vendor("Ninja Van", "+65 66028271", "Singapore domestic delivery", "");
                em.persist(v1);
                v1.setAddress(listAdd);

                //Company
                List<Department> departments = new ArrayList<>();
                departments.add(adminService.getDepartmentById(Long.valueOf(1)));
                departments.add(adminService.getDepartmentById(Long.valueOf(2)));

                Company iora = new Company("iORA Fashion Pte. Ltd.", "199703089W", "+65-63610056");
                iora.setDepartments(departments);
                iora.setAddress(a1);
                adminService.createCompany(iora);


                Company lalu = new Company("LALU Fashion Pte. Ltd.", "201226449M", "+65-63610056");
                lalu.setDepartments(departments);
                lalu.setAddress(a1);
                em.persist(lalu);

                Company sora = new Company("SORA Fashion Pte. Ltd.", "199900605W", "+65-63610056");
                sora.setDepartments(departments);
                sora.setAddress(a1);
                em.persist(sora);

                //Employee 
                Employee e = new Employee("Sharon KS", "sharonE", "password");
                e.setEmail("sharonMS.12@gmail.com");
                e.setSalary(4100.0);
                e.setPayType(PayType.MONTHLY);
                e.setJobTitle(adminService.getJobTitleById(Long.valueOf(1))); 
                e.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
                e.setCompany(adminService.getCompanyById(Long.valueOf(1)));
                employeeService.createEmployee(e);


                // Adding Sites
                HeadquartersSite iorahq = new HeadquartersSite("HQ", a1, "123456", "+65-63610056", iora);
                em.persist(iorahq);
                WarehouseSite wh = new WarehouseSite("Warehouse HQ", a1, "123457", "+65-63610056", iora);
                em.persist(wh);
                StoreSite s1 = new StoreSite("iORA @ Bugis Junction", new Address(Country.Singapore, "Singapore",
                                "Bugis Junction", "Singapore", "#01-04", "200 Victoria Street", "Singapore 188021",
                                true, 1.299497,
                                103.855096), "000001", "+65-6338 9363", iora);
                em.persist(s1);
                StoreSite s2 = new StoreSite("iORA @ Citylink Mall", new Address(Country.Singapore, "Singapore",
                                "Citylink Mall", "Singapore", "#0B1-26/A/B", "1 Raffles Link", "Singapore 188021", true,
                                1.292563,
                                103.854874), "000002", "+65-6884 6838", iora);
                em.persist(s2);
                StoreSite s3 = new StoreSite("iORA @ City Square Mall", new Address(Country.Singapore, "Singapore",
                                "City Square Mall", "Singapore", "#01-05", "180 Kitchener Road", "Singapore 208539",
                                true, 1.311796,
                                103.856399), "000003", "+65-6509 8575", iora);
                em.persist(s3);
                StoreSite s4 = new StoreSite("iORA @ Compass One", new Address(Country.Singapore, "Singapore",
                                "Compass One", "Singapore", "#01-10", "1 Sengkang Square", "Singapore 545078", true,
                                1.392318,
                                103.895045), "000004", "+65- 6242 0323", iora);
                em.persist(s4);
                StoreSite s5 = new StoreSite("iORA @ Harbourfront Centre", new Address(Country.Singapore, "Singapore",
                                "Harbourfront Centre", "Singapore", "#02-87/88/89/90/96/98", "1 Maritime Square",
                                "Singapore 099253",
                                true, 1.264279, 103.820543), "000005", "+65-6376 0669", iora);
                em.persist(s5);
                StoreSite s6 = new StoreSite("iORA @ Hillion Mall", new Address(Country.Singapore, "Singapore",
                                "Hillion Mall", "Singapore", "#B1-11/12/13/14", "17 Petir Road", "Singapore 678278",
                                true, 1.378054,
                                103.763355), "000006", "+65-6255 0080", iora);
                em.persist(s6);
                StoreSite s7 = new StoreSite("iORA @ Hougang Mall", new Address(Country.Singapore, "Singapore",
                                "Hougang Mall", "Singapore", "#02-02", "90 Hougang Avenue 10", "Singapore 538766", true,
                                1.372690,
                                103.893967), "000007", "+65-6386 5055", iora);
                em.persist(s7);
                StoreSite s8 = new StoreSite("iORA @ Isetan Wisma Atria", new Address(Country.Singapore, "Singapore",
                                "Wisma Atria", "Singapore", "#01-01", "435 Orchard Road", "Singapore 238877", true,
                                1.304311,
                                103.833358), "000008", "+65-6908 0012", iora);
                em.persist(s8);
                StoreSite s9 = new StoreSite("iORA @ JCube", new Address(Country.Singapore, "Singapore",
                                "JCube", "Singapore", "#01-29/30/31", "2 Jurong Easy Central 1", "Singapore 609731",
                                true, 1.333632,
                                103.740749), "000009", "+65-6262 6011", iora);
                em.persist(s9);
                StoreSite s10 = new StoreSite("iORA @ Junction 8", new Address(Country.Singapore, "Singapore",
                                "Junction 8", "Singapore", "#01-25/26", "9 Bishan Place", "Singapore 579837", true,
                                1.350815,
                                103.848783), "000010", "+65-6694 2212", iora);
                em.persist(s10);
                StoreSite s11 = new StoreSite("iORA @ Northpoint City", new Address(Country.Singapore, "Singapore",
                                "Northpoint City South Wing", "Singapore", "#01-101/102/103", "1 Northpoint Drive",
                                "Singapore 768019",
                                true, 1.429125, 103.835932), "000011", "+65-6235 7611", iora);
                em.persist(s11);
                StoreSite s12 = new StoreSite("iORA @ Oasis Terraces", new Address(Country.Singapore, "Singapore",
                                "Oasis Terraces", "Singapore", "#02-15/16/17/21/22", "Blk 681 Punggol Drive",
                                "Singapore 820681", true,
                                1.402803, 103.913443), "000012", "+65-6244 0800", iora);
                em.persist(s12);
                StoreSite s13 = new StoreSite("iORA @ Suntec City", new Address(Country.Singapore, "Singapore",
                                "Suntec City Tower 3", "Singapore", "#02-424/426", "Temasek Boulevard",
                                "Singapore 038983", true,
                                1.296220, 103.859247), "000013", "+65-6238 8389", iora);
                em.persist(s13);
                StoreSite s14 = new StoreSite("iORA @ The Centrepoint", new Address(Country.Singapore, "Singapore",
                                "The Centrepoint", "Singapore", "#03-37/39", "176 Orchard Road", "Singapore 238846",
                                true, 1.302007,
                                103.839808), "000014", "+65-6836 5163", iora);
                em.persist(s14);
                StoreSite s15 = new StoreSite("iORA @ West Mall", new Address(Country.Singapore, "Singapore",
                                "West Mall", "Singapore", "#01-20/21/22/23", "1 Bukit Batok Central Link",
                                "Singapore 658713", true,
                                1.350193, 103.750014), "000015", "+65-6261 2262", iora);
                em.persist(s15);
                StoreSite s16 = new StoreSite("LALU @ Marina Square", new Address(Country.Singapore, "Singapore",
                                "Marina Square", "Singapore", "#02-304/A", "6 Raffles Boulevard", "Singapore 039594",
                                true, 1.291158,
                                103.857897), "000016", "+65-6333 0118", lalu);
                em.persist(s16);
                StoreSite s17 = new StoreSite("SORA @ Oasis Terraces", new Address(Country.Singapore, "Singapore",
                                "Oasis Terraces", "Singapore", "#02-29/30/31/32/33", "Blk 681 Punggol Drive",
                                "Singapore 820681", true,
                                1.402803, 103.913443), "000017", "+65-6214 3303", sora);
                em.persist(s17);
                StoreSite s18 = new StoreSite("iORA @ 313 Somerset", new Address(Country.Singapore, "Singapore",
                                "313 Somerset", "Singapore", "#03-01 to 08", "313 Orchard Road", "Singapore 238895",
                                true, 1.300869, 103.838461), "000018", "+65-6509 0398", iora);
                em.persist(s18);
                ManufacturingSite m1 = new ManufacturingSite("Factory 1",
                                new Address(Country.China, "Chengdu", "Factory No. 1234", "Sichuan", "04-04",
                                                "1st Street", "12345", true, 30.689753, 103.449317),
                                "345678", "+86 123 456 7890", iora);
                em.persist(m1);

                // Adding birthday points and membership tiers
                Currency rm = new Currency("RM", "Malaysian Ringgit");
                Currency sgd = new Currency("SGD", "Singapore Dollar");
                em.persist(rm);
                em.persist(sgd);

                Map<Currency, Integer> birthday = Map.of(rm, 500, sgd, 200);
                BirthdayPoints bday = new BirthdayPoints("STANDARD", birthday, 1, 2.00);
                em.persist(bday);

                MembershipTier basic = new MembershipTier("BASIC", 0.00, Map.of(rm, 0, sgd, 0), bday);
                MembershipTier silver = new MembershipTier("SILVER", 0.03, Map.of(rm, 500, sgd, 200), bday);
                MembershipTier gold = new MembershipTier("GOLD", 0.05, Map.of(rm, 3000, sgd, 1000), bday);
                MembershipTier diamond = new MembershipTier("DIAMOND", 0.07, Map.of(rm, 7500, sgd, 2500), bday);
                em.persist(basic);
                em.persist(silver);
                em.persist(gold);
                em.persist(diamond);

                /*
                 * // Creating Product Fields
                 * Set<ProductField> productFields = new HashSet<>();
                 * ProductField pf1 = new ProductField("COLOUR", "BLACK");
                 * productService.createProductField(pf1);
                 * productFields.add(pf1);
                 * ProductField pf2 = new ProductField("COLOUR", "GREEN");
                 * productService.createProductField(pf2);
                 * productFields.add(pf2);
                 * ProductField pf3 = new ProductField("COLOUR", "KHAKI");
                 * productService.createProductField(pf3);
                 * productFields.add(pf3);
                 * ProductField pf4 = new ProductField("SIZE", "S");
                 * productService.createProductField(pf4);
                 * productFields.add(pf4);
                 * ProductField pf5 = new ProductField("SIZE", "M");
                 * productService.createProductField(pf5);
                 * productFields.add(pf5);
                 * ProductField pf6 = new ProductField("SIZE", "L");
                 * productService.createProductField(pf6);
                 * productFields.add(pf6);
                 * ProductField pf7 = new ProductField("SIZE", "XL");
                 * productService.createProductField(pf7);
                 * productFields.add(pf7);
                 * ProductField pf8 = new ProductField("TAG", "BOTTOM");
                 * productService.createProductField(pf8);
                 * productFields.add(pf8);
                 * ProductField pf9 = new ProductField("TAG", "SKIRTS");
                 * productService.createProductField(pf9);
                 * productFields.add(pf9);
                 * ProductField pf10 = new ProductField("COMPANY", "IORA");
                 * productService.createProductField(pf10);
                 * productFields.add(pf10);
                 * 
                 * // Add a Model
                 * Model model = new Model("ASK0009968A");
                 * model.setAvailable(true);
                 * model.
                 * setDescription("Front self-tie sash. Back elasticated waistband. Fabric: Polyester"
                 * );
                 * model.setName("Wrapped Shift Skirt");
                 * model.setOnlineOnly(false);
                 * model.setPrice(29);
                 * model.setProductFields(productFields);
                 * try {
                 * productService.createModel(model);
                 * } catch (ModelException ex) {
                 * System.out.println(ex.getMessage());
                 * }
                 * 
                 * // Add Products of the Model
                 * try {
                 * productService.createProduct(model.getModelCode(), new
                 * ArrayList<>(productFields));
                 * } catch (ProductException | ProductFieldException ex) {
                 * ex.printStackTrace();
                 * System.out.println(ex.getMessage());
                 * }
                 * 
                 * // Add Promotion to the Model
                 * try {
                 * productService.addPromoCategory(model.getModelCode(), "2 FOR S$49", 24.5);
                 * } catch (ModelException ex) {
                 * System.out.println(ex.getMessage());
                 * }
                 * 
                 * // Add many productItems of the product
                 * try {
                 * productService.createProductItem("T1ZZ3OA60NOBK18H", "ASK0009968A-1");
                 * productService.createProductItem("NJCTRE9HI281F8B7", "ASK0009968A-2");
                 * productService.createProductItem("1HAC5IJD2Y8R2X4G", "ASK0009968A-3");
                 * productService.createProductItem("ANGA64O891NH0WC4", "ASK0009968A-4");
                 * productService.createProductItem("RBKD1XUUTN8ZVO3Z", "ASK0009968A-5");
                 * productService.createProductItem("T5VWY8V1V8QQUVG1", "ASK0009968A-6");
                 * productService.createProductItem("WQ8ED2RQ83VV1HO2", "ASK0009968A-7");
                 * productService.createProductItem("HAPPYM46XOVU766P", "ASK0009968A-8");
                 * productService.createProductItem("1V76V4FAM2NX90IU", "ASK0009968A-9");
                 * productService.createProductItem("1Z3G165G9DMDGQMD", "ASK0009968A-10");
                 * productService.createProductItem("6AND0X6G25KLNVUE", "ASK0009968A-11");
                 * productService.createProductItem("OZ9O75UATQ8P8QS4", "ASK0009968A-12");
                 * } catch (ProductItemException e) {
                 * e.printStackTrace();
                 * }
                 */

                // Generate 10 $10 vouchers
                customerService.generateVouchers(10, 10, "2022-02-16");

                // Generate 10 $5 vouchers
                customerService.generateVouchers(5, 10, "2022-02-16");
        }

}
