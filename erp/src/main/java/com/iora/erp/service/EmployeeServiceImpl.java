package com.iora.erp.service;

import java.security.SecureRandom;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TransactionRequiredException;

import com.iora.erp.exception.DepartmentException;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.exception.JobTitleException;
import com.iora.erp.model.company.Department;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("employeeServiceImpl")
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    @PersistenceContext
    private EntityManager em;

    private AdminServiceImpl adminService;

    @Override
    public void createEmployee(Employee employee) throws EmployeeException {
        try {
            em.persist(employee);
        } catch (Exception ex) {
            throw new EmployeeException("Employee has already been created");
        }
    }

    @Override
    public void updateEmployeeAccount(Employee employee) throws EmployeeException {
        Employee old = em.find(Employee.class, employee.getId());

        if (old == null) {
            throw new EmployeeException("Employee not found");
        }

        try {
            old.setUsername(employee.getUsername());
        } catch (Exception ex) {
            throw new EmployeeException("Username " + employee.getUsername() + " has been used!");
        }

        // department
        try {
            Department d = adminService.getDepartmentById(employee.getDepartment().getId());
            old.setDepartment(d);
        } catch (DepartmentException e) {
            throw new EmployeeException();
        }

        try {
            JobTitle j = adminService.getJobTitleById(employee.getJobTitle().getId());
            old.setJobTitle(j);
        } catch (JobTitleException e) {
            throw new EmployeeException();
        }

        old.setName(employee.getName());
        old.setSalary(employee.getSalary());
    }

    @Override
    public void blockEmployee(Employee employee) throws EmployeeException {
        Employee e = em.find(Employee.class, employee.getId());

        if (e == null) {
            throw new EmployeeException("Employee not found");
        }
        e.setAvailStatus(false);
    }

    @Override
    public void unblockEmployee(Employee employee) throws EmployeeException {
        Employee e = em.find(Employee.class, employee.getId());

        if (e == null) {
            throw new EmployeeException("Employee not found");
        }
        e.setAvailStatus(true);
    }

    @Override
    public void removeEmployee(Employee employee) throws EmployeeException {
        try {
            Employee e = em.find(Employee.class, employee.getId());

            if (e == null) {
                throw new EmployeeException("Employee not found");
            }

            em.remove(e);
            em.flush();
        } catch (IllegalArgumentException | TransactionRequiredException ex) {
            blockEmployee(employee);
        }
    }

    @Override
    public List<Employee> listOfEmployee() throws EmployeeException {
        try {
            Query q = em.createQuery("SELECT e FROM Employee e");

            // need run test if query exits timing for large database
            return q.getResultList();
        } catch (Exception ex) {
            throw new EmployeeException();
        }
    }

    @Override
    public List<Employee> getEmployeeByFields(String search) {
        Query q = em.createQuery("SELECT e FROM Employee e WHERE LOWER(e.getEmail) Like :email OR " +
                "LOWER(e.getName) Like :name OR LOWER(c.getUsername) Like :username OR c.getSalary Like :salary");
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
        Query q = em.createQuery("SELECT e FROM Employee e WHERE e.getUsername = :username");
        q.setParameter("username", username);

        try {
            return (Employee) q.getSingleResult();

        } catch (NoResultException | NonUniqueResultException ex) {
            throw new EmployeeException("Employee username " + username + " does not exist.");
        }
    }

    @Override
    public byte[] saltGeneration() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    @Override
    public Employee loginAuthentication(Employee employee) throws EmployeeException {
        try {
            Employee c = getEmployeeByUsername(employee.getUsername());
            if (c.authentication(employee.getHashPass())) {
                return c;
            } else {
                throw new EmployeeException();
            }
        } catch (Exception ex) {
            throw new EmployeeException("Invalid Username or Password.");
        }

    }
}
