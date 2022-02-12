package com.iora.erp.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;

import org.springframework.stereotype.Service;

@Service("customerServiceImpl")
public class CustomerServiceImpl implements CustomerService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void createCustomerAccount(Customer customer) throws CustomerException {
        try {
            em.persist(customer);
        } catch (Exception ex) {
            throw new CustomerException("Customer has been created");
        }
    }

    @Override
    public void updateCustomerAccount(Customer customer) throws CustomerException {
        Customer old = em.find(Customer.class, customer.getId());

        if (old == null) {
            throw new CustomerException("Customer not found");
        }

        try {
            old.setEmail(customer.getEmail());
        } catch (Exception ex) {
            throw new CustomerException("Email " + customer.getEmail() + " has been used!");
        }

        old.setContactNumber(customer.getContactNumber());
        old.setFirstName(customer.getFirstName());
        old.setFirstName(customer.getLastName());
    }

    @Override
    public void blockCustomer(Customer customer) throws CustomerException {
        Customer c = em.find(Customer.class, customer.getId());

        if (c == null) {
            throw new CustomerException("Customer not found");
        }
        c.setAvailStatus(false);
    }

    @Override
    public void unblockCustomer(Customer customer) throws CustomerException {
        Customer c = em.find(Customer.class, customer.getId());

        if (c == null) {
            throw new CustomerException("Customer not found");
        }
        c.setAvailStatus(true);

    }

    @Override
    public List<Customer> listOfCustomer() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Customer> getCustomerByFields(Customer customer) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Customer getCustomerById(Long id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Customer getCustomerByEmail(String email) throws CustomerException {
        Query q = em.createQuery("SELECT c FROM Customer c WHERE c.getEmail = :email");
        q.setParameter("email", email);

        try {
            Customer c = (Customer) q.getSingleResult();
            return c;
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new CustomerException("Customer email " + email + " does not exist.");
        }
    }

    @Override
    public String saltGeneration() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public String hashPassword(String password) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public Boolean loginAuthentication(Customer customer) {
        // TODO Auto-generated method stub
        return null;
    }
}
