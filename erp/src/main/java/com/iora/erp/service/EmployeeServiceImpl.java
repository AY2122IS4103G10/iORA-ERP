package com.iora.erp.service;

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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("employeeServiceImpl")
@Transactional
public class EmployeeServiceImpl implements EmployeeService {

    @PersistenceContext
    private EntityManager em;

    private AdminService adminService;

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
            old.setName(employee.getName());
            old.setSalary(employee.getSalary());

            old.setDepartment(adminService.getDepartmentById(employee.getDepartment().getId()));
            old.setJobTitle(adminService.getJobTitleById(employee.getJobTitle().getId()));

        } catch (Exception ex) {
            throw new EmployeeException("Username " + employee.getUsername() + " has been used!");
        }

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
    public List<Employee> getEmployeeByFields(String search) throws EmployeeException {
        if (search == null) {
            return listOfEmployee();
        } else {
            Query q = em.createQuery("SELECT e FROM Employee e WHERE LOWER(e.getEmail) Like :email OR " +
                    "LOWER(e.getName) Like :name OR LOWER(c.getUsername) Like :username OR c.getSalary Like :salary");
            q.setParameter("email", "%" + search.toLowerCase() + "%");
            q.setParameter("username", "%" + search.toLowerCase() + "%");
            q.setParameter("name", "%" + search.toLowerCase() + "%");
            q.setParameter("salary", "%" + search + "%");
            return q.getResultList();
        }
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


/*
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

    }*/

    @Override
    public Set<AccessRights> getEmployeeAccessRights(Long id) throws EmployeeException {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Set<AccessRights> getEmployeeAccessRightsByUsername(String username) throws EmployeeException {
        // TODO Auto-generated method stub
        return null;
    }

}
