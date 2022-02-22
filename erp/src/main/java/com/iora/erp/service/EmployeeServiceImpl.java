package com.iora.erp.service;

import java.security.SecureRandom;
import java.util.List;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TransactionRequiredException;

import com.iora.erp.enumeration.AccessRights;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.model.company.Employee;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("employeeServiceImpl")
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    @PersistenceContext
    private EntityManager em;

    @Autowired
    private AdminService adminService;

    @Override
    public void createEmployee(Employee employee) throws EmployeeException {
        Employee e = employee;
        
        try {
            if (adminService.checkJTInDepartment(employee.getDepartment().getId(),
            employee.getJobTitle().getId()) == true) {
                
                e.setSalt(saltGeneration().toString());
                e.setPassword(employee.getPassword());
                em.persist(e);
                e.setDepartment(adminService.getDepartmentById(employee.getDepartment().getId()));
                e.setJobTitle(adminService.getJobTitleById(employee.getJobTitle().getId()));
                e.setCompany(adminService.getCompanyById(employee.getCompany().getId()));
            } else {
                throw new EmployeeException();
            }

        } catch (EmployeeException ex) {
            throw new EmployeeException("Job Title selected for the Employee: " + e.getName()
                    + " is not applicable for the choosen department");
        } catch (Exception ex) {
            throw new EmployeeException("Employee has already been created" + ex.toString());
        }
    }

    @Override
    public void updateEmployeeAccount(Employee employee) throws EmployeeException {
        Employee old = em.find(Employee.class, employee.getId());

        if (old == null) {
            throw new EmployeeException("Employee not found");
        }

        try {
            if (adminService.checkJTInDepartment(employee.getDepartment().getId(),
                    employee.getJobTitle().getId()) == true) {

                if ((!old.getUsername().equals(employee.getUsername()) &&
                        usernameAvailability(employee.getUsername()) == true) ||
                        old.getUsername().equals(employee.getUsername())) {


                    if (!old.getEmail().equals(employee.getEmail()) ||
                            (!old.getEmail().equals(employee.getEmail())
                                    && emailAvailability(old.getEmail()) == true)) {

                        old.setUsername(employee.getUsername());
                        old.setEmail(employee.getEmail());
                        old.setDepartment(adminService.getDepartmentById(employee.getDepartment().getId()));
                        old.setJobTitle(adminService.getJobTitleById(employee.getJobTitle().getId()));
                        old.setName(employee.getName());
                        old.setSalary(employee.getSalary());
                        old.setPayType(employee.getPayType());

                        if(!old.getCompany().getId().equals(employee.getCompany().getId())) {
                            old.setCompany(adminService.getCompanyById(employee.getCompany().getId()));
                        }


                    } else {
                        throw new EmployeeException("Email has been taken!");
                    }

                } else {
                    throw new EmployeeException("Username has been taken!");
                }
            } else {
                throw new EmployeeException("JobTitle is not applicable for selected Department");
            }
        } catch (Exception ex) {
            throw new EmployeeException(ex.getMessage());
        }

    }

    @Override
    public void blockEmployee(Long id) throws EmployeeException {
        Employee e = em.find(Employee.class, id);

        if (e == null) {
            throw new EmployeeException("Employee not found");
        }
        e.setAvailStatus(false);
    }

    @Override
    public void unblockEmployee(Long id) throws EmployeeException {
        Employee e = em.find(Employee.class, id);

        if (e == null) {
            throw new EmployeeException("Employee not found");
        }
        e.setAvailStatus(true);
    }

    @Override
    public void removeEmployee(Long id) throws EmployeeException {
        try {
            Employee e = em.find(Employee.class, id);

            if (e == null) {
                throw new EmployeeException("Employee not found");
            }
            em.remove(e);
            em.flush();
        } catch (IllegalArgumentException | TransactionRequiredException ex) {
            blockEmployee(id);
        }
    }

    @Override
    public List<Employee> listOfEmployee() throws EmployeeException {
        try {
            Query q = em.createQuery("SELECT e FROM Employee e");
            return q.getResultList();

        } catch (Exception ex) {
            throw new EmployeeException();
        }
    }

    @Override
    public List<Employee> getEmployeeByFields(String search) throws EmployeeException {
        if (search == "") {
            return listOfEmployee();
        }
        Query q = em.createQuery("SELECT e FROM Employee e WHERE LOWER(e.email) LIKE :email OR " +
                "LOWER(e.name) LIKE :name OR LOWER(e.username) LIKE :username OR e.salary LIKE :salary");
        q.setParameter("email", "%" + search.toLowerCase() + "%");
        q.setParameter("username", "%" + search.toLowerCase() + "%");
        q.setParameter("name", "%" + search.toLowerCase() + "%");
        q.setParameter("salary", "%" + search + "%");
        return q.getResultList();
    }

    @Override
    public Employee getEmployeeById(Long id) throws EmployeeException {
        Employee employee = em.find(Employee.class, id);
        if (employee == null) {
            throw new EmployeeException("Employee with id: " + id + " not found.");
        }
        return employee;

    }

    @Override
    public Employee getEmployeeByUsername(String username) throws EmployeeException {
        Query q = em.createQuery("SELECT e FROM Employee e WHERE e.username = :username");
        q.setParameter("username", username);

        try {
            return (Employee) q.getSingleResult();

        } catch (NoResultException | NonUniqueResultException ex) {
            throw new EmployeeException("Employee username " + username + " does not exist.");
        }
    }

    @Override
    public Set<AccessRights> getEmployeeAccessRights(Long id) throws EmployeeException {
        return getEmployeeById(id).getJobTitle().getResponsibility();
    }

    @Override
    public Set<AccessRights> getEmployeeAccessRightsByUsername(String username) throws EmployeeException {
        return getEmployeeByUsername(username).getJobTitle().getResponsibility();
    }

    @Override
    public byte[] saltGeneration() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    @Override
    public Boolean usernameAvailability(String username) {
        Query q = em.createQuery("SELECT e FROM Employee e WHERE e.username = :username");
        q.setParameter("username", username);
        try {
            Employee e = (Employee) q.getSingleResult();
            return false;
            
        } catch (NoResultException | NonUniqueResultException ex) {
            return true;
        }
    }

    @Override
    public Boolean emailAvailability(String email) {
        Query q = em.createQuery("SELECT e FROM Employee e WHERE e.email = :email");
        q.setParameter("email", email);
        try {
            Employee e = (Employee) q.getSingleResult();
            return false;
            
        } catch (NoResultException | NonUniqueResultException ex) {
            return true;
        }
    }

    /*
     * @Override
     * public Employee loginAuthentication(Employee employee) throws
     * EmployeeException {
     * try {
     * Employee c = getEmployeeByUsername(employee.getUsername());
     * if (c.authentication(employee.getPassword()))) {
     * return c;
     * } else {
     * throw new EmployeeException();
     * }
     * } catch (Exception ex) {
     * throw new EmployeeException("Invalid Username or Password.");
     * }
     * 
     * }
     */
}
