package com.iora.erp.service;

import java.util.List;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.exception.JobTitleException;
import com.iora.erp.model.company.Employee;
import com.iora.erp.model.company.JobTitle;

public interface AdminServiceImpl {
    public abstract void createEmployee(Employee employee) throws EmployeeException;
    public abstract void updateEmployeeAccount(Employee employee) throws EmployeeException;
    public abstract void removeEmployee(Employee employee) throws EmployeeException;
    public abstract void blockEmployee(Employee employee) throws EmployeeException;
    public abstract void unblockEmployee(Employee employee) throws EmployeeException;
    public abstract List<Employee> listOfEmployee() throws EmployeeException;
    public abstract List<Employee> getEmployeeByFields(String search);
    public abstract Employee getEmployeeById(Long id)  throws EmployeeException;
    public abstract Employee getEmployeeByUsername(String email) throws EmployeeException;
    
    public abstract byte[] saltGeneration();
    public abstract Employee loginAuthentication(Employee employee) throws EmployeeException;

    //need fix @role things
    public abstract void createJobTitle(JobTitle jobTitle) throws JobTitleException;
    public abstract void updateJobTitle(JobTitle jobTitle) throws JobTitleException;
    public abstract void deleteJobTitle(JobTitle jobTitle) throws JobTitleException;
    public abstract List<Employee> listOfJobTitles() throws JobTitleException;
    public abstract List<Employee> getJobTitlesByFields(String search);
    public abstract Employee getJobTitleById(Long id)  throws JobTitleException;
    public abstract Employee ggetJobTitlesByName(String email) throws JobTitleException;
}

