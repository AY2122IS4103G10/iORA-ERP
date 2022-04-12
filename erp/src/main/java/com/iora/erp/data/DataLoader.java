package com.iora.erp.data;

import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;
import java.util.Map;
import java.util.HashMap;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.enumeration.AccessRightsEnum;
import com.iora.erp.enumeration.CountryEnum;
import com.iora.erp.enumeration.PayTypeEnum;
import com.iora.erp.enumeration.PaymentTypeEnum;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;
import com.iora.erp.model.company.Vendor;
import com.iora.erp.model.customer.BirthdayPoints;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.SupportTicket;
import com.iora.erp.model.customer.SupportTicketMsg;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.DeliveryAddress;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrderLI;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.PromotionField;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;
import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.model.stockTransfer.StockTransferOrderLI;
import com.iora.erp.service.AdminService;
import com.iora.erp.service.CustomerOrderService;
import com.iora.erp.service.CustomerService;
import com.iora.erp.service.ProcurementService;
import com.iora.erp.service.ProductService;
import com.iora.erp.service.SiteService;
import com.iora.erp.service.StockTransferService;

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
	private ProcurementService procurementService;
	@Autowired
	private StockTransferService stockTransferService;
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

	// Data Initialisation
	private void loadData() throws Exception {
		// Singapore
		Address a1 = new Address(CountryEnum.Singapore, "Singapore", "Enterprise 10", "Singapore", "NIL",
				"10P Enterprise Road", "Singapore 629840", false, 1.334251, 103.704246);

		em.persist(a1);

		// JobTitles
		Set<AccessRightsEnum> ar1 = new HashSet<>();
		ar1.add(AccessRightsEnum.SYSADMIN_BASIC);
		ar1.add(AccessRightsEnum.SYSADMIN_COMPANY);
		ar1.add(AccessRightsEnum.SYSADMIN_EMPLOYEE);
		ar1.add(AccessRightsEnum.MARKETING_BASIC);
		ar1.add(AccessRightsEnum.MARKETING_MERCHANDISE);
		ar1.add(AccessRightsEnum.MARKETING_PROCUREMENT);
		ar1.add(AccessRightsEnum.MARKETING_CRM);
		ar1.add(AccessRightsEnum.MANUFACTURING_BASIC);
		ar1.add(AccessRightsEnum.WAREHOUSE_BASIC);
		ar1.add(AccessRightsEnum.WAREHOUSE_ORDER);
		ar1.add(AccessRightsEnum.STORE_BASIC);
		ar1.add(AccessRightsEnum.STORE_INVENTORY);
		ar1.add(AccessRightsEnum.LOGISTICS_BASIC);
		JobTitle jobTitle1 = new JobTitle("IT Admin", "Superuser", ar1);
		em.persist(jobTitle1);

		Set<AccessRightsEnum> ar2 = new HashSet<>();
		ar2.add(AccessRightsEnum.MARKETING_BASIC);
		ar2.add(AccessRightsEnum.MARKETING_MERCHANDISE);
		ar2.add(AccessRightsEnum.MARKETING_PROCUREMENT);
		ar2.add(AccessRightsEnum.MARKETING_CRM);
		JobTitle jobTitle2 = new JobTitle("Sales", "Sales and Marketing Product", ar2);
		em.persist(jobTitle2);

		Set<AccessRightsEnum> ar3 = new HashSet<>();
		ar3.add(AccessRightsEnum.MANUFACTURING_BASIC);
		JobTitle jobTitle3 = new JobTitle("Manufacturing Manager", "Managing the products production", ar3);
		em.persist(jobTitle3);

		Set<AccessRightsEnum> ar4 = new HashSet<>();
		ar4.add(AccessRightsEnum.WAREHOUSE_BASIC);
		ar4.add(AccessRightsEnum.WAREHOUSE_ORDER);
		JobTitle jobTitle4 = new JobTitle("Warehouse Manager", "Managing inventory in warehouse", ar4);
		em.persist(jobTitle4);

		Set<AccessRightsEnum> ar5 = new HashSet<>();
		ar5.add(AccessRightsEnum.STORE_BASIC);
		ar5.add(AccessRightsEnum.STORE_INVENTORY);
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
		Address a2 = new Address(CountryEnum.Singapore, "Singapore", "Kewalram House", "Singapore", "02-01",
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
		e1.setEmail("iorasalesmail@gmail.com");
		e1.setSalary(5678.90);
		e1.setPayType(PayTypeEnum.MONTHLY);
		e1.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e1.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e1.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e1.setPassword(passwordEncoder.encode("password"));
		em.persist(e1);

		Employee e2 = new Employee("Sharon KS", "sharonE", "password");
		e2.setEmail("iorasalesmail@gmail.com");
		e2.setSalary(4100.0);
		e2.setPayType(PayTypeEnum.MONTHLY);
		e2.setJobTitle(adminService.getJobTitleById(Long.valueOf(2)));
		e2.setDepartment(adminService.getDepartmentById(Long.valueOf(2)));
		e2.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e2.setPassword(passwordEncoder.encode("password"));
		em.persist(e2);

		Employee e3 = new Employee("Manuel Manny", "manu", "password");
		e3.setEmail("iorasalesmail@gmail.com");
		e3.setSalary(4300.0);
		e3.setPayType(PayTypeEnum.MONTHLY);
		e3.setJobTitle(adminService.getJobTitleById(Long.valueOf(3)));
		e3.setDepartment(adminService.getDepartmentById(Long.valueOf(4)));
		e3.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e3.setPassword(passwordEncoder.encode("password"));
		em.persist(e3);

		Employee e4 = new Employee("Warren Ho", "warren", "password");
		e4.setEmail("iorasalesmail@gmail.com");
		e4.setSalary(4288.0);
		e4.setPayType(PayTypeEnum.MONTHLY);
		e4.setJobTitle(adminService.getJobTitleById(Long.valueOf(4)));
		e4.setDepartment(adminService.getDepartmentById(Long.valueOf(5)));
		e4.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e4.setPassword(passwordEncoder.encode("password"));
		em.persist(e4);

		Employee e5 = new Employee("Storm", "storm", "password");
		e5.setEmail("iorasalesmail@gmail.com");
		e5.setSalary(4444.44);
		e5.setPayType(PayTypeEnum.MONTHLY);
		e5.setJobTitle(adminService.getJobTitleById(Long.valueOf(5)));
		e5.setDepartment(adminService.getDepartmentById(Long.valueOf(6)));
		e5.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e5.setPassword(passwordEncoder.encode("password"));
		em.persist(e5);

		Employee e6 = new Employee("Goh Hong Pei", "hongpei", "password");
		e6.setEmail("hongpeiisrandom@gmail.com");
		e6.setSalary(1200.0);
		e6.setPayType(PayTypeEnum.MONTHLY);
		e6.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e6.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e6.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e6.setPassword(passwordEncoder.encode("password"));
		em.persist(e6);

		Employee e7 = new Employee("Delven Wong", "delven", "password");
		e7.setEmail("pengyu_33@msn.com");
		e7.setSalary(1200.0);
		e7.setPayType(PayTypeEnum.MONTHLY);
		e7.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e7.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e7.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e7.setPassword(passwordEncoder.encode("password"));
		em.persist(e7);

		Employee e8 = new Employee("Adeline Tan", "adeline", "password");
		e8.setEmail("tan.adelinejy@gmail.com");
		e8.setSalary(1200.0);
		e8.setPayType(PayTypeEnum.MONTHLY);
		e8.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e8.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e8.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e8.setPassword(passwordEncoder.encode("password"));
		em.persist(e8);

		Employee e9 = new Employee("Louis Misson", "louis", "password");
		e9.setEmail("louismisson8@gmail.com");
		e9.setSalary(1200.0);
		e9.setPayType(PayTypeEnum.MONTHLY);
		e9.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e9.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e9.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e9.setPassword(passwordEncoder.encode("password"));
		em.persist(e9);

		Employee e10 = new Employee("Remus Kwan", "remus", "password");
		e10.setEmail("remuskwan23@gmail.com");
		e10.setSalary(1200.0);
		e10.setPayType(PayTypeEnum.MONTHLY);
		e10.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e10.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e10.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e10.setPassword(passwordEncoder.encode("password"));
		em.persist(e10);

		Employee e11 = new Employee("Ruth Chong", "ruth", "password");
		e11.setEmail("ruth.cjn@gmail.com");
		e11.setSalary(1200.0);
		e11.setPayType(PayTypeEnum.MONTHLY);
		e11.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e11.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e11.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e11.setPassword(passwordEncoder.encode("password"));
		em.persist(e11);

		// Adding Sites
		HeadquartersSite iorahq = new HeadquartersSite("HQ", a1, "123456", "+65-63610056", iora);
		em.persist(iorahq);
		WarehouseSite wh = new WarehouseSite("Warehouse HQ", a1, "123457", "+65-63610056", iora);
		em.persist(wh);
		WarehouseSite who = new WarehouseSite("Warehouse HQ-Online", a1, "123458", "+65-63610056", iora);
		em.persist(who);
		StoreSite s1 = new StoreSite("iORA @ Bugis Junction", new Address(CountryEnum.Singapore, "Singapore",
				"Bugis Junction", "Singapore", "#01-04", "200 Victoria Street", "Singapore 188021",
				true, 1.299497,
				103.855096), "000001", "+65-6338 9363", iora);
		em.persist(s1);
		StoreSite s2 = new StoreSite("iORA @ Citylink Mall", new Address(CountryEnum.Singapore, "Singapore",
				"Citylink Mall", "Singapore", "#0B1-26/A/B", "1 Raffles Link", "Singapore 188021", true,
				1.292563,
				103.854874), "000002", "+65-6884 6838", iora);
		em.persist(s2);
		StoreSite s3 = new StoreSite("iORA @ City Square Mall", new Address(CountryEnum.Singapore, "Singapore",
				"City Square Mall", "Singapore", "#01-05", "180 Kitchener Road", "Singapore 208539",
				true, 1.311796,
				103.856399), "000003", "+65-6509 8575", iora);
		em.persist(s3);
		StoreSite s4 = new StoreSite("iORA @ Compass One", new Address(CountryEnum.Singapore, "Singapore",
				"Compass One", "Singapore", "#01-10", "1 Sengkang Square", "Singapore 545078", true,
				1.392318,
				103.895045), "000004", "+65- 6242 0323", iora);
		em.persist(s4);
		StoreSite s5 = new StoreSite("iORA @ Harbourfront Centre", new Address(CountryEnum.Singapore, "Singapore",
				"Harbourfront Centre", "Singapore", "#02-87/88/89/90/96/98", "1 Maritime Square",
				"Singapore 099253",
				true, 1.264279, 103.820543), "000005", "+65-6376 0669", iora);
		em.persist(s5);
		StoreSite s6 = new StoreSite("iORA @ Hillion Mall", new Address(CountryEnum.Singapore, "Singapore",
				"Hillion Mall", "Singapore", "#B1-11/12/13/14", "17 Petir Road", "Singapore 678278",
				true, 1.378054,
				103.763355), "000006", "+65-6255 0080", iora);
		em.persist(s6);
		StoreSite s7 = new StoreSite("iORA @ Hougang Mall", new Address(CountryEnum.Singapore, "Singapore",
				"Hougang Mall", "Singapore", "#02-02", "90 Hougang Avenue 10", "Singapore 538766", true,
				1.372690,
				103.893967), "000007", "+65-6386 5055", iora);
		em.persist(s7);
		StoreSite s8 = new StoreSite("iORA @ Isetan Wisma Atria", new Address(CountryEnum.Singapore, "Singapore",
				"Wisma Atria", "Singapore", "#01-01", "435 Orchard Road", "Singapore 238877", true,
				1.304311,
				103.833358), "000008", "+65-6908 0012", iora);
		em.persist(s8);
		StoreSite s9 = new StoreSite("iORA @ JCube", new Address(CountryEnum.Singapore, "Singapore",
				"JCube", "Singapore", "#01-29/30/31", "2 Jurong Easy Central 1", "Singapore 609731",
				true, 1.333632,
				103.740749), "000009", "+65-6262 6011", iora);
		em.persist(s9);
		StoreSite s10 = new StoreSite("iORA @ Junction 8", new Address(CountryEnum.Singapore, "Singapore",
				"Junction 8", "Singapore", "#01-25/26", "9 Bishan Place", "Singapore 579837", true,
				1.350815,
				103.848783), "000010", "+65-6694 2212", iora);
		em.persist(s10);
		StoreSite s11 = new StoreSite("iORA @ Northpoint City", new Address(CountryEnum.Singapore, "Singapore",
				"Northpoint City South Wing", "Singapore", "#01-101/102/103", "1 Northpoint Drive",
				"Singapore 768019",
				true, 1.429125, 103.835932), "000011", "+65-6235 7611", iora);
		em.persist(s11);
		StoreSite s12 = new StoreSite("iORA @ Oasis Terraces", new Address(CountryEnum.Singapore, "Singapore",
				"Oasis Terraces", "Singapore", "#02-15/16/17/21/22", "Blk 681 Punggol Drive",
				"Singapore 820681", true,
				1.402803, 103.913443), "000012", "+65-6244 0800", iora);
		em.persist(s12);
		StoreSite s13 = new StoreSite("iORA @ Suntec City", new Address(CountryEnum.Singapore, "Singapore",
				"Suntec City Tower 3", "Singapore", "#02-424/426", "Temasek Boulevard",
				"Singapore 038983", true,
				1.296220, 103.859247), "000013", "+65-6238 8389", iora);
		em.persist(s13);
		StoreSite s14 = new StoreSite("iORA @ The Centrepoint", new Address(CountryEnum.Singapore, "Singapore",
				"The Centrepoint", "Singapore", "#03-37/39", "176 Orchard Road", "Singapore 238846",
				true, 1.302007,
				103.839808), "000014", "+65-6836 5163", iora);
		em.persist(s14);
		StoreSite s15 = new StoreSite("iORA @ West Mall", new Address(CountryEnum.Singapore, "Singapore",
				"West Mall", "Singapore", "#01-20/21/22/23", "1 Bukit Batok Central Link",
				"Singapore 658713", true,
				1.350193, 103.750014), "000015", "+65-6261 2262", iora);
		em.persist(s15);
		StoreSite s16 = new StoreSite("LALU @ Marina Square", new Address(CountryEnum.Singapore, "Singapore",
				"Marina Square", "Singapore", "#02-304/A", "6 Raffles Boulevard", "Singapore 039594",
				true, 1.291158,
				103.857897), "000016", "+65-6333 0118", lalu);
		em.persist(s16);
		StoreSite s17 = new StoreSite("SORA @ Oasis Terraces", new Address(CountryEnum.Singapore, "Singapore",
				"Oasis Terraces", "Singapore", "#02-29/30/31/32/33", "Blk 681 Punggol Drive",
				"Singapore 820681", true,
				1.402803, 103.913443), "000017", "+65-6214 3303", sora);
		em.persist(s17);
		StoreSite s18 = new StoreSite("iORA @ 313 Somerset", new Address(CountryEnum.Singapore, "Singapore",
				"313 Somerset", "Singapore", "#03-01 to 08", "313 Orchard Road", "Singapore 238895",
				true, 1.300869, 103.838461), "000018", "+65-6509 0398", iora);
		em.persist(s18);
		ManufacturingSite m1 = new ManufacturingSite("Factory 1",
				new Address(CountryEnum.China, "Chengdu", "Factory No. 1234", "Sichuan", "04-04",
						"1st Street", "12345", true, 30.689753, 103.449317),
				"345678", "+86 123 456 7890", iora);
		em.persist(m1);

		// Adding birthday points and membership tiers
		BirthdayPoints bday = new BirthdayPoints("STANDARD", 200, 1, 2.00);
		em.persist(bday);

		MembershipTier basic = new MembershipTier("BASIC", 0.00, 0, bday);
		MembershipTier silver = new MembershipTier("SILVER", 0.03, 200, bday);
		MembershipTier gold = new MembershipTier("GOLD", 0.05, 1000, bday);
		MembershipTier diamond = new MembershipTier("DIAMOND", 0.07, 2500, bday);
		em.persist(basic);
		em.persist(silver);
		em.persist(gold);
		em.persist(diamond);

		// Customer
		Customer c1 = new Customer("Goh", "Hong Pei");
		c1.setContactNumber("83940775");
		c1.setDob(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
		c1.setEmail("hongpeiisrandom@gmail.com");
		c1.setPassword("password");
		Customer cc1 = customerService.createCustomerAccount(c1);
		DeliveryAddress da1 = new DeliveryAddress("HongPei", "313 Sembawang Drive", "#12-220", "Singapore", "750313",
				"",
				CountryEnum.Singapore,
				"83940775");
		em.persist(da1);
		cc1.setAddress(da1);

		Customer c2 = new Customer("Delven", "Wong");
		c2.setContactNumber("92711363");
		c2.setDob(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
		c2.setEmail("pengyu_33@msn.com");
		c2.setPassword("password");
		c2.setMembershipPoints(200d);
		Customer cc2 = customerService.createCustomerAccount(c2);
		DeliveryAddress da2 = new DeliveryAddress("Remus", "252 Jurong East Street 24", "#02-120", "Singapore",
				"600252", "",
				CountryEnum.Singapore,
				"92711363");
		em.persist(da2);
		cc2.setAddress(da2);

		Customer c3 = new Customer("Adeline", "Tan");
		c3.setContactNumber("93834898");
		c3.setDob(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
		c3.setEmail("tan.adelinejy@gmail.com");
		c3.setPassword("password");
		Customer cc3 = customerService.createCustomerAccount(c3);
		DeliveryAddress da3 = new DeliveryAddress("Ade", "413 Serangoon Central", "#06-260", "Singapore", "550413", "",
				CountryEnum.Singapore,
				"93834898");
		em.persist(da3);
		cc3.setAddress(da3);

		Customer c4 = new Customer("Louis", "Misson");
		c4.setContactNumber("98550432");
		c4.setDob(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
		c4.setEmail("louismisson8@gmail.com");
		c4.setPassword("password");
		Customer cc4 = customerService.createCustomerAccount(c4);
		DeliveryAddress da4 = new DeliveryAddress("Louis", "307 Clementi Avenue 4", "#10-180", "Singapore", "120307",
				"",
				CountryEnum.Singapore,
				"98550432");
		em.persist(da4);
		cc4.setAddress(da4);

		Customer c5 = new Customer("Remus", "Kwan");
		c5.setContactNumber("90556630");
		c5.setDob(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
		c5.setEmail("remuskwan23@gmail.com");
		c5.setPassword("password");
		Customer cc5 = customerService.createCustomerAccount(c5);
		DeliveryAddress da5 = new DeliveryAddress("Remus", "75A Redhill Rd, Block 75A", "#15-210", "Singapore",
				"151075", "",
				CountryEnum.Singapore,
				"90556630");
		em.persist(da5);
		cc5.setAddress(da5);

		Customer c6 = new Customer("Ruth", "Chong");
		c6.setContactNumber("86065278");
		c6.setDob(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
		c6.setEmail("ruth.cjn@gmail.com");
		c6.setPassword("password");
		Customer cc6 = customerService.createCustomerAccount(c6);
		DeliveryAddress da6 = new DeliveryAddress("Ruth", "503 Hougang Ave 8, Block 503", "#16-320", "Singapore",
				"530503", "",
				CountryEnum.Singapore,
				"86065278");
		em.persist(da6);
		cc6.setAddress(da6);

		Customer c7 = new Customer("Steven", "Lim");
		c7.setContactNumber("91234567");
		c7.setDob(new SimpleDateFormat("yyyy-MM-dd").parse("2000-01-01"));
		c7.setEmail("iorasalesmail@gmail.com");
		c7.setPassword("password");
		customerService.createCustomerAccount(c7);

		// Generate 10 $10 vouchers
		customerService.generateVouchers("dataLoader", 10d, new SimpleDateFormat("yyyy-MM-dd").parse("2024-04-17"),
				null, 10);

		// Generate 10 $5 vouchers
		customerService.generateVouchers("dataLoader", 5d, new SimpleDateFormat("yyyy-MM-dd").parse("2024-04-17"), null,
				10);

		// Adding Promotions
		PromotionField pf1 = new PromotionField("category", "2 FOR S$ 29", 2, List.of(0.00, 0.00), List.of(14.5, 14.5),
				false, false, true);
		PromotionField pf2 = new PromotionField("category", "2 FOR S$ 49", 2, List.of(0.00, 0.00), List.of(24.5, 24.5),
				false, false, true);
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
			List<String> tags = (ArrayList<String>) json.get(5);
			String company = (String) json.get(6);
			List<String> categories = (ArrayList<String>) json.get(7);
			List<String> imageLinks = (ArrayList<String>) json.get(10);

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
			model.setImageLinks(imageLinks);
			productService.createModel(model);
		}

		Random r = new Random();
		for (Product p : productService.searchProductsBySKU(null)) {
			siteService.addProducts(3L, p.getSku(), 5);
			siteService.addProducts((long) r.nextInt(20) + 2, p.getSku(), r.nextInt(5) + 10);
		}

		// ProcurementOrders
		Map<Long, Integer> siteQ1 = new HashMap<>();
		siteQ1.put(4L, 25);
		siteQ1.put(5L, 25);
		ProcurementOrderLI poli1 = new ProcurementOrderLI(productService.getProduct("BBV0010201H-1"), siteQ1);
		poli1.setCostPrice(1d);
		em.persist(poli1);
		Map<Long, Integer> siteQ2 = new HashMap<>();
		siteQ2.put(4L, 15);
		siteQ2.put(5L, 15);
		ProcurementOrderLI poli2 = new ProcurementOrderLI(productService.getProduct("ASK0009709Y-2"), siteQ2);
		poli2.setCostPrice(1d);
		em.persist(poli2);
		Map<Long, Integer> siteQ3 = new HashMap<>();
		siteQ3.put(4L, 10);
		siteQ3.put(5L, 15);
		ProcurementOrderLI poli3 = new ProcurementOrderLI(productService.getProduct("AKB0009339J-3"), siteQ3);
		poli3.setCostPrice(1d);
		em.persist(poli3);
		Map<Long, Integer> siteQ4 = new HashMap<>();
		siteQ4.put(4L, 40);
		siteQ4.put(5L, 35);
		ProcurementOrderLI poli4 = new ProcurementOrderLI(productService.getProduct("ASK0007868Y-1"), siteQ4);
		poli4.setCostPrice(1d);
		em.persist(poli4);
		Map<Long, Integer> siteQ5 = new HashMap<>();
		siteQ5.put(4L, 35);
		siteQ5.put(5L, 35);
		ProcurementOrderLI poli5 = new ProcurementOrderLI(productService.getProduct("ASK0008072Y-2"), siteQ5);
		poli5.setCostPrice(1d);
		em.persist(poli5);
		Map<Long, Integer> siteQ6 = new HashMap<>();
		siteQ6.put(4L, 20);
		siteQ6.put(5L, 20);
		ProcurementOrderLI poli6 = new ProcurementOrderLI(productService.getProduct("ASK0008072Y-1"), siteQ6);
		poli6.setCostPrice(1d);
		em.persist(poli6);
		Map<Long, Integer> siteQ7 = new HashMap<>();
		siteQ7.put(4L, 15);
		siteQ7.put(5L, 15);
		ProcurementOrderLI poli7 = new ProcurementOrderLI(productService.getProduct("AB0008084Y-A-2"), siteQ7);
		poli7.setCostPrice(1d);
		em.persist(poli7);
		Map<Long, Integer> siteQ8 = new HashMap<>();
		siteQ8.put(4L, 13);
		siteQ8.put(5L, 12);
		ProcurementOrderLI poli8 = new ProcurementOrderLI(productService.getProduct("AB0008084Y-A-3"), siteQ8);
		poli8.setCostPrice(1d);
		em.persist(poli8);
		Map<Long, Integer> siteQ9 = new HashMap<>();
		siteQ9.put(4L, 20);
		siteQ9.put(5L, 15);
		ProcurementOrderLI poli9 = new ProcurementOrderLI(productService.getProduct("AB0008084Y-A-4"), siteQ9);
		poli9.setCostPrice(1d);
		em.persist(poli9);

		ProcurementOrder po1 = new ProcurementOrder();
		po1.setHeadquarters(siteService.getSite(1L));
		po1.setManufacturing(siteService.getSite(22L));
		po1.setWarehouse(siteService.getSite(2L));
		po1.setNotes("Please pack into boxes of 5.");
		po1.addLineItem(poli1);
		po1.addLineItem(poli2);
		po1.addLineItem(poli3);
		procurementService.createProcurementOrder(po1, 1L);

		ProcurementOrder po2 = new ProcurementOrder();
		po2.setHeadquarters(siteService.getSite(1L));
		po2.setManufacturing(siteService.getSite(22L));
		po2.setWarehouse(siteService.getSite(2L));
		po2.setNotes("No requirements in packing.");
		po2.addLineItem(poli4);
		po2.addLineItem(poli5);
		procurementService.createProcurementOrder(po2, 1L);

		ProcurementOrder po3 = new ProcurementOrder();
		po3.setHeadquarters(siteService.getSite(1L));
		po3.setManufacturing(siteService.getSite(22L));
		po3.setWarehouse(siteService.getSite(2L));
		po3.setNotes("Stay safe and thank you :)");
		po3.addLineItem(poli6);
		po3.addLineItem(poli7);
		procurementService.createProcurementOrder(po3, 1L);

		ProcurementOrder po4 = new ProcurementOrder();
		po4.setHeadquarters(siteService.getSite(1L));
		po4.setManufacturing(siteService.getSite(22L));
		po4.setWarehouse(siteService.getSite(2L));
		po4.setNotes("Please refer to the attached files thank you.");
		po4.addLineItem(poli8);
		po4.addLineItem(poli9);
		procurementService.createProcurementOrder(po4, 1L);

		// StockTransferOrders
		StockTransferOrderLI stoli1 = new StockTransferOrderLI(productService.getProduct("BBV0010199H-1"), 5);
		em.persist(stoli1);
		StockTransferOrderLI stoli2 = new StockTransferOrderLI(productService.getProduct("ADQ0008254W-2"), 7);
		em.persist(stoli2);
		StockTransferOrderLI stoli3 = new StockTransferOrderLI(productService.getProduct("ADQ0009202H-1"), 12);
		em.persist(stoli3);
		StockTransferOrderLI stoli4 = new StockTransferOrderLI(productService.getProduct("AB0009040H-2"), 15);
		em.persist(stoli4);
		StockTransferOrderLI stoli5 = new StockTransferOrderLI(productService.getProduct("BSK0010245Y-3"), 4);
		em.persist(stoli5);
		StockTransferOrderLI stoli6 = new StockTransferOrderLI(productService.getProduct("ASK0009018W-1"), 10);
		em.persist(stoli6);
		StockTransferOrderLI stoli7 = new StockTransferOrderLI(productService.getProduct("ASK0009018W-2"), 10);
		em.persist(stoli7);
		StockTransferOrderLI stoli8 = new StockTransferOrderLI(productService.getProduct("ASK0009018W-3"), 10);
		em.persist(stoli8);
		StockTransferOrderLI stoli9 = new StockTransferOrderLI(productService.getProduct("ASK0009018W-4"), 10);
		em.persist(stoli9);

		StockTransferOrder sto1 = new StockTransferOrder(siteService.getSite(10L), siteService.getSite(15L));
		sto1.addLineItem(stoli1);
		sto1.addLineItem(stoli2);
		stockTransferService.createStockTransferOrder(sto1, 10L);

		StockTransferOrder sto2 = new StockTransferOrder(siteService.getSite(5L), siteService.getSite(8L));
		sto2.addLineItem(stoli3);
		sto2.addLineItem(stoli4);
		sto2.addLineItem(stoli5);
		stockTransferService.createStockTransferOrder(sto2, 1L);

		StockTransferOrder sto3 = new StockTransferOrder(siteService.getSite(11L), siteService.getSite(7L));
		sto3.addLineItem(stoli6);
		sto3.addLineItem(stoli7);
		stockTransferService.createStockTransferOrder(sto3, 1L);

		StockTransferOrder sto4 = new StockTransferOrder(siteService.getSite(4L), siteService.getSite(9L));
		sto4.addLineItem(stoli8);
		sto4.addLineItem(stoli9);
		stockTransferService.createStockTransferOrder(sto4, 4L);

		// Customer Order
		CustomerOrderLI coli1 = new CustomerOrderLI();
		coli1.setProduct(productService.getProduct("AB0010031H-1"));
		coli1.setQty(1);
		customerOrderService.createCustomerOrderLI(coli1);

		CustomerOrderLI coli2 = new CustomerOrderLI();
		coli2.setProduct(productService.getProduct("ASK0009136A-1"));
		coli2.setQty(2);
		customerOrderService.createCustomerOrderLI(coli2);

		CustomerOrderLI coli3 = new CustomerOrderLI();
		coli3.setProduct(productService.getProduct("AB0009153W-1"));
		coli3.setQty(2);
		customerOrderService.createCustomerOrderLI(coli3);

		CustomerOrderLI coli4 = new CustomerOrderLI();
		coli4.setProduct(productService.getProduct("AB0009153W-1"));
		coli4.setQty(1);
		customerOrderService.createCustomerOrderLI(coli4);

		CustomerOrderLI coli5 = new CustomerOrderLI();
		coli5.setProduct(productService.getProduct("ASK0007868Y-1"));
		coli5.setQty(1);
		customerOrderService.createCustomerOrderLI(coli5);

		CustomerOrderLI coli6 = new CustomerOrderLI();
		coli6.setProduct(productService.getProduct("ASK0010155H-1"));
		coli6.setQty(1);
		customerOrderService.createCustomerOrderLI(coli6);

		CustomerOrderLI coli7 = new CustomerOrderLI();
		coli7.setProduct(productService.getProduct("AB0010059H-1"));
		coli7.setQty(1);
		customerOrderService.createCustomerOrderLI(coli7);

		CustomerOrderLI coli8 = new CustomerOrderLI();
		coli8.setProduct(productService.getProduct("BBV0010200H-1"));
		coli8.setQty(1);
		customerOrderService.createCustomerOrderLI(coli8);

		CustomerOrderLI coli9 = new CustomerOrderLI();
		coli9.setProduct(productService.getProduct("BBV0010199H-1"));
		coli9.setQty(1);
		customerOrderService.createCustomerOrderLI(coli9);

		CustomerOrderLI coli10 = new CustomerOrderLI();
		coli10.setProduct(productService.getProduct("AB0010059H-1"));
		coli10.setQty(1);
		customerOrderService.createCustomerOrderLI(coli10);

		CustomerOrderLI coli11 = new CustomerOrderLI();
		coli11.setProduct(productService.getProduct("BBV0010200H-1"));
		coli11.setQty(1);
		customerOrderService.createCustomerOrderLI(coli11);

		CustomerOrderLI coli12 = new CustomerOrderLI();
		coli12.setProduct(productService.getProduct("ASK0009022A-1"));
		coli12.setQty(1);
		customerOrderService.createCustomerOrderLI(coli12);

		CustomerOrderLI coli13 = new CustomerOrderLI();
		coli13.setProduct(productService.getProduct("BBV0010200H-1"));
		coli13.setQty(1);
		customerOrderService.createCustomerOrderLI(coli13);

		CustomerOrderLI coli14 = new CustomerOrderLI();
		coli14.setProduct(productService.getProduct("ASK0010265A-1"));
		coli14.setQty(1);
		customerOrderService.createCustomerOrderLI(coli14);

		CustomerOrderLI coli15 = new CustomerOrderLI();
		coli15.setProduct(productService.getProduct("ASK0010259H-1"));
		coli15.setQty(1);
		customerOrderService.createCustomerOrderLI(coli15);

		CustomerOrderLI coli16 = new CustomerOrderLI();
		coli16.setProduct(productService.getProduct("ASK0010155H-1"));
		coli16.setQty(1);
		customerOrderService.createCustomerOrderLI(coli16);

		CustomerOrderLI coli17 = new CustomerOrderLI();
		coli17.setProduct(productService.getProduct("AK0009973J-1"));
		coli17.setQty(1);
		customerOrderService.createCustomerOrderLI(coli17);

		CustomerOrderLI coli18 = new CustomerOrderLI();
		coli18.setProduct(productService.getProduct("ASK0009770Y-1"));
		coli18.setQty(1);
		customerOrderService.createCustomerOrderLI(coli18);

		CustomerOrderLI coli19 = new CustomerOrderLI();
		coli19.setProduct(productService.getProduct("AB0009978H-1"));
		coli19.setQty(1);
		customerOrderService.createCustomerOrderLI(coli19);

		CustomerOrderLI coli20 = new CustomerOrderLI();
		coli20.setProduct(productService.getProduct("AK0009973J-1"));
		coli20.setQty(1);
		customerOrderService.createCustomerOrderLI(coli20);

		siteService.addProducts(4L, "AB0010031H-1", 8);
		siteService.addProducts(4L, "ASK0009136A-1", 9);
		siteService.addProducts(4L, "AB0009153W-1", 9);
		siteService.addProducts(4L, "ASK0007868Y-1", 9);
		CustomerOrder co1 = new CustomerOrder();
		co1.addLineItem(coli4);
		co1.addLineItem(coli5);
		Payment payment1 = new Payment(coli4.getSubTotal() + coli5.getSubTotal(), "1-1", PaymentTypeEnum.CASH);
		em.persist(payment1);
		co1.addPayment(payment1);
		co1.setSite(siteService.getSite(4L));
		co1.setCustomerId(1L);
		customerOrderService.createCustomerOrder(co1, null);
		OnlineOrder oo1 = new OnlineOrder(false);
		oo1.setCustomerId(2L);
		oo1.setPickupSite((StoreSite) siteService.getSite(4L));
		oo1.addLineItem(coli1);
		oo1.addLineItem(coli2);
		oo1.addLineItem(coli3);
		Payment payment2 = new Payment(coli1.getSubTotal() + coli2.getSubTotal() + coli3.getSubTotal(), "2-1",
				PaymentTypeEnum.CASH);
		em.persist(payment2);
		oo1.addPayment(payment2);
		DeliveryAddress da = new DeliveryAddress("Work", " 51 Bras Basah Road", "Plaza By The Park", "Singapore",
				"189554", "", CountryEnum.Singapore, "60981335");
		oo1.setDeliveryAddress(da);
		customerOrderService.createOnlineOrder(oo1, null);

		OnlineOrder oo2 = new OnlineOrder(true);
		oo2.setCustomerId(3L);
		oo2.addLineItem(coli6);
		oo2.addLineItem(coli7);
		Payment payment3 = new Payment(coli6.getSubTotal() + coli7.getSubTotal(), "3-1", PaymentTypeEnum.CASH);
		em.persist(payment3);
		oo2.addPayment(payment3);
		oo2.setSite(siteService.getSite(3L));
		DeliveryAddress da1 = new DeliveryAddress("Work", "13 Computing Drive NUS School of Computing, COM1", "",
				"Singapore",
				"117417", "", CountryEnum.Singapore, "65162727");
		oo2.setDeliveryAddress(da1);
		customerOrderService.createOnlineOrder(oo2, null);

		OnlineOrder oo3 = new OnlineOrder(true);
		oo3.setCustomerId(4L);
		oo3.addLineItem(coli8);
		oo3.addLineItem(coli9);
		oo3.addLineItem(coli10);
		Payment payment4 = new Payment(coli8.getSubTotal() + coli9.getSubTotal() + coli10.getSubTotal(), "4-1",
				PaymentTypeEnum.CASH);
		em.persist(payment4);
		oo3.addPayment(payment4);
		oo3.setSite(siteService.getSite(3L));
		oo3.setDeliveryAddress(customerService.getCustomerById(4L).getAddress());
		customerOrderService.createOnlineOrder(oo3, null);

		OnlineOrder oo4 = new OnlineOrder(true);
		oo4.setCustomerId(5L);
		oo4.addLineItem(coli11);
		oo4.addLineItem(coli12);
		Payment payment5 = new Payment(coli11.getSubTotal() + coli12.getSubTotal(), "5-1", PaymentTypeEnum.CASH);
		em.persist(payment5);
		oo4.addPayment(payment5);
		oo4.setSite(siteService.getSite(3L));
		oo4.setDeliveryAddress(customerService.getCustomerById(5L).getAddress());
		customerOrderService.createOnlineOrder(oo4, null);

		OnlineOrder oo5 = new OnlineOrder(true);
		oo5.setCustomerId(6L);
		oo5.addLineItem(coli13);
		oo5.addLineItem(coli14);
		Payment payment6 = new Payment(coli13.getSubTotal() + coli14.getSubTotal(), "6-1", PaymentTypeEnum.CASH);
		em.persist(payment6);
		oo5.addPayment(payment6);
		oo5.setSite(siteService.getSite(3L));
		oo5.setDeliveryAddress(customerService.getCustomerById(6L).getAddress());
		customerOrderService.createOnlineOrder(oo5, null);

		siteService.editStockLevel(4L, "ASK0010259H-1", 0);
		OnlineOrder oo6 = new OnlineOrder(false);
		oo6.setCustomerId(7L);
		oo6.addLineItem(coli15);
		oo6.addLineItem(coli16);
		Payment payment7 = new Payment(coli15.getSubTotal() + coli16.getSubTotal(), "7-1", PaymentTypeEnum.CASH);
		em.persist(payment7);
		oo6.addPayment(payment7);
		oo6.setPickupSite((StoreSite) siteService.getSite(4L));
		oo6.setDeliveryAddress(customerService.getCustomerById(6L).getAddress());
		customerOrderService.createOnlineOrder(oo6, null);

		Customer cust = customerService.getCustomerById(2L);
		SupportTicket st = new SupportTicket(SupportTicket.Category.GENERAL, "Request for new products.");
		st.addMessage(new SupportTicketMsg("Please give me free products :D",
				cust.getFirstName() + " " + cust.getLastName(), ""));

		st.setCustomer(cust);
		st.setCustomerOrder(co1);
		customerService.createSupportTicket(st);
	}
}
