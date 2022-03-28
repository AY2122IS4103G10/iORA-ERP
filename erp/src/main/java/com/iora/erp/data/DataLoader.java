package com.iora.erp.data;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashSet;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Random;
import java.util.Set;
import java.util.stream.Collectors;

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

	// Insert Data-Init here
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
		e1.setEmail("darth.vader@gmail.com");
		e1.setSalary(5678.90);
		e1.setPayType(PayTypeEnum.MONTHLY);
		e1.setJobTitle(adminService.getJobTitleById(Long.valueOf(1)));
		e1.setDepartment(adminService.getDepartmentById(Long.valueOf(1)));
		e1.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e1.setPassword(passwordEncoder.encode("password"));
		em.persist(e1);

		Employee e2 = new Employee("Sharon KS", "sharonE", "password");
		e2.setEmail("sharonMS.12@gmail.com");
		e2.setSalary(4100.0);
		e2.setPayType(PayTypeEnum.MONTHLY);
		e2.setJobTitle(adminService.getJobTitleById(Long.valueOf(2)));
		e2.setDepartment(adminService.getDepartmentById(Long.valueOf(2)));
		e2.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e2.setPassword(passwordEncoder.encode("password"));
		em.persist(e2);

		Employee e3 = new Employee("Manuel Manny", "manu", "password");
		e3.setEmail("MannyManuel@gmail.com");
		e3.setSalary(4300.0);
		e3.setPayType(PayTypeEnum.MONTHLY);
		e3.setJobTitle(adminService.getJobTitleById(Long.valueOf(3)));
		e3.setDepartment(adminService.getDepartmentById(Long.valueOf(4)));
		e3.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e3.setPassword(passwordEncoder.encode("password"));
		em.persist(e3);

		Employee e4 = new Employee("Warren Ho", "warren", "password");
		e4.setEmail("WarrenHoHoHo@gmail.com");
		e4.setSalary(4288.0);
		e4.setPayType(PayTypeEnum.MONTHLY);
		e4.setJobTitle(adminService.getJobTitleById(Long.valueOf(4)));
		e4.setDepartment(adminService.getDepartmentById(Long.valueOf(5)));
		e4.setCompany(adminService.getCompanyById(Long.valueOf(1)));
		e4.setPassword(passwordEncoder.encode("password"));
		em.persist(e4);

		Employee e5 = new Employee("Storm", "storm", "password");
		e5.setEmail("storm@gmail.com");
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

		/*
		 * Currency rm = new Currency("RM", "Malaysian Ringgit", Country.Malaysia);
		 * Currency sgd = new Currency("SGD", "Singapore Dollar", Country.Singapore);
		 * em.persist(rm);
		 * em.persist(sgd);
		 */

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
		c1.setDob(LocalDate.of(2000, 1, 1));
		c1.setEmail("hongpeiisrandom@gmail.com");
		c1.setPassword("password");
		c1.setMembershipTier(customerService.findMembershipTierById("BASIC"));
		customerService.createCustomerAccount(c1);

		Customer c2 = new Customer("Delven", "Wong");
		c2.setContactNumber("92711363");
		c2.setDob(LocalDate.of(2000, 1, 1));
		c2.setEmail("pengyu_33@msn.com");
		c2.setPassword("password");
		c2.setMembershipTier(customerService.findMembershipTierById("BASIC"));
		customerService.createCustomerAccount(c2);

		Customer c3 = new Customer("Adeline", "Tan");
		c3.setContactNumber("93834898");
		c3.setDob(LocalDate.of(2000, 1, 1));
		c3.setEmail("tan.adelinejy@gmail.com");
		c3.setPassword("password");
		c3.setMembershipTier(customerService.findMembershipTierById("BASIC"));
		customerService.createCustomerAccount(c3);

		Customer c4 = new Customer("Louis", "Misson");
		c4.setContactNumber("98550432");
		c4.setDob(LocalDate.of(2000, 1, 1));
		c4.setEmail(passwordEncoder.encode("louismisson8@gmail.com"));
		c4.setPassword("password");
		c4.setMembershipTier(customerService.findMembershipTierById("BASIC"));
		customerService.createCustomerAccount(c4);

		Customer c5 = new Customer("Remus", "Kwan");
		c5.setContactNumber("90556630");
		c5.setDob(LocalDate.of(2000, 1, 1));
		c5.setEmail("remuskwan23@gmail.com");
		c5.setPassword("password");
		c5.setMembershipTier(customerService.findMembershipTierById("BASIC"));
		customerService.createCustomerAccount(c5);

		Customer c6 = new Customer("Ruth", "Chong");
		c6.setContactNumber("86065278");
		c6.setDob(LocalDate.of(2000, 1, 1));
		c6.setEmail("ruth.cjn@gmail.com");
		c6.setPassword("password");
		c6.setMembershipTier(customerService.findMembershipTierById("BASIC"));
		customerService.createCustomerAccount(c6);

		Customer c7 = new Customer("Steven", "Lim");
		c7.setContactNumber("91234567");
		c7.setDob(LocalDate.of(2000, 1, 1));
		c7.setEmail("stevenlim@gmail.com");
		c7.setPassword("password");
		c7.setMembershipTier(customerService.findMembershipTierById("BASIC"));
		customerService.createCustomerAccount(c7);

		// Generate 10 $10 vouchers
		customerService.generateVouchers(10, 10, "2022-02-16");

		// Generate 10 $5 vouchers
		customerService.generateVouchers(5, 10, "2022-02-16");

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
			productService.createModel(model);
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

		// ProcurementOrders
		ProcurementOrderLI poli1 = new ProcurementOrderLI(productService.getProduct("BDQ0010497X-1"), 50);
		em.persist(poli1);
		ProcurementOrderLI poli2 = new ProcurementOrderLI(productService.getProduct("BDQ0010497X-2"), 30);
		em.persist(poli2);
		ProcurementOrderLI poli3 = new ProcurementOrderLI(productService.getProduct("BDQ0010497X-3"), 45);
		em.persist(poli3);
		ProcurementOrderLI poli4 = new ProcurementOrderLI(productService.getProduct("AB0009644H-1"), 75);
		em.persist(poli4);
		ProcurementOrderLI poli5 = new ProcurementOrderLI(productService.getProduct("AB0009644H-2"), 70);
		em.persist(poli5);

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

		// StockTransferOrders
		StockTransferOrderLI stoli1 = new StockTransferOrderLI(productService.getProduct("AT0009862Z-1"), 5);
		em.persist(stoli1);
		StockTransferOrderLI stoli2 = new StockTransferOrderLI(productService.getProduct("AT0009862Z-2"), 7);
		em.persist(stoli2);
		StockTransferOrderLI stoli3 = new StockTransferOrderLI(productService.getProduct("AT0010054D-1"), 12);
		em.persist(stoli3);
		StockTransferOrderLI stoli4 = new StockTransferOrderLI(productService.getProduct("AT0010054D-2"), 15);
		em.persist(stoli4);
		StockTransferOrderLI stoli5 = new StockTransferOrderLI(productService.getProduct("AT0010054D-3"), 4);
		em.persist(stoli5);

		StockTransferOrder sto1 = new StockTransferOrder(siteService.getSite(10L), siteService.getSite(15L));
		sto1.addLineItem(stoli1);
		sto1.addLineItem(stoli2);
		stockTransferService.createStockTransferOrder(sto1, 10L);

		StockTransferOrder sto2 = new StockTransferOrder(siteService.getSite(5L), siteService.getSite(8L));
		sto2.addLineItem(stoli3);
		sto2.addLineItem(stoli4);
		sto2.addLineItem(stoli5);
		stockTransferService.createStockTransferOrder(sto2, 1L);

		// Customer Order
		CustomerOrderLI coli1 = new CustomerOrderLI();
		coli1.setProduct(productService.getProduct("BPL0009803M-1"));
		coli1.setQty(1);
		coli1.setSubTotal(39.0);

		CustomerOrderLI coli2 = new CustomerOrderLI();
		coli2.setProduct(productService.getProduct("BDQ0010043X-1"));
		coli2.setQty(2);
		coli2.setSubTotal(78.0);

		CustomerOrderLI coli3 = new CustomerOrderLI();
		coli3.setProduct(productService.getProduct("APL0009197A-1"));
		coli3.setQty(2);
		coli3.setSubTotal(38.0);

		CustomerOrderLI coli4 = new CustomerOrderLI();
		coli4.setProduct(productService.getProduct("BPD0010528A-1"));
		coli4.setQty(2);
		coli4.setSubTotal(98.0);
		customerOrderService.createCustomerOrderLI(coli4);

		CustomerOrderLI coli5 = new CustomerOrderLI();
		coli5.setProduct(productService.getProduct("BPS0009808X-1"));
		coli5.setQty(1);
		coli5.setSubTotal(29.0);
		customerOrderService.createCustomerOrderLI(coli5);

		CustomerOrderLI coli6 = new CustomerOrderLI();
		coli6.setProduct(productService.getProduct("BSK0009530X-1"));
		coli6.setQty(1);
		coli6.setSubTotal(29.0);
		customerOrderService.createCustomerOrderLI(coli6);

		CustomerOrderLI coli7 = new CustomerOrderLI();
		coli7.setProduct(productService.getProduct("BPD0010304X-1"));
		coli7.setQty(1);
		coli7.setSubTotal(49.0);
		customerOrderService.createCustomerOrderLI(coli7);

		Payment payment1 = new Payment(127, "241563", PaymentTypeEnum.VISA);
		customerOrderService.createPayment(payment1);

		Payment payment2 = new Payment(78, "546130", PaymentTypeEnum.MASTERCARD);
		customerOrderService.createPayment(payment2);

		CustomerOrder co1 = new CustomerOrder();
		co1.setDateTime(new Date());
		co1.addLineItem(coli4);
		co1.addLineItem(coli5);
		co1.addPayment(payment1);
		co1.setPaid(true);
		co1.setSite(siteService.getSite(4L));
		co1.setCustomerId(2L);
		customerOrderService.createCustomerOrder(co1, null);

		OnlineOrder oo1 = new OnlineOrder(false, CountryEnum.Singapore);
		oo1.setCustomerId(2L);
		oo1.setPickupSite((StoreSite) siteService.getSite(4L));
		oo1.addLineItem(coli6);
		oo1.addLineItem(coli7);
		oo1.setPaid(true);
		oo1.addPayment(payment2);
		oo1.setSite(siteService.getSite(3L));
		customerOrderService.createOnlineOrder(oo1, null);

		OnlineOrder oo2 = new OnlineOrder(true, CountryEnum.Singapore);
		oo2.setCustomerId(2L);
		oo2.addLineItem(coli1);
		oo2.addLineItem(coli2);
		oo2.setPaid(false);
		oo2.setSite(siteService.getSite(10L));
		oo2.setDeliveryAddress("13 Computing Drive NUS School of Computing, COM1 Singapore 117417");
		customerOrderService.createOnlineOrder(oo2, null);

		Customer cust = customerService.getCustomerById(2L);
		SupportTicket st = new SupportTicket(SupportTicket.Category.GENERAL, "Request for new products.");
		st.addMessage(new SupportTicketMsg("Please give me free products :D",
				cust.getFirstName() + " " + cust.getLastName(), ""));

		st.setCustomer(cust);
		st.setCustomerOrder(co1);
		customerService.createSupportTicket(st);

		cust.addSupportTicke(st);
		customerService.updateCustomerAccount(cust);
	}

}
