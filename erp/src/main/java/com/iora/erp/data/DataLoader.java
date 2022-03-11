package com.iora.erp.data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.enumeration.AccessRights;
import com.iora.erp.enumeration.Country;
import com.iora.erp.enumeration.PayType;
import com.iora.erp.enumeration.PaymentType;
import com.iora.erp.model.Currency;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;
import com.iora.erp.model.company.Vendor;
import com.iora.erp.model.customer.BirthdayPoints;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.PromotionField;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;
import com.iora.erp.service.AdminService;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;
import com.iora.erp.utils.StringGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

@Component("loader")
@Transactional
public class DataLoader implements CommandLineRunner {

	@Autowired
	private CustomerService customerService;
	@Autowired
	private AdminService adminService;
	@Autowired
	private ProductService productService;
	@Autowired
	private CustomerOrderService customerOrderService;
	@Autowired
	private SiteService siteService;
	@PersistenceContext
	private EntityManager em;
	@Autowired
	private PasswordEncoder passwordEncoder;

	@Override
	public void run(String... args) throws Exception {
		if (em.createQuery("SELECT s FROM Site s", Site.class).getResultList().size() == 0) {
			loadData();
		}
	}

	// Insert Data-Init here
	private void loadData() throws Exception {
		// Singapore
		Address a1 = new Address(Country.Singapore, "Singapore", "Enterprise 10", "Singapore", "NIL",
				"10P Enterprise Road", "Singapore 629840", false, 1.334251, 103.704246);

		em.persist(a1);

		// JobTitles
		Set<AccessRights> ar1 = new HashSet<>();
		ar1.add(AccessRights.SYSADMIN_BASIC);
		ar1.add(AccessRights.SYSADMIN_COMPANY);
		ar1.add(AccessRights.SYSADMIN_EMPLOYEE);
		ar1.add(AccessRights.MARKETING_BASIC);
		ar1.add(AccessRights.MARKETING_MERCHANDISE);
		ar1.add(AccessRights.MARKETING_PROCUREMENT);
		ar1.add(AccessRights.MARKETING_CRM);
		ar1.add(AccessRights.MANUFACTURING_BASIC);
		ar1.add(AccessRights.WAREHOUSE_BASIC);
		ar1.add(AccessRights.WAREHOUSE_ORDER);
		ar1.add(AccessRights.STORE_BASIC);
		ar1.add(AccessRights.STORE_INVENTORY);
		JobTitle jobTitle1 = new JobTitle("IT Admin", "Superuser", ar1);
		em.persist(jobTitle1);

		Set<AccessRights> ar2 = new HashSet<>();
		ar2.add(AccessRights.MARKETING_BASIC);
		ar2.add(AccessRights.MARKETING_MERCHANDISE);
		ar2.add(AccessRights.MARKETING_PROCUREMENT);
		ar2.add(AccessRights.MARKETING_CRM);
		JobTitle jobTitle2 = new JobTitle("Sales", "Sales and Marketing Product", ar2);
		em.persist(jobTitle2);

		Set<AccessRights> ar3 = new HashSet<>();
		ar3.add(AccessRights.MANUFACTURING_BASIC);
		JobTitle jobTitle3 = new JobTitle("Manufacturing Manager", "Managing the products production", ar3);
		em.persist(jobTitle3);

		Set<AccessRights> ar4 = new HashSet<>();
		ar4.add(AccessRights.WAREHOUSE_BASIC);
		ar4.add(AccessRights.WAREHOUSE_ORDER);
		JobTitle jobTitle4 = new JobTitle("Warehouse Manager", "Managing inventory in warehouse", ar4);
		em.persist(jobTitle4);

		Set<AccessRights> ar5 = new HashSet<>();
		ar5.add(AccessRights.STORE_BASIC);
		ar5.add(AccessRights.STORE_INVENTORY);
		JobTitle jobTitle5 = new JobTitle("Store Manager", "Managing the physical store", ar5);
		em.persist(jobTitle5);

		// Departments
		Department adm = new Department("IT");
		List<JobTitle> jt5 = new ArrayList<>();
		jt5.add(jobTitle1);
		adm.setJobTitles(jt5);
		adminService.createDepartment(adm);

		Department sam = new Department("Sales and Marketing");
		List<JobTitle> jt = new ArrayList<>();
		jt.add(jobTitle2);
		sam.setJobTitles(jt);
		adminService.createDepartment(sam);

		Department sam2 = new Department("Online Marketing");
		sam2.setJobTitles(jt);
		adminService.createDepartment(sam2);

		Department mf1 = new Department("Manufacturing");
		List<JobTitle> jt3 = new ArrayList<>();
		jt3.add(jobTitle3);
		mf1.setJobTitles(jt3);
		adminService.createDepartment(mf1);

		Department wh1 = new Department("Warehouse");
		List<JobTitle> jt4 = new ArrayList<>();
		jt4.add(jobTitle4);
		wh1.setJobTitles(jt4);
		adminService.createDepartment(wh1);

		Department store1 = new Department("Storefront");
		List<JobTitle> jt2 = new ArrayList<>();
		jt2.add(jobTitle5);
		store1.setJobTitles(jt2);
		adminService.createDepartment(store1);

		// Vendors
		Address a2 = new Address(Country.Singapore, "Singapore", "Kewalram House", "Singapore", "02-01",
				"8 Jln Kilang Timor", "Singapore 159305", false, 1.334251, 103.704246);
		em.persist(a2);

		List<Address> listAdd = new ArrayList<>();
		listAdd.add(a2);
		Vendor v1 = new Vendor("Ninja Van", "+65 66028271", "Singapore domestic delivery",
				"admin@ninjavan.com");
		em.persist(v1);
		v1.setAddress(listAdd);

		// Companies
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

		
		
		// Employee
		Employee e1 = new Employee("Darth Vader", "darthV", "password");
		e1.setEmail("darth.vader@gmail.com");
		e1.setSalary(5678.90);
		e1.setPayType(PayType.MONTHLY);
		e1.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e1.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e1.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e1.setSalt(StringGenerator.saltGeneration());
		// e1.setPassword(StringGenerator.generateProtectedPassword(e1.getSalt(), "password"));
		e1.setPassword(passwordEncoder.encode("password"));
		em.persist(e1);

		Employee e2 = new Employee("Sharon KS", "sharonE", "password");
		e2.setEmail("sharonMS.12@gmail.com");
		e2.setSalary(4100.0);
		e2.setPayType(PayType.MONTHLY);
		e2.setJobTitle(adminService.getJobTitleById(Long.valueOf(2)));
		e2.setDepartment(adminService.getDepartmentById(Long.valueOf(2)));
		e2.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e2.setSalt(StringGenerator.saltGeneration());
		// e2.setPassword(StringGenerator.generateProtectedPassword(e2.getSalt(), "password"));
		e2.setPassword(passwordEncoder.encode("password"));
		em.persist(e2);

		Employee e3 = new Employee("Manuel Manny", "manu", "password");
		e3.setEmail("MannyManuel@gmail.com");
		e3.setSalary(4300.0);
		e3.setPayType(PayType.MONTHLY);
		e3.setJobTitle(adminService.getJobTitleById(Long.valueOf(3)));
		e3.setDepartment(adminService.getDepartmentById(Long.valueOf(4)));
		e3.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e3.setSalt(StringGenerator.saltGeneration());
		// e3.setPassword(StringGenerator.generateProtectedPassword(e3.getSalt(), "password"));
		e3.setPassword(passwordEncoder.encode("password"));
		em.persist(e3);

		Employee e4 = new Employee("Warren Ho", "warren", "password");
		e4.setEmail("WarrenHoHoHo@gmail.com");
		e4.setSalary(4288.0);
		e4.setPayType(PayType.MONTHLY);
		e4.setJobTitle(adminService.getJobTitleById(Long.valueOf(4)));
		e4.setDepartment(adminService.getDepartmentById(Long.valueOf(5)));
		e4.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e4.setSalt(StringGenerator.saltGeneration());
		// e4.setPassword(StringGenerator.generateProtectedPassword(e4.getSalt(), "password"));
		e4.setPassword(passwordEncoder.encode("password"));
		em.persist(e4);

		Employee e5 = new Employee("Storm", "storm", "password");
		e5.setEmail("storm@gmail.com");
		e5.setSalary(4444.44);
		e5.setPayType(PayType.MONTHLY);
		e5.setJobTitle(adminService.getJobTitleById(Long.valueOf(5)));
		e5.setDepartment(adminService.getDepartmentById(Long.valueOf(6)));
		e5.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e5.setSalt(StringGenerator.saltGeneration());
		// e5.setPassword(StringGenerator.generateProtectedPassword(e5.getSalt(), "password"));
		e5.setPassword(passwordEncoder.encode("password"));
		em.persist(e5);

		Employee e6 = new Employee("Goh Hong Pei", "hongpei", "password");
		e6.setEmail("hongpeiisrandom@gmail.com");
		e6.setSalary(1200.0);
		e6.setPayType(PayType.MONTHLY);
		e6.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e6.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e6.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e6.setSalt(StringGenerator.saltGeneration());
		// e6.setPassword(StringGenerator.generateProtectedPassword(e6.getSalt(), "password"));
		e6.setPassword(passwordEncoder.encode("password"));
		em.persist(e6);

		Employee e7 = new Employee("Delven Wong", "delven", "password");
		e7.setEmail("pengyu_33@msn.com");
		e7.setSalary(1200.0);
		e7.setPayType(PayType.MONTHLY);
		e7.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e7.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e7.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e7.setSalt(StringGenerator.saltGeneration());
		// e7.setPassword(StringGenerator.generateProtectedPassword(e7.getSalt(), "password"));
		e7.setPassword(passwordEncoder.encode("password"));
		em.persist(e7);

		Employee e8 = new Employee("Adeline Tan", "adeline", "password");
		e8.setEmail("tan.adelinejy@gmail.com");
		e8.setSalary(1200.0);
		e8.setPayType(PayType.MONTHLY);
		e8.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e8.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e8.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e8.setSalt(StringGenerator.saltGeneration());
		// e8.setPassword(StringGenerator.generateProtectedPassword(e8.getSalt(), "password"));
		e8.setPassword(passwordEncoder.encode("password"));
		em.persist(e8);

		Employee e9 = new Employee("Louis Misson", "louis", "password");
		e9.setEmail("louismisson8@gmail.com");
		e9.setSalary(1200.0);
		e9.setPayType(PayType.MONTHLY);
		e9.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e9.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e9.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e9.setSalt(StringGenerator.saltGeneration());
		// e9.setPassword(StringGenerator.generateProtectedPassword(e9.getSalt(), "password"));
		e9.setPassword(passwordEncoder.encode("password"));
		em.persist(e9);

		Employee e10 = new Employee("Remus Kwan", "remus", "password");
		e10.setEmail("remuskwan23@gmail.com");
		e10.setSalary(1200.0);
		e10.setPayType(PayType.MONTHLY);
		e10.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e10.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e10.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e10.setSalt(StringGenerator.saltGeneration());
		// e10.setPassword(StringGenerator.generateProtectedPassword(e10.getSalt(), "password"));
		e10.setPassword(passwordEncoder.encode("password"));
		em.persist(e10);

		Employee e11 = new Employee("Ruth Chong", "ruth", "password");
		e11.setEmail("ruth.cjn@gmail.com");
		e11.setSalary(1200.0);
		e11.setPayType(PayType.MONTHLY);
		e11.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e11.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e11.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		// e11.setSalt(StringGenerator.saltGeneration());
		// e11.setPassword(StringGenerator.generateProtectedPassword(e11.getSalt(), "password"));
		e11.setPassword(passwordEncoder.encode("password"));
		em.persist(e11);

		// Adding Sites
		HeadquartersSite iorahq = new HeadquartersSite("HQ", a1, "123456", "+65-63610056", iora);
		em.persist(iorahq);
		WarehouseSite wh = new WarehouseSite("Warehouse HQ", a1, "123457", "+65-63610056", iora);
		em.persist(wh);
		WarehouseSite who = new WarehouseSite("Warehouse HQ-Online", a1, "123458", "+65-63610056", iora);
		em.persist(who);
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
		Currency rm = new Currency("RM", "Malaysian Ringgit", Country.Malaysia);
		Currency sgd = new Currency("SGD", "Singapore Dollar", Country.Singapore);
		em.persist(rm);
		em.persist(sgd);

		BirthdayPoints bday = new BirthdayPoints("STANDARD", sgd, 200, 1, 2.00);
		em.persist(bday);

		MembershipTier basic = new MembershipTier("BASIC", 0.00, sgd, 0, bday);
		MembershipTier silver = new MembershipTier("SILVER", 0.03, sgd, 200, bday);
		MembershipTier gold = new MembershipTier("GOLD", 0.05, sgd, 1000, bday);
		MembershipTier diamond = new MembershipTier("DIAMOND", 0.07, sgd, 2500, bday);
		em.persist(basic);
		em.persist(silver);
		em.persist(gold);
		em.persist(diamond);

		// Customer
		Customer c1 = new Customer("Goh", "Hong Pei");
		c1.setContactNumber("83940775");
		c1.setDob(LocalDate.of(2000, 1, 1));
		c1.setEmail("hongpeiisrandom@gmail.com");
		c1.sethashPass("password");
		customerService.createCustomerAccount(c1);

		Customer c2 = new Customer("Delven", "Wong");
		c2.setContactNumber("92711363");
		c2.setDob(LocalDate.of(2000, 1, 1));
		c2.setEmail("pengyu_33@msn.com");
		c2.sethashPass("password");
		customerService.createCustomerAccount(c2);

		Customer c3 = new Customer("Adeline", "Tan");
		c3.setContactNumber("93834898");
		c3.setDob(LocalDate.of(2000, 1, 1));
		c3.setEmail("tan.adelinejy@gmail.com");
		c3.sethashPass("password");
		customerService.createCustomerAccount(c3);

		Customer c4 = new Customer("Louis", "Misson");
		c4.setContactNumber("98550432");
		c4.setDob(LocalDate.of(2000, 1, 1));
		c4.setEmail("louismisson8@gmail.com");
		c4.sethashPass("password");
		customerService.createCustomerAccount(c4);

		Customer c5 = new Customer("Remus", "Kwan");
		c5.setContactNumber("90556630");
		c5.setDob(LocalDate.of(2000, 1, 1));
		c5.setEmail("remuskwan23@gmail.com");
		c5.sethashPass("password");
		customerService.createCustomerAccount(c5);

		Customer c6 = new Customer("Ruth", "Chong");
		c6.setContactNumber("86065278");
		c6.setDob(LocalDate.of(2000, 1, 1));
		c6.setEmail("ruth.cjn@gmail.com");
		c6.sethashPass("password");
		customerService.createCustomerAccount(c6);

		Customer c7 = new Customer("Steven", "Lim");
		c7.setContactNumber("91234567");
		c7.setDob(LocalDate.of(2000, 1, 1));
		c7.setEmail("stevenlim@gmail.com");
		c7.sethashPass("password");
		customerService.createCustomerAccount(c7);

		// Generate 10 $10 vouchers
		customerService.generateVouchers(10, 10, "2022-02-16");

		// Generate 10 $5 vouchers
		customerService.generateVouchers(5, 10, "2022-02-16");

		// emailService.sendSimpleMessage("pengyu_33@msn.com", "testing testing", "this is sent by Spring Boot Framework :D");

		PromotionField pf1 = new PromotionField("category", "2 FOR S$ 29", 2, List.of(0.00, 0.00), List.of(14.5, 14.5), false, false, true);
		PromotionField pf2 = new PromotionField("category", "2 FOR S$ 49", 2, List.of(0.00, 0.00), List.of(24.5, 24.5), false, false, true);
		em.persist(pf1);
		em.persist(pf2);
	}

