package com.iora.erp.service;

import java.util.List;

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

public interface AdminService {
    //need fix @role things
    public abstract void createJobTitle(JobTitle jobTitle) throws JobTitleException;
    public abstract void updateJobTitle(JobTitle jobTitle) throws JobTitleException;
    public abstract void deleteJobTitle(Long id) throws JobTitleException;
    public abstract List<JobTitle> listOfJobTitles() throws JobTitleException;
    public abstract List<JobTitle> getJobTitlesByFields(String search) throws JobTitleException;
    public abstract JobTitle getJobTitleById(Long id)  throws JobTitleException;
    public abstract JobTitle getJobTitlesByName(String name) throws JobTitleException;

    //vendor
    public abstract void createDepartment(Department department) throws DepartmentException;
    public abstract void editDepartment(Department department) throws DepartmentException;
    public abstract void deleteDepartment(Long id) throws DepartmentException;
    public abstract List<Department> listOfDepartments() throws DepartmentException;
    public abstract List<Department> getDepartmentsByFields(String search) throws DepartmentException;
    public abstract Department getDepartmentById(Long id)  throws DepartmentException;
    public abstract Department getDepartmentsByName(String name) ;
    public abstract List<Employee> getEmployeesInDepartments(String deparment) throws DepartmentException;

    public abstract void createAddress(Address address) throws AddressException;
    public abstract void updateAddress(Address address) throws AddressException;
    public abstract void deleteAddress(Address address) throws AddressException;
    public abstract Address getAddressById(Long id)  throws AddressException;
    public abstract List<Address> getListAddress();
    public abstract List<Address> getListAddressFields(String search);
    public abstract Boolean checkAddress(Address address) ;

    public abstract void createCompany(Company company, Address address) throws CompanyException;
    public abstract void addADepartmentToCompany(Long cid, Long did) throws CompanyException, DepartmentException;
    public abstract void addAVendorToCompany(Long cid, Long vid) throws CompanyException, VendorException;
    public abstract void removeADepartmentToCompany(Long cid, Long did) throws CompanyException, DepartmentException;
    public abstract void removeAVendorToCompany(Long cid, Long vid) throws CompanyException, VendorException;
    public abstract void editCompany(Company company) throws CompanyException;
    public abstract void deleteCompany(Company company) throws CompanyException;
    public abstract List<Company> listOfCompanys() throws CompanyException;
    public abstract List<Company> getCompanysByFields(String search);
    public abstract Company getCompanyById(Long id)  throws CompanyException;
    public abstract Company getCompanysByName(String name) ;
    public abstract Boolean checkUniqueR(String register) ;
    public abstract Boolean checkUniqueN(String name) ;

    public abstract void createVendor(Vendor vendor) throws VendorException;
    public abstract void updateVendor(Vendor vendor) throws VendorException, AddressException;
    public abstract void deleteVendor(Vendor vendor) throws VendorException;
    public abstract Vendor getVendorById(Long id)  throws VendorException;
    public abstract Boolean uniqueVendorName(String name) throws VendorException;

}

