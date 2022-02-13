package com.iora.erp.service;

import java.security.SecureRandom;
import java.util.ArrayList;
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

@Service("adminServiceImpl")
public class AdminService implements AdminServiceImpl {
    @PersistenceContext
    private EntityManager em;

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

        //department
        try {
            Department d = getDepartmentById(employee.getDepartment().getId());
            old.setDepartment(d);
        } catch (DepartmentException e) {
           throw new EmployeeException();
        }

        try {
            JobTitle j = getJobTitleById(employee.getJobTitle().getId());
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

    @Override
    public void createJobTitle(JobTitle jobTitle) throws JobTitleException {
        try {
            em.persist(jobTitle);
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
    public void deleteJobTitle(JobTitle jobTitle) throws JobTitleException {
        JobTitle j = em.find(JobTitle.class, jobTitle.getId());

        if (j == null) {
            throw new JobTitleException("JobTitle not found");
        }

        em.remove(j);
        em.flush();
    }

    @Override
    public List<JobTitle> listOfJobTitles() throws JobTitleException {
        try {
            Query q = em.createQuery("SELECT e FROM JobTitle e");

            // need run test if query exits timing for large database
            return q.getResultList();
        } catch (Exception ex) {
            throw new JobTitleException();
        }
    }

    @Override
    public List<JobTitle> getJobTitlesByFields(String search) {
        Query q = em.createQuery("SELECT e FROM JobTitle e WHERE LOWER(e.getTitle) Like :title");
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
            Department d = new Department(department.getDeptName());
            em.persist(d);

            for (JobTitle j : department.getJobTitles()) {
                d.getJobTitles().add(j);
            }

        } catch (Exception ex) {
            throw new DepartmentException("Department has already been created");
        }
    }

    @Override
    public void updateDepartment(Department department) throws DepartmentException {
        Department old = em.find(Department.class, department.getId());

        if (old == null) {
            throw new DepartmentException("Department not found");
        }

        try {
            old.setDeptName(department.getDeptName());
        } catch (Exception ex) {
            throw new DepartmentException("Department " + department.getDeptName() + " has been used!");
        }

        old.setJobTitles(new ArrayList<>());
        for (JobTitle j : department.getJobTitles()){
            try {
                JobTitle newJ = getJobTitleById(j.getId());
                old.getJobTitles().add(newJ);
            } catch (JobTitleException e) {
                throw new DepartmentException("Error occured while changing Job Title");
            }
        }
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

            // need run test if query exits timing for large database
            return q.getResultList();
        } catch (Exception ex) {
            throw new DepartmentException();
        }
    }

    @Override
    public List<Department> getDepartmentsByFields(String search) {
        Query q = em.createQuery("SELECT e FROM Department e WHERE LOWER(e.getDeptName) Like :name");
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
        Query q = em.createQuery("SELECT e FROM Employee e, IN (e.department) d WHERE LOWER(d.getDeptName) = :name ORDER BY e.name");
        q.setParameter("name", department.toLowerCase());
        return q.getResultList();
    }

}