	@SuppressWarnings("unchecked")
	public void loadProducts(List<Object> productsJSON) throws Exception {
        for (Object j : productsJSON) {
            LinkedHashMap<Object, Object> hashMap = (LinkedHashMap<Object, Object>) j;
            List<Object> json = hashMap.values().stream().collect(Collectors.toList());
            // Decoding JSON Object
            String name = (String) json.get(0);
            String modelCode = (String) json.get(1);
            String description = (String) json.get(2);
            List<String> colours = (ArrayList<String>) json.get(3);
            List<String> sizes = (ArrayList<String>) json.get(4);
            String company = (String) json.get(5);
            List<String> tags = (ArrayList<String>) json.get(6);
            List<String> categories = (ArrayList<String>) json.get(7);

            LinkedHashMap<Object, Object> priceMap = (LinkedHashMap<Object, Object>) json.get(8);
            List<Object> priceList = (ArrayList<Object>) priceMap.values().stream().collect(Collectors.toList());
            double listPrice = Double.parseDouble((String) priceList.get(0));

            LinkedHashMap<Object, Object> discountedPriceMap = (LinkedHashMap<Object, Object>) json.get(9);
            List<Object> discountedPriceList = (ArrayList<Object>) discountedPriceMap.values().stream()
                    .collect(Collectors.toList());
            double discountPrice = discountedPriceList.isEmpty() ? listPrice
                    : Double.parseDouble((String) discountedPriceList.get(0));

            Model model = new Model(modelCode, name, description, listPrice, discountPrice,
                    categories.contains("SALE FROM $10"), true);
            List<ProductField> productFields = new ArrayList<>();

            for (String c : colours) {
                ProductField colour = productService.createProductField("colour", c);
                model.addProductField(colour);
                productFields.add(colour);
            }

            for (String s : sizes) {
                ProductField size = productService.createProductField("size", s);
                model.addProductField(size);
                productFields.add(size);
            }

            ProductField com = productService.createProductField("company", company);
            model.addProductField(com);
            productFields.add(com);

            for (String t : tags) {
                ProductField tag = productService.createProductField("tag", t);
                model.addProductField(tag);
                productFields.add(tag);
            }

            for (String cat : categories) {
                if (cat.contains("S$")) {
                    ProductField category = productService.getPromoField("category", cat);
                    model.addProductField(category);
                    productFields.add(category);
                }
            }
            em.persist(model);
            productService.createProduct(modelCode, productFields);
        }

        List<Product> products = productService.searchProductsBySKU(null);
        for (Product p : products) {
            Random r = new Random();
            int stockLevel = r.nextInt(7) + 3;

            for (int i = 0; i < stockLevel; i++) {
                String rfid = StringGenerator.generateRFID(p.getSku());
                productService.createProductItem(rfid, p.getSku());
            }
            siteService.addProducts(Long.valueOf(r.nextInt(21)) + 1, p.getSku(), stockLevel);
        }

        // Customer Order
        CustomerOrderLI coli1 = new CustomerOrderLI();
        coli1.setProduct(productService.getProduct("BPD0010528A-1"));
        coli1.setQty(2);
        coli1.setSubTotal(98.0);
        customerOrderService.createCustomerOrderLI(coli1);

        CustomerOrderLI coli2 = new CustomerOrderLI();
        coli2.setProduct(productService.getProduct("BPS0009808X-1"));
        coli2.setQty(1);
        coli2.setSubTotal(29.0);
        customerOrderService.createCustomerOrderLI(coli2);

        CustomerOrderLI coli3 = new CustomerOrderLI();
        coli3.setProduct(productService.getProduct("BSK0009530X-1"));
        coli3.setQty(1);
        coli3.setSubTotal(29.0);
        customerOrderService.createCustomerOrderLI(coli3);

        CustomerOrderLI coli4 = new CustomerOrderLI();
        coli4.setProduct(productService.getProduct("BPD0010304X-1"));
        coli4.setQty(1);
        coli4.setSubTotal(49.0);
        customerOrderService.createCustomerOrderLI(coli4);

        Payment payment1 = new Payment(127, "241563", PaymentType.VISA);
        customerOrderService.createPayment(payment1);

        Payment payment2 = new Payment(78, "546130", PaymentType.MASTERCARD);
        customerOrderService.createPayment(payment2);

        CustomerOrder co1 = new CustomerOrder();
        co1.setDateTime(LocalDateTime.parse("2022-02-10 13:34", DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
        co1.addLineItem(coli1);
        co1.addLineItem(coli2);
        co1.addPayment(payment1);
        co1.setPaid(true);
        co1.setSite(siteService.getSite(4L));
        em.persist(co1);

        OnlineOrder oo1 = new OnlineOrder(false, Country.Singapore);
        oo1.setCustomerId(2L);
        oo1.setPickupSite((StoreSite) siteService.getSite(4L));
        oo1.addLineItem(coli3);
        oo1.addLineItem(coli4);
        oo1.setPaid(true);
        oo1.addPayment(payment2);
        oo1.setSite(siteService.getSite(3L));
        em.persist(oo1);
    }

}
