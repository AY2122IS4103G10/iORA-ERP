package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;

public interface CustomerService {
    public abstract void createCustomerAccount(Customer customer) throws CustomerException;
    public abstract void updateCustomerAccount(Customer customer) throws CustomerException;
    public abstract void blockCustomer(Customer customer) throws CustomerException;
    public abstract void unblockCustomer(Customer customer) throws CustomerException;
    public abstract List<Customer> listOfCustomer();
    public abstract List<Customer> getCustomerByFields(Customer customer);
    public abstract Customer getCustomerById(Long id);
    public abstract Customer getCustomerByEmail(String Email) throws CustomerException;
    
    public abstract String saltGeneration();
    public abstract String hashPassword(String password);
    public abstract Boolean loginAuthentication(Customer customer);

}
