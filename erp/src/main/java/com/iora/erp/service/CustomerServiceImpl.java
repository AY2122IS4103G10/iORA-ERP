package com.iora.erp.service;

import java.security.SecureRandom;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.model.customer.Customer;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("customerServiceImpl")
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public void createCustomerAccount(Customer customer) throws CustomerException {
        try {
            em.persist(customer);
        } catch (Exception ex) {
            throw new CustomerException("Customer has been already been created");
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
    public List<Customer> listOfCustomer() throws CustomerException {
        try {
            Query q = em.createQuery("SELECT c FROM Customer c");

            // need run test if query exits timing for large database
            return q.getResultList();
        } catch (Exception ex) {
            throw new CustomerException();
        }
    }

    @Override
    public List<Customer> getCustomerByFields(String search) {
        Query q = em.createQuery("SELECT c FROM Customer c WHERE LOWER(c.getEmail) Like :email OR " +
                "LOWER(c.getLastName) Like :last OR LOWER(c.getFirstName) Like :first OR c.getContactNumber Like :contact");
        q.setParameter("email", "%" + search.toLowerCase() + "%");
        q.setParameter("last", "%" + search.toLowerCase() + "%");
        q.setParameter("first", "%" + search.toLowerCase() + "%");
        q.setParameter("contact", "%" + search + "%");
        return q.getResultList();
    }

    @Override
    public Customer getCustomerById(Long id) throws CustomerException {
        Customer customer = em.find(Customer.class, id);
        if (customer == null) {
            throw new CustomerException("Customer with id: " + id + " not found.");
        }
        return customer;
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
    public byte[] saltGeneration() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    @Override
    public Customer loginAuthentication(Customer customer) throws CustomerException {
        try {
            Customer c = getCustomerByEmail(customer.getEmail());
            if (c.authentication(customer.gethashPass())) {
                return c;
            } else {
                throw new CustomerException();
            }
        } catch (Exception ex) {
            throw new CustomerException("Invalid Username or Password.");
        }

    }

}