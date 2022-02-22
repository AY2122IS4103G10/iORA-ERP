package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Locale;

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
    public void createJobTitle(JobTitle jobTitle) throws JobTitleException {
        try {
            JobTitle jt = jobTitle;

            em.persist(jt);

        } catch (Exception ex) {
            throw new JobTitleException("Job Title has already been created");
        }
    }

    @Override
    public void updateJobTitle(JobTitle jobTitle) throws JobTitleException {
        JobTitle old = em.find(JobTitle.class, jobTitle.getId());

        if (old == null) {
            throw new JobTitleException("Job title not found");
        }

        try {
            if (old.getTitle() != jobTitle.getTitle()) {
                old.setTitle(jobTitle.getTitle());
            }
        } catch (Exception ex) {
            throw new JobTitleException("Job Title " + jobTitle.getTitle() + " has been used!");
        }

        old.setDescription(jobTitle.getDescription());
        old.setResponsibility(jobTitle.getResponsibility());
    }

    @Override
    public void deleteJobTitle(Long id) throws JobTitleException {
        JobTitle j = em.find(JobTitle.class, id);

        Query p = em.createQuery("SELECT e FROM Department e WHERE e.jobTitle.id = :jobTitle");
        p.setParameter("jobTitle", id);
        List<Department> dd = p.getResultList();
        Boolean departmentCheck = false;

        if (dd.size() > 0) {
            departmentCheck = true;
        }

        if (j == null) {
            throw new JobTitleException("JobTitle not found");
        } else if (departmentCheck == true) {
            throw new JobTitleException("Failure: Department is currently being used.");
        } else {
            em.remove(j);
            em.flush();
        }

    }

    @Override
    public List<JobTitle> listOfJobTitles() throws JobTitleException {
        try {
            Query q = em.createQuery("SELECT e FROM JobTitle e");
            return q.getResultList();

        } catch (Exception ex) {
            throw new JobTitleException("something happen");
        }
    }

    @Override
    public List<JobTitle> getJobTitlesByFields(String search) throws JobTitleException {
        if (search == null) {
            return listOfJobTitles();
        }

        Query q = em.createQuery("SELECT e FROM JobTitle e WHERE LOWER(e.title) LIKE :title");
        q.setParameter("title", "%" + search.toLowerCase() + "%");
        return q.getResultList();
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
    public void createDepartment(Department department) throws DepartmentException {
        try {
            Department d = new Department();
            d.setDeptName(department.getDeptName());

            em.persist(d);

            for (JobTitle j : department.getJobTitles()) {
                JobTitle jt = getJobTitleById(j.getId());
                d.getJobTitles().add(jt);
            }

        } catch (Exception ex) {
            throw new DepartmentException("Department has already been created");
        }
    }

    @Override
    public void editDepartment(Department department) throws DepartmentException {
        Department old = em.find(Department.class, department.getId());

        if (old == null) {
            throw new DepartmentException("Department not found");
        }

        try {
            if (old.getDeptName() != department.getDeptName()) {
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

    }

    @Override
    public void deleteDepartment(Long id) throws DepartmentException {
        try {
            Department e = em.find(Department.class, id);

            if (e == null) {
                throw new DepartmentException("Department not found");
            }

            Query q = em.createQuery("SELECT e FROM Employee e WHERE e.department.id = :id");
            q.setParameter("id", id);

            List<Department> d = q.getResultList();
            Boolean checkDepartment = false;

            if (d.size() > 0) {
                checkDepartment = true;
            }

            if (checkDepartment == true) {
                throw new DepartmentException("Failure: Department is currently being used.");
            } else {
                e.setJobTitles(new ArrayList<>());
                em.remove(e);
                em.flush();
            }
        } catch (IllegalArgumentException | TransactionRequiredException ex) {
            throw new DepartmentException("Department cannot be removed");
        }

    }

    @Override
    public List<Department> listOfDepartments() throws DepartmentException {
        try {
            Query q = em.createQuery("SELECT e FROM Department e");
            return q.getResultList();

        } catch (Exception ex) {
            throw new DepartmentException("Department cannot be retrieved");
        }
    }

    @Override
    public List<Department> getDepartmentsByFields(String search) throws DepartmentException {
        if (search == null) {
            return listOfDepartments();
        }

        Query q = em.createQuery("SELECT e FROM Department e WHERE LOWER(e.deptName) LIKE :name");
        q.setParameter("name", "%" + search.toLowerCase() + "%");
        return q.getResultList();
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
        Query q = em.createQuery("SELECT e FROM Department e WHERE LOWER(e.getDeptName) = :name");
        q.setParameter("name", name.toLowerCase());
        return (Department) q.getSingleResult();
    }

    @Override
    public List<Employee> getEmployeesInDepartments(String department) throws DepartmentException {
        Query q = em.createQuery(
                "SELECT e FROM Employee e, IN (e.department) d WHERE LOWER(d.getDeptName) = :name ORDER BY e.name");
        q.setParameter("name", department.toLowerCase());
        return q.getResultList();
    }

    @Override
    public void createAddress(Address address) throws AddressException {
        try {
            if (checkAddress(address) == false) {
                em.persist(address);
            }

        } catch (Exception ex) {
            throw new AddressException("Address has already been created");
        }
    }

    @Override
    public void updateAddress(Address address) throws AddressException {
        Address old = getAddressById(address.getId());
        old.setCountry(address.getCountry());
        old.setBuilding(address.getBuilding());
        old.setCity(address.getCity());
        old.setUnit(address.getUnit());
        old.setPostalCode(address.getPostalCode());
        old.setState(address.getState());
        old.setBilling(address.getBilling());
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
        Query q = em.createQuery("SELECT a FROM Address a");
        return q.getResultList();
    }

    @Override
    public List<Address> getListAddressFields(String search) {
        if (search == "") {
            return getListAddress();
        }
        Query q = em.createQuery(
                "SELECT a FROM Address a WHERE LOWER(a.building) LIKE :building OR lOWER(a.postalCode) LIKE :postal OR"
                        +
                        " LOWER(a.unit) LIKE :unit OR LOWER(a.road) LIKE :road OR LOWER(a.city) LIKE :city");
        q.setParameter("building", "%" + search + "%");
        q.setParameter("postal", "%" + search + "%");
        q.setParameter("unit", "%" + search + "%");
        q.setParameter("road", "%" + search + "%");
        q.setParameter("city", "%" + search + "%");
        return q.getResultList();
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
    public void createCompany(Company company) throws CompanyException {
        try {
            Address a = company.getAddress();
            List<Department> dep = company.getDepartments();
            List<Vendor> ven = company.getVendors();
            em.persist(company);

            company.setDepartments(new ArrayList<>());
            for(Department d: dep) {
                if (d.getId() != null) {
                    company.getDepartments().add(getDepartmentById(d.getId()));
                } else  {
                    em.persist(d);
                    company.getDepartments().add(d);
                }
            }

            em.persist(a);
            company.setAddress(a);

            company.setVendors(new ArrayList<>());
            for(Vendor v: ven) {
                if (v.getId() != null) {
                    company.getVendors().add(getVendorById(v.getId()));
                } else  {
                    em.persist(v);
                    company.getVendors().add(v);
                }
            }

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
    public void editCompany(Company company) throws CompanyException {
        Company old = getCompanyById(company.getId());

        if (company.getName() != old.getName() && company.getRegisterNumber() != old.getRegisterNumber()) {
            if (checkUniqueN(company.getName()) == true && checkUniqueR(company.getRegisterNumber()) == true) {

                old.setName(company.getName());
                old.setRegisterNumber(company.getRegisterNumber());
                old.setTelephone(company.getTelephone());
                old.setActive(company.getActive());

            } else if (checkUniqueN(company.getName()) == true) {
                throw new CompanyException("New company registeration number is not unique");
            } else {
                throw new CompanyException("New company Name is not unique");
            }

        } else if (company.getName() != old.getName()) {
            if (checkUniqueN(company.getName()) == true) {
                old.setName(company.getName());
                old.setTelephone(company.getTelephone());
                old.setActive(company.getActive());

            } else {
                throw new CompanyException("New company Name is not unique");
            }

        } else if (company.getRegisterNumber() != old.getRegisterNumber()) {
            if (checkUniqueR(company.getRegisterNumber()) == true) {
                old.setRegisterNumber(company.getRegisterNumber());
                old.setTelephone(company.getTelephone());
                old.setActive(company.getActive());

            } else {
                throw new CompanyException("New company registeration number is not unique");
            }
        } else {
            old.setTelephone(company.getTelephone());
            old.setActive(company.getActive());
        }
    }

    @Override
    public void deleteCompany(Company company) throws CompanyException {
        Query q = em.createQuery("SELECT e FROM Site e WHERE e.getCompany.getId = :id");
        q.setParameter("id", company.getId());

        Company c = getCompanyById(company.getId());

        if (q.getResultList().size() > 0) {
            c.setActive(false);
        } else {
            em.remove(c);
        }
    }

    @Override
    public List<Company> listOfCompanys() throws CompanyException {
        try {
            Query q = em.createQuery("SELECT c FROM Company c");
            return q.getResultList();

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
            Query q = em.createQuery("SELECT c FROM Company c WHERE LOWER(c.name) LIKE :name OR " +
            "LOWER(c.registerNumber) LIKE :regsNum OR c.telephone LIKE :telephone");
            q.setParameter("name", "%" + search.toLowerCase() + "%");
            q.setParameter("regsNum", "%" + search.toLowerCase() + "%");
            q.setParameter("telephone", "%" + search + "%");
            
            return q.getResultList();
            
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
        Query q = em.createQuery("SELECT e FROM Company e WHERE e.registerNumber = :num");
        q.setParameter("num", register);

        if (q.getResultList().size() > 0) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public Boolean checkUniqueN(String name) {
        Query q = em.createQuery("SELECT e FROM Company e WHERE LOWER(e.getName) = :name ");
        q.setParameter("name", name.toLowerCase());

        if (q.getResultList().size() > 0) {
            return false;
        } else {
            return true;
        }
    }

    @Override
    public void createVendor(Vendor vendor) throws VendorException {
        try {
            Vendor newV = vendor;
            List<Address> list = vendor.getAddress();

            newV.setAddress(new ArrayList<>());
            em.persist(newV);

            for (Address aa : list) {
                em.persist(aa);
                newV.getAddress().add(aa);
            }

        } catch (Exception ex) {
            throw new VendorException("Vendor has already already been created");
        }

    }

    @Override
    public void updateVendor(Vendor vendor) throws VendorException, AddressException {
        Vendor v = getVendorById(vendor.getId());
        Boolean checkUpdate = false;

        List<Address> list = v.getAddress();

        if (vendor.getCompanyName() != v.getCompanyName()) {
            if (uniqueVendorName(vendor.getCompanyName()) == true) {
                checkUpdate = true;
            } else {
                throw new VendorException("Fail: Vendor name is not unique");
            }
        } else {
            checkUpdate = true;
        }

        if (checkUpdate == true) {
            v.setCompanyName(v.getCompanyName());
            v.setDescription(v.getDescription());
            v.setEmail(v.getEmail());
            v.setTelephone(v.getTelephone());
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
        }
    }

    @Override
    public void deleteVendor(Long id) throws VendorException {
        Vendor v = getVendorById(id);
        em.remove(v);
    }

    @Override
    public List<Vendor> listofVendor() throws VendorException {
        try {
            Query q = em.createQuery("SELECT e FROM Vendor e");
            return q.getResultList();

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
            Query q = em.createQuery(
                    "SELECT e FROM Vendor e WHERE LOWER(e.companyName) LIKE :name OR LOWER(e.email) LIKE :email OR LOWER(e.telephone) LIKE :telephone");
            q.setParameter("name", "%" + search + "%");
            q.setParameter("email", "%" + search + "%");
            q.setParameter("telephone", "%" + search + "%");
            return q.getResultList();

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

    @Override
    public List<String> getCountryCodes() {
        String[] countryCodes = Locale.getISOCountries();
        List<String> code = Arrays.asList(countryCodes);
        return code;
    }

}
