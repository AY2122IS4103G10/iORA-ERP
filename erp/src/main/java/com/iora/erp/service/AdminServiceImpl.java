package com.iora.erp.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TransactionRequiredException;

import com.iora.erp.exception.AddressException;
import com.iora.erp.exception.CompanyException;
import com.iora.erp.exception.DepartmentException;
import com.iora.erp.exception.JobTitleException;
import com.iora.erp.exception.VendorException;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Company;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;
import com.iora.erp.model.company.Vendor;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("adminServiceImpl")
@Transactional
public class AdminServiceImpl implements AdminService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public JobTitle createJobTitle(JobTitle jobTitle) throws JobTitleException {
        try {
            JobTitle jt = jobTitle;
            em.persist(jt);
            return jt;

        } catch (Exception ex) {
            throw new JobTitleException("Job Title has already been created");
        }
    }

    @Override
    public JobTitle updateJobTitle(JobTitle jobTitle) throws JobTitleException {
        JobTitle old = em.find(JobTitle.class, jobTitle.getId());

        if (old == null) {
            throw new JobTitleException("Job title not found");
        }

        try {
            if (!old.getTitle().equals(jobTitle.getTitle())) {
                old.setTitle(jobTitle.getTitle());
            }
        } catch (Exception ex) {
            throw new JobTitleException("Job Title " + jobTitle.getTitle() + " has been used!");
        }

        old.setDescription(jobTitle.getDescription());
        old.setResponsibility(jobTitle.getResponsibility());
        return old;
    }

    @Override
    public void deleteJobTitle(Long id) throws JobTitleException {
        JobTitle j = em.find(JobTitle.class, id);

        Query q = em.createQuery("SELECT e FROM Employee e WHERE e.jobTitle.id = :id").setMaxResults(1);
        q.setParameter("id", id);

        if (j == null) {
            throw new JobTitleException("JobTitle not found");
        } else if (q.getResultList().size() > 0) {
            throw new JobTitleException("Failure: Department is currently being used.");
        } else {
            try {
                List<Department> dd = em.createQuery("SELECT e FROM Department e", Department.class).getResultList();

                for (Department d : dd) {
                    Department dept = getDepartmentById(d.getId());
                    dept.getJobTitles().remove(j);
                }
            } catch (Exception ex) {
                throw new JobTitleException(ex.toString());
            }

            em.remove(j);
            em.flush();
        }

    }

    @Override
    public List<JobTitle> listOfJobTitles() throws JobTitleException {
        try {
            return em.createQuery("SELECT e FROM JobTitle e", JobTitle.class).getResultList();
        } catch (Exception ex) {
            throw new JobTitleException("something happen");
        }
    }

    @Override
    public List<JobTitle> getJobTitlesByFields(String search) throws JobTitleException {
        if (search == null) {
            return listOfJobTitles();
        }
        return em.createQuery("SELECT e FROM JobTitle e WHERE LOWER(e.title) LIKE :title", JobTitle.class)
                .setParameter("title", "%" + search.toLowerCase() + "%").getResultList();
    }

    @Override
    public JobTitle getJobTitleById(Long id) throws JobTitleException {
        JobTitle jobTitle = em.find(JobTitle.class, id);
        if (jobTitle == null) {
            throw new JobTitleException("Job Title with id: " + id + " not found.");
        }
        return jobTitle;
    }

    @Override
    public JobTitle getJobTitlesByName(String title) throws JobTitleException {
        Query q = em.createQuery("SELECT e FROM JobTitle e WHERE LOWER(e.getTitle) = :title");
        q.setParameter("title", title.toLowerCase());

        try {
            return (JobTitle) q.getSingleResult();
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new JobTitleException("Job Title " + title + " does not exist.");
        }
    }

    @Override
    public Department createDepartment(Department department) throws DepartmentException {
        try {
            Department d = new Department();
            d.setDeptName(department.getDeptName());

            em.persist(d);

            for (JobTitle j : department.getJobTitles()) {
                JobTitle jt = getJobTitleById(j.getId());
                d.getJobTitles().add(jt);
            }
            return d;

        } catch (Exception ex) {
            throw new DepartmentException("Department has already been created");
        }
    }

    @Override
    public Department editDepartment(Department department) throws DepartmentException {
        Department old = em.find(Department.class, department.getId());

        if (old == null) {
            throw new DepartmentException("Department not found");
        }

        try {
            if (!old.getDeptName().equals(department.getDeptName())) {
                old.setDeptName(department.getDeptName());
            }
        } catch (Exception ex) {
            throw new DepartmentException("Department " + department.getDeptName() + " has been used!");
        }

        try {
            old.setJobTitles(new ArrayList<>());
            for (JobTitle j : department.getJobTitles()) {
                JobTitle newJ = getJobTitleById(j.getId());
                old.getJobTitles().add(newJ);
            }
        } catch (Exception ex) {
            throw new DepartmentException(ex.getMessage());
        }

        return old;
    }

    @Override
    public void deleteDepartment(Long id) throws DepartmentException {
        try {
            Department e = em.find(Department.class, id);

            if (e == null) {
                throw new DepartmentException("Department not found");
            }

            Query q = em.createQuery("SELECT e FROM Employee e WHERE e.department.id = :id").setMaxResults(1);
            q.setParameter("id", id);

            Boolean checkDepartment = false;
            if (q.getResultList().size() > 0) {
                checkDepartment = true;
            }

            if (checkDepartment == true) {
                throw new DepartmentException("Failure: Department is currently being used.");
            } else {
                List<Company> listC = em.createQuery("SELECT c FROM Company c", Company.class).getResultList();
                System.out.println(listC);
                if (listC.size() > 0) {
                    for (Company c : listC) {
                        Company cc = getCompanyById(c.getId());
                        cc.getDepartments().remove(e);
                    }
                }

                em.remove(e);
                em.flush();
            }
        } catch (IllegalArgumentException | TransactionRequiredException ex) {
            throw new DepartmentException("Department cannot be removed");
        } catch (CompanyException ex) {
            throw new DepartmentException("Company data cannot be retreived");
        }
    }

    @Override
    public List<Department> listOfDepartments() throws DepartmentException {
        try {
            return em.createQuery("SELECT e FROM Department e", Department.class).getResultList();

        } catch (Exception ex) {
            throw new DepartmentException("Department cannot be retrieved");
        }
    }

    @Override
    public List<Department> getDepartmentsByFields(String search) throws DepartmentException {
        if (search == null) {
            return listOfDepartments();
        }

        return em.createQuery("SELECT e FROM Department e WHERE LOWER(e.deptName) LIKE :name", Department.class)
                .setParameter("name", "%" + search.toLowerCase() + "%")
                .getResultList();
    }

    @Override
    public Boolean checkJTInDepartment(Long did, Long jid) throws DepartmentException {
        Department d = getDepartmentById(did);
        List<JobTitle> jt = d.getJobTitles();
        Boolean check = false;

        for (JobTitle t : jt) {
            if (t.getId().equals(jid)) {
                check = true;
            }
        }
        return check;
    }

    @Override
    public Department getDepartmentById(Long id) throws DepartmentException {
        Department department = em.find(Department.class, id);
        if (department == null) {
            throw new DepartmentException("Department with id: " + id + " not found.");
        }

        return department;
    }

    @Override
    public Department getDepartmentsByName(String name) {
        return em.createQuery("SELECT e FROM Department e WHERE LOWER(e.getDeptName) = :name", Department.class)
                .setParameter("name", name.toLowerCase())
                .getSingleResult();
    }

    @Override
    public List<Employee> getEmployeesInDepartments(String department) throws DepartmentException {
        return em.createQuery(
                "SELECT e FROM Employee e, IN (e.department) d WHERE LOWER(d.getDeptName) = :name ORDER BY e.name",
                Employee.class).setParameter("name", department.toLowerCase()).getResultList();
    }

    @Override
    public Address createAddress(Address address) throws AddressException {
        try {
            if (checkAddress(address) == false) {
                em.persist(address);
            }

            return address;

        } catch (Exception ex) {
            throw new AddressException("Address has already been created");
        }
    }

    @Override
    public Address updateAddress(Address address) throws AddressException {
        Address old = getAddressById(address.getId());
        old.setCountry(address.getCountry());
        old.setBuilding(address.getBuilding());
        old.setCity(address.getCity());
        old.setUnit(address.getUnit());
        old.setPostalCode(address.getPostalCode());
        old.setState(address.getState());
        old.setBilling(address.getBilling());

        return old;
    }

    @Override
    public void deleteAddress(Address address) throws AddressException {
        try {
            Address e = em.find(Address.class, address.getId());

            if (e == null) {
                throw new AddressException("Address is not found");
            }
            em.remove(address);
            em.flush();
        } catch (IllegalArgumentException | TransactionRequiredException ex) {
            throw new AddressException("Address cannot be removed");
        }

    }

    @Override
    public List<Address> getListAddress() {
        return em.createQuery("SELECT a FROM Address a", Address.class).getResultList();
    }

    @Override
    public List<Address> getListAddressFields(String search) {
        if (search == "") {
            return getListAddress();
        }
        return em.createQuery(
                "SELECT a FROM Address a WHERE LOWER(a.building) LIKE :building OR lOWER(a.postalCode) LIKE :postal OR"
                        + " LOWER(a.unit) LIKE :unit OR LOWER(a.road) LIKE :road OR LOWER(a.city) LIKE :city",
                Address.class)
                .setParameter("building", "%" + search + "%")
                .setParameter("postal", "%" + search + "%")
                .setParameter("unit", "%" + search + "%")
                .setParameter("road", "%" + search + "%")
                .setParameter("city", "%" + search + "%")
                .getResultList();
    }

    @Override
    public Address getAddressById(Long id) throws AddressException {
        Address addr = em.find(Address.class, id);
        if (addr == null) {
            throw new AddressException("Address with id: " + id + " not found.");
        }
        return addr;
    }

    @Override
    public Boolean checkAddress(Address address) {
        Query q = em.createQuery(
                "SELECT e FROM Address e WHERE UPPER(e.country) = :country AND LOWER(e.city) = :city " +
                        "AND LOWER(e.postalCode) = :postal AND LOWER(e.unit) = :unit");
        q.setParameter("country", address.getCountry().toString());
        q.setParameter("city", address.getCity().toLowerCase());
        q.setParameter("postal", address.getPostalCode().toLowerCase());
        q.setParameter("unit", address.getUnit().toLowerCase());
        Address a = (Address) q.getSingleResult();

        if (a != null) {
            return true;
        } else {
            return false;
        }
    }

    @Override
    public Company createCompany(Company company) throws CompanyException {
        try {
            Address a = company.getAddress();
            List<Department> dep = company.getDepartments();
            List<Vendor> ven = company.getVendors();
            em.persist(company);

            company.setDepartments(new ArrayList<>());
            if (dep != null) {
                for (Department d : dep) {
                    if (d.getId() != null) {
                        company.getDepartments().add(getDepartmentById(d.getId()));
                    } else {
                        em.persist(d);
                        company.getDepartments().add(d);
                    }
                }
            }

            if (a.getId() != null) {
                company.setAddress(getAddressById(a.getId()));
            } else {
                em.persist(a);
                company.setAddress(a);
            }

            company.setVendors(new ArrayList<>());
            if (ven != null) {
                for (Vendor v : ven) {
                    if (v.getId() != null) {
                        company.getVendors().add(getVendorById(v.getId()));
                    } else {
                        em.persist(v);
                        company.getVendors().add(v);
                    }
                }
            }

            return company;

        } catch (Exception ex) {
            throw new CompanyException("Company has already been created");
        }
    }

    @Override
    public void addADepartmentToCompany(Long cid, Long did) throws CompanyException, DepartmentException {
        Company c = getCompanyById(cid);
        Department d = getDepartmentById(did);
        c.getDepartments().add(d);
    }

    @Override
    public void removeADepartmentToCompany(Long cid, Long did) throws CompanyException, DepartmentException {
        Company c = getCompanyById(cid);
        Department d = getDepartmentById(did);
        c.getDepartments().remove(d);
    }

    @Override
    public void addAVendorToCompany(Long cid, Long vid) throws CompanyException, VendorException {
        Company c = getCompanyById(cid);
        Vendor v = getVendorById(vid);
        c.getVendors().add(v);

    }

    @Override
    public void removeAVendorToCompany(Long cid, Long vid) throws CompanyException, VendorException {
        Company c = getCompanyById(cid);
        Vendor v = getVendorById(vid);
        c.getVendors().remove(v);
    }

    // need add vendor, Department and site mapping
    @Override
    public Company editCompany(Company company) throws CompanyException {
        Company old = getCompanyById(company.getId());

        if (!company.getName().equals(old.getName()) && checkUniqueN(company.getName()) == false) {
            throw new CompanyException("Fail: Company name has already been used");

        } else if (!company.getRegisterNumber().equals(old.getRegisterNumber()) &&
                checkUniqueR(company.getRegisterNumber()) == false) {
            throw new CompanyException("Fail: Company registeration number has already been used");

        } else {
            try {

                old.setName(company.getName());
                old.setRegisterNumber(company.getRegisterNumber());
                old.setTelephone(company.getTelephone());
                old.setActive(company.getActive());
                old.setAddress(company.getAddress());

                List<Department> dep = company.getDepartments();
                List<Vendor> ven = company.getVendors();
                old.setDepartments(new ArrayList<>());
                old.setVendors(new ArrayList<>());

                for (Department d : dep) {
                    old.getDepartments().add(getDepartmentById(d.getId()));
                }

                for (Vendor v : ven) {
                    old.getVendors().add(getVendorById(v.getId()));
                }

                return old;

            } catch (Exception ex) {
                throw new CompanyException(ex.toString());
            }
        }

    }

    @Override
    public void deleteCompany(Long id) throws CompanyException {

        Query q = em.createQuery("SELECT e FROM Site e WHERE e.company.id = :id").setMaxResults(1);
        q.setParameter("id", id);

        Query p = em.createQuery("SELECT e FROM Employee e WHERE e.company.id = :id").setMaxResults(1);
        p.setParameter("id", id);

        Company c = getCompanyById(id);

        if (q.getResultList().size() > 0 || p.getResultList().size() > 0) {
            c.setActive(false);
        } else {
            c.setDepartments(null);
            c.setVendors(null);
            Long aid = c.getAddress().getId();
            c.setAddress(null);

            try {

                Query x = em.createQuery("SELECT e FROM Company e WHERE e.address.id = :id").setMaxResults(1);
                x.setParameter("id", aid);
                if (x.getResultList().size() == 0) {
                    deleteAddress(getAddressById(aid));
                }

            } catch (Exception ex) {
                throw new CompanyException(ex.toString());
            }

            em.remove(c);
        }
    }

    @Override
    public List<Company> listOfCompanys() throws CompanyException {
        try {
            return em.createQuery("SELECT c FROM Company c", Company.class).getResultList();
        } catch (Exception ex) {
            throw new CompanyException("Unable to retrieve list of company");
        }
    }

    @Override
    public List<Company> getCompanysByFields(String search) throws CompanyException {
        if (search == "") {
            return listOfCompanys();
        }

        try {
            return em.createQuery("SELECT c FROM Company c WHERE LOWER(c.name) LIKE :name OR " +
                    "LOWER(c.registerNumber) LIKE :regsNum OR c.telephone LIKE :telephone", Company.class)
                    .setParameter("name", "%" + search.toLowerCase() + "%")
                    .setParameter("regsNum", "%" + search.toLowerCase() + "%")
                    .setParameter("telephone", "%" + search + "%")
                    .getResultList();

        } catch (Exception ex) {
            throw new CompanyException("Unable to retrieve list from search");
        }
    }

    @Override
    public Company getCompanyById(Long id) throws CompanyException {
        Company com = em.find(Company.class, id);
        if (com == null) {
            throw new CompanyException("Company with id: " + id + " not found.");
        }
        return com;
    }

    @Override
    public Company getCompanysByName(String name) {
        Query q = em.createQuery("SELECT c FROM Company c WHERE LOWER(e.name) = :name");
        q.setParameter("name", name.toLowerCase());

        return (Company) q.getSingleResult();
    }

    @Override
    public Boolean checkUniqueR(String register) {
        Query q = em.createQuery("SELECT e FROM Company e WHERE LOWER(e.registerNumber) = :num");
        q.setParameter("num", register.toLowerCase());

        if (q.getResultList().size() > 0) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public Boolean checkUniqueN(String name) {
        Query q = em.createQuery("SELECT e FROM Company e WHERE LOWER(e.name) = :name");
        q.setParameter("name", name.toLowerCase());

        if (q.getResultList().size() > 0) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public Vendor createVendor(Vendor vendor) throws VendorException {
        try {
            Vendor newV = vendor;
            List<Address> list = vendor.getAddress();

            newV.setAddress(new ArrayList<>());
            em.persist(newV);

            for (Address aa : list) {
                em.persist(aa);
                newV.getAddress().add(aa);
            }

            return newV;

        } catch (Exception ex) {
            throw new VendorException("Vendor has already already been created");
        }

    }

    @Override
    public Vendor updateVendor(Vendor vendor) throws VendorException, AddressException {
        Vendor v = getVendorById(vendor.getId());
        Boolean checkUpdate = false;

        List<Address> list = v.getAddress();

        if (!vendor.getCompanyName().equals(v.getCompanyName())) {
            if (uniqueVendorName(vendor.getCompanyName()) == true) {
                checkUpdate = true;
            } else {
                throw new VendorException("Fail: Vendor name is not unique");
            }
        } else {
            checkUpdate = true;
        }

        if (checkUpdate == true) {
            v.setCompanyName(vendor.getCompanyName());
            v.setDescription(vendor.getDescription());
            v.setEmail(vendor.getEmail());
            v.setTelephone(vendor.getTelephone());
            v.setAddress(new ArrayList<>());

            List<Address> givenList = new ArrayList<>();
            for (Address a : vendor.getAddress()) {
                if (a.getId() != null) {
                    givenList.add(a);
                    updateAddress(a);
                    v.getAddress().add(getAddressById(a.getId()));
                } else {
                    em.persist(a);
                    v.getAddress().add(a);
                }
            }

            for (Address x : list) {
                if (!givenList.contains(x)) {
                    Address toDelete = getAddressById(x.getId());
                    em.remove(toDelete);
                }
            }

            return v;
        } else {
            throw new VendorException("Fail: Vendor are able to be updated");
        }
    }

    @Override
    public void deleteVendor(Long id) throws VendorException {
        Vendor v = getVendorById(id);

        List<Company> cc = em.createQuery("SELECT e FROM Company e", Company.class).getResultList();
        for (int i = 0; i < cc.size(); i++) {
            cc.get(i).getVendors().remove(v);
        }

        em.remove(v);
    }

    @Override
    public List<Vendor> listofVendor() throws VendorException {
        try {
            return em.createQuery("SELECT e FROM Vendor e", Vendor.class).getResultList();

        } catch (Exception ex) {
            throw new VendorException("Fail to retrieve vendors");
        }
    }

    @Override
    public List<Vendor> getListofVendor(String search) throws VendorException {
        if (search == "") {
            return listofVendor();
        }

        try {
            return em.createQuery(
                    "SELECT e FROM Vendor e WHERE LOWER(e.companyName) LIKE :name OR LOWER(e.email) LIKE :email OR LOWER(e.telephone) LIKE :telephone",
                    Vendor.class)
                    .setParameter("name", "%" + search + "%")
                    .setParameter("email", "%" + search + "%")
                    .setParameter("telephone", "%" + search + "%")
                    .getResultList();

        } catch (Exception ex) {
            throw new VendorException("Fail to retrieve vendors");
        }
    }

    @Override
    public Vendor getVendorById(Long id) throws VendorException {
        Vendor vendor = em.find(Vendor.class, id);
        if (vendor == null) {
            throw new VendorException("Vendor with id: " + id + " not found.");
        }
        return vendor;
    }

    @Override
    public Boolean uniqueVendorName(String name) throws VendorException {
        Query q = em.createQuery("SELECT v FROM Vendor v WHERE LOWER(v.companyName) = :name");
        q.setParameter("name", name.toLowerCase());

        if (q.getResultList().size() > 0) {
            return false;
        } else {
            return true;
        }

    }

}
