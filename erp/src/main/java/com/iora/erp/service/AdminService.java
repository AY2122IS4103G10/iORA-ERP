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
    public abstract JobTitle createJobTitle(JobTitle jobTitle) throws JobTitleException;
    public abstract JobTitle updateJobTitle(JobTitle jobTitle) throws JobTitleException;
    public abstract void deleteJobTitle(Long id) throws JobTitleException;
    public abstract List<JobTitle> listOfJobTitles() throws JobTitleException;
    public abstract List<JobTitle> getJobTitlesByFields(String search) throws JobTitleException;
    public abstract List<String> getAccessRights();
    public abstract JobTitle getJobTitleById(Long id)  throws JobTitleException;
    public abstract JobTitle getJobTitlesByName(String name) throws JobTitleException;

    public abstract Department createDepartment(Department department) throws DepartmentException;
    public abstract Department editDepartment(Department department) throws DepartmentException;
    public abstract void deleteDepartment(Long id) throws DepartmentException, CompanyException;
    public abstract List<Department> listOfDepartments() throws DepartmentException;
    public abstract List<Department> getDepartmentsByFields(String search) throws DepartmentException;
    public abstract Boolean checkJTInDepartment(Long did, Long jid) throws DepartmentException;
    public abstract Department getDepartmentById(Long id) throws DepartmentException;
    public abstract Department getDepartmentsByName(String name) ;
    public abstract List<Employee> getEmployeesInDepartments(String deparment) throws DepartmentException;

    public abstract Address createAddress(Address address) throws AddressException;
    public abstract Address updateAddress(Address address) throws AddressException;
    public abstract void deleteAddress(Address address) throws AddressException;
    public abstract Address getAddressById(Long id)  throws AddressException;
    public abstract List<Address> getListAddress();
    public abstract List<Address> getListAddressFields(String search);
    public abstract Boolean checkAddress(Address address) ;

    public abstract Company createCompany(Company company) throws CompanyException;
    public abstract void addADepartmentToCompany(Long cid, Long did) throws CompanyException, DepartmentException;
    public abstract void addAVendorToCompany(Long cid, Long vid) throws CompanyException, VendorException;
    public abstract void removeADepartmentToCompany(Long cid, Long did) throws CompanyException, DepartmentException;
    public abstract void removeAVendorToCompany(Long cid, Long vid) throws CompanyException, VendorException;
    public abstract Company editCompany(Company company) throws CompanyException;
    public abstract void deleteCompany(Long id) throws CompanyException;
    public abstract List<Company> listOfCompanys() throws CompanyException;
    public abstract List<Company> getCompanysByFields(String search) throws CompanyException;
    public abstract Company getCompanyById(Long id)  throws CompanyException;
    public abstract Company getCompanysByName(String name) ;
    public abstract Boolean checkUniqueR(String register) ;
    public abstract Boolean checkUniqueN(String name) ;

    public abstract Vendor createVendor(Vendor vendor) throws VendorException;
    public abstract Vendor updateVendor(Vendor vendor) throws VendorException, AddressException;
    public abstract void deleteVendor(Long id) throws VendorException;
    public abstract List<Vendor> getListofVendor(String search) throws VendorException;
    public abstract List<Vendor> listofVendor() throws VendorException;
    public abstract Vendor getVendorById(Long id)  throws VendorException;
    public abstract Boolean uniqueVendorName(String name) throws VendorException;

}

