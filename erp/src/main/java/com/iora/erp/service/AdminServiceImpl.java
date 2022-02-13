package com.iora.erp.service;

import java.util.List;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.model.company.Employee;

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
}

