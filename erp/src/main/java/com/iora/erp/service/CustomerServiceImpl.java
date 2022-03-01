package com.iora.erp.service;

import java.math.BigInteger;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.IntStream;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.RegistrationException;
import com.iora.erp.model.customer.BirthdayPoints;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.Voucher;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("customerServiceImpl")
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired

    @PersistenceContext
    private EntityManager em;

    @Override
    public Customer createCustomerAccount(Customer customer) throws RegistrationException {
        Customer newC = customer;

        try {
            getCustomerByEmail(customer.getEmail());
            throw new RegistrationException("Account with " + customer.getEmail() + " has already been created");

        } catch (CustomerException ex) {
            newC.setMembershipTier(findMembershipTierById("BASIC"));
            newC.setAvailStatus(true);
            byte[] salt = saltGeneration();
            newC.setSalt(salt.toString());
            newC.sethashPass(generateProtectedPassword(salt.toString(), customer.gethashPass()));
            em.persist(newC);

            return newC;
        }

    }

    @Override
    public Customer updateCustomerAccount(Customer customer) throws CustomerException {
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
        old.setDob(customer.getDob());
        old.setFirstName(customer.getFirstName());
        old.setLastName(customer.getLastName());

        return old;
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
        // need run test if query exits timing for large database
        return em.createQuery("SELECT c FROM Customer c", Customer.class).getResultList();
    }

    @Override
    public List<Customer> getCustomerByFields(String search) {
        /*
         * TypedQuery<Customer> q = em.
         * createQuery("SELECT c FROM Customer c WHERE LOWER(c.getEmail) Like :email OR "
         * +
         * "LOWER(c.getLastName) Like :last OR LOWER(c.getFirstName) Like :first OR c.getContactNumber Like :contact"
         * , Customer.class);
         */
        return em.createQuery("SELECT c FROM Customer c WHERE LOWER(c.email) LIKE :email OR " +
                "LOWER(c.LastName) LIKE :last OR LOWER(c.firstName) LIKE :first OR c.contactNumber LIKE :contact",
                Customer.class)
                .setParameter("email", "%" + search.toLowerCase() + "%")
                .setParameter("last", "%" + search.toLowerCase() + "%")
                .setParameter("first", "%" + search.toLowerCase() + "%")
                .setParameter("contact", "%" + search + "%")
                .getResultList();
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
        Query q = em.createQuery("SELECT c FROM Customer c WHERE c.email = :email");
        q.setParameter("email", email);
        try {
            return (Customer) q.getSingleResult();
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new CustomerException("Customer email " + email + " does not exist.");
        }
    }

    @Override
    public Customer getCustomerByPhone(String phone) throws CustomerException {
        TypedQuery<Customer> q = em.createQuery("SELECT DISTINCT c FROM Customer c WHERE c.contactNumber = :phone",
                Customer.class);
        q.setParameter("phone", phone);

        Customer c = q.getSingleResult();

        if (c == null) {
            throw new CustomerException("Customer information cannot be retrieved");
        } else {
            return c;
        }
    }

    @Override
    public Customer loginAuthentication(String email, String password) throws CustomerException {
        try {

            Customer c = getCustomerByEmail(email);

            if (c.authentication(generateProtectedPassword(c.getSalt(), password))) {
                return c;
            } else {
                throw new CustomerException("Authentication Fail");
            }
        } catch (Exception ex) {
            throw new CustomerException("Authentication Fail. Invalid Username or Password.");
        }

    }

    @Override
    public Voucher getVoucher(String voucherCode) throws CustomerException {
        Voucher voucher = em.find(Voucher.class, voucherCode);

        if (voucher == null) {
            throw new CustomerException("Voucher with voucherCode " + voucherCode + " does not exist.");
        } else {
            return voucher;
        }
    }

    @Override
    public List<Voucher> generateVouchers(double amount, int qty, String date) {
        List<Voucher> vouchers = new ArrayList<>();

        IntStream.range(0, qty)
                .forEach(i -> {
                    Voucher voucher1 = new Voucher(amount, LocalDate.parse(date));
                    try {
                        getVoucher(voucher1.getVoucherCode());
                        // Voucher with the generate voucher code already exist
                        Voucher voucher2 = new Voucher(amount, LocalDate.parse(date));
                        em.persist(voucher2);
                        vouchers.add(voucher2);
                    } catch (CustomerException ex) {
                        // Voucher code does not already exist
                        em.persist(voucher1);
                        vouchers.add(voucher1);
                    }
                });

        return vouchers;
    }

    @Override
    public List<Voucher> getAllVouchers() {
        TypedQuery<Voucher> q;
        q = em.createQuery("SELECT v FROM Voucher v", Voucher.class);
        return q.getResultList();
    }

    @Override
    public List<Voucher> getAvailableVouchersByAmount(double amount) {
        TypedQuery<Voucher> q;
        q = em.createQuery("SELECT v FROM Voucher v WHERE :amount = v.amount AND v.issued = false", Voucher.class);
        q.setParameter("amount", amount);
        return q.getResultList();
    }

    @Override
    public void deleteVoucher(String voucherCode) throws CustomerException {
        Voucher voucher = getVoucher(voucherCode);
        if (voucher.isIssued() || voucher.isRedeemed()) {
            throw new CustomerException("Voucher has been issued and cannot be deleted.");
        } else {
            em.remove(voucher);
        }
    }

    @Override
    public Voucher issueVoucher(String voucherCode) throws CustomerException {
        Voucher voucher = getVoucher(voucherCode);
        voucher.setIssued(true);
        return voucher;
    }

    @Override
    public Voucher redeemVoucher(String voucherCode) throws CustomerException {
        Voucher voucher = getVoucher(voucherCode);
        voucher.setRedeemed(true);
        return voucher;
    }

    @Override
    public List<MembershipTier> listOfMembershipTier() {
        return em.createQuery("SELECT m FROM MembershipTier m", MembershipTier.class).getResultList();
    }

    @Override
    public MembershipTier findMembershipTierById(String name) {
        return em.find(MembershipTier.class, name.toUpperCase());
    }

    @Override
    public void createMembershipTier(MembershipTier membershipTier) {
        if (membershipTier.getBirthday() == null) {
            membershipTier.setBirthday(em.find(BirthdayPoints.class, "STANDARD"));
        }
        em.merge(membershipTier);
    }

    private byte[] saltGeneration() {
        SecureRandom random = new SecureRandom();
        byte[] salt = new byte[16];
        random.nextBytes(salt);
        return salt;
    }

    private String generateProtectedPassword(String salt, String password) {
        String generatedPassword;
        try {
            MessageDigest md = MessageDigest.getInstance("SHA-512");
            md.reset();
            md.update((salt + password).getBytes("utf8"));

            generatedPassword = String.format("%0129x", new BigInteger(1, md.digest()));
            return generatedPassword;

        } catch (Exception ex) {
            return null;
        }
    }

}