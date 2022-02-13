package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;

public interface CustomerService {
    public abstract void createCustomerAccount(Customer customer) throws CustomerException;
    public abstract void updateCustomerAccount(Customer customer) throws CustomerException;
    public abstract void blockCustomer(Customer customer) throws CustomerException;
    public abstract void unblockCustomer(Customer customer) throws CustomerException;
    public abstract List<Customer> listOfCustomer() throws CustomerException;
    public abstract List<Customer> getCustomerByFields(String search);
    public abstract Customer getCustomerById(Long id)  throws CustomerException;
    public abstract Customer getCustomerByEmail(String Email) throws CustomerException;
    
    public abstract byte[] saltGeneration();
    public abstract Customer loginAuthentication(Customer customer) throws CustomerException;

}
