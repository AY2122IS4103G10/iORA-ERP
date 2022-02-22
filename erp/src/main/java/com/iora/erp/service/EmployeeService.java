package com.iora.erp.service;

import java.util.List;
import java.util.Set;

import com.iora.erp.enumeration.AccessRights;
import com.iora.erp.exception.EmployeeException;
import com.iora.erp.model.company.Employee;


public interface EmployeeService {
    public abstract void createEmployee(Employee employee) throws EmployeeException;
    public abstract void updateEmployeeAccount(Employee employee) throws EmployeeException;
    public abstract void removeEmployee(Long id) throws EmployeeException;
    public abstract void blockEmployee(Long id) throws EmployeeException;
    public abstract void unblockEmployee(Long id) throws EmployeeException;
    public abstract List<Employee> listOfEmployee() throws EmployeeException;
    public abstract List<Employee> getEmployeeByFields(String search) throws EmployeeException;
    public abstract Employee getEmployeeById(Long id)  throws EmployeeException;
    public abstract Employee getEmployeeByUsername(String username) throws EmployeeException;
    public abstract Set<AccessRights> getEmployeeAccessRights(Long id) throws EmployeeException;
    public abstract Set<AccessRights> getEmployeeAccessRightsByUsername(String username) throws EmployeeException;

    public abstract byte[] saltGeneration();
    public abstract Boolean usernameAvailability(String username);
    public abstract Boolean emailAvailability(String email);
    //public abstract Employee loginAuthentication(Employee employee) throws EmployeeException;
}
