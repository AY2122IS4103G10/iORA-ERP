package com.iora.erp.service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TransactionRequiredException;

import com.iora.erp.enumeration.AccessRights;
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
            old.setTitle(jobTitle.getTitle());
        } catch (Exception ex) {
            throw new JobTitleException("Job Title " + jobTitle.getTitle() + " has been used!");
        }

        old.setDescription(jobTitle.getDescription());
        old.setResponsibility(jobTitle.getResponsibility());
    }

    @Override
    public void deleteJobTitle(Long id) throws JobTitleException {
        JobTitle j = em.find(JobTitle.class, id);


        Query q = em.createQuery("SELECT e FROM Employee e WHERE e.jobTitle.id = :jobTitle");
        q.setParameter("jobTitle", id);
        Boolean employeeCheck = false;
        
        try {
            Employee e = (Employee) q.getSingleResult();
        } catch (Exception ex) {
            employeeCheck = true;
        }
        
        if (j == null) {
            throw new JobTitleException("JobTitle not found");
        } else if (employeeCheck == false) {
            throw new JobTitleException("JobTitle is currently being used.");
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
        if(search == null) {
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
                System.out.println(d.getJobTitles());
                d.getJobTitles().add(jt);
            }
            System.out.println(d);

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
            old.setDeptName(department.getDeptName());
            old.setJobTitles(new ArrayList<>());
            for (JobTitle j : department.getJobTitles()) {
                JobTitle newJ = getJobTitleById(j.getId());
                old.getJobTitles().add(newJ);
            }
        } catch (Exception ex) {
            throw new DepartmentException("Department " + department.getDeptName() + " has been used!");
        }


        System.out.println(old);
    }

    @Override
    public void deleteDepartment(Department department) throws DepartmentException {
        try {
            Department e = em.find(Department.class, department.getId());

            if (e == null) {
                throw new DepartmentException("Department not found");
            }

            em.remove(e);
            em.flush();
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
        if(search == null) {
            return listOfDepartments();
        }

        Query q = em.createQuery("SELECT e FROM Department e WHERE LOWER(e.deptName) LIKE :name");
        q.setParameter("name", "%" + search.toLowerCase() + "%");
        return q.getResultList();
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
        if(search == "") {
            return getListAddress();
        }
        Query q = em.createQuery(
                "SELECT a FROM Address a WHERE a.getBuilding LIKE :building OR a.getPostalCode LIKE :postal OR a.getUnit LIKE :unit");
        q.setParameter("building", "%" + search + "%");
        q.setParameter("postal", "%" + search + "%");
        q.setParameter("unit", "%" + search + "%");
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
                "SELECT e FROM Address e WHERE UPPER(e.getCountry) = :country AND LOWER(e.getCity) = :city " +
                        "AND LOWER(e.getPostalCode) = :postal AND LOWER(e.getUnit) = :unit");
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

    @Override // address to be persist beforehand, vendor and department and site is seperated
    public void createCompany(Company company, Address address) throws CompanyException {
        try {
            em.persist(company);

            Address a = getAddressById(address.getId());
            company.setAddress(a);

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
            throw new CompanyException();
        }
    }

    @Override
    public List<Company> getCompanysByFields(String search) {
        Query q = em.createQuery("SELECT c FROM Company c WHERE lOWER(e.getName) Like :name OR " +
                "LOWER(e.getRegisterNumber) Like :regsNum OR e.getTelephone Like :telephone");
        q.setParameter("name", "%" + search.toLowerCase() + "%");
        q.setParameter("regsNum", "%" + search.toLowerCase() + "%");
        q.setParameter("telephone", "%" + search + "%");

        return q.getResultList();
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
        Query q = em.createQuery("SELECT c FROM Company c WHERE LOWER(e.getName) = :name");
        q.setParameter("name", name.toLowerCase());

        return (Company) q.getSingleResult();
    }

    @Override
    public Boolean checkUniqueR(String register) {
        Query q = em.createQuery("SELECT e FROM Company e WHERE e.getRegisterNumber = :num");
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

    // need to add address first
    @Override
    public void createVendor(Vendor vendor) throws VendorException {
        try {
            em.persist(vendor);
        } catch (Exception ex) {
            throw new VendorException("Vendor has already already been created");
        }

    }

    @Override
    public void updateVendor(Vendor vendor) throws VendorException, AddressException {
        Vendor v = getVendorById(vendor.getId());

        if (vendor.getCompanyName() != v.getCompanyName()) {
            if (uniqueVendorName(vendor.getCompanyName()) == true) {
                v.setCompanyName(vendor.getCompanyName());
                v.setDescription(vendor.getDescription());
                v.setEmail(vendor.getDescription());
                v.setTelephone(vendor.getDescription());
                v.setAddress(new ArrayList<>());

                for (Address a : vendor.getAddress()) {
                    if (checkAddress(a) == true) {
                        Address aa = getAddressById(a.getId());
                        v.getAddress().add(aa);
                    } else {
                        em.persist(a);
                        v.getAddress().add(a);
                    }
                }
            } else {
                throw new VendorException("Vendor Name is not unique");
            }
        } else {
            v.setDescription(vendor.getDescription());
            v.setEmail(vendor.getDescription());
            v.setTelephone(vendor.getDescription());
            v.setAddress(new ArrayList<>());

            for (Address a : vendor.getAddress()) {
                if (checkAddress(a) == true) {
                    Address aa = getAddressById(a.getId());
                    v.getAddress().add(aa);
                } else {
                    em.persist(a);
                    v.getAddress().add(a);
                }
            }
        }
    }

    @Override
    public void deleteVendor(Vendor vendor) throws VendorException {
        Vendor v = getVendorById(vendor.getId());
        em.remove(v);

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
        Query q = em.createQuery("SELECT v FROM Vendor v WHERE Lower(v.getCompanyName) = :name");
        q.setParameter("name", name);

        if (q.getResultList().size() > 0) {
            return false;
        } else {
            return true;
        }

    }


}
