package com.iora.erp.service;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Calendar;
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
import com.iora.erp.exception.SupportTicketException;
import com.iora.erp.model.customer.BirthdayPoints;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.SupportTicket;
import com.iora.erp.model.customer.SupportTicketMsg;
import com.iora.erp.model.customer.Voucher;
import com.iora.erp.utils.StringGenerator;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("customerServiceImpl")
@Transactional
public class CustomerServiceImpl implements CustomerService {

    @Autowired
    private EmailService emailService;
    @PersistenceContext
    private EntityManager em;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    public Customer createCustomerAccount(Customer customer) throws RegistrationException {
        try {
            getCustomerByPhone(customer.getContactNumber());
            throw new RegistrationException("Phone number already exists.");
        } catch (CustomerException e) {
            // Do nothing
        }

        try {
            getCustomerByEmail(customer.getEmail());
            throw new RegistrationException("Email already exists.");
        } catch (CustomerException e) {
            customer.setMembershipTier(findMembershipTierById("BASIC"));
            customer.setPassword(passwordEncoder.encode(customer.getPassword()));
            em.persist(customer);

            return customer;
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
    public Customer editCustomerAccount(Customer customer) throws CustomerException {
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
        old.setMembershipPoints(customer.getMembershipPoints());
        old.setStoreCredit(customer.getStoreCredit());

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
                "LOWER(c.lastName) LIKE :last OR LOWER(c.firstName) LIKE :first OR c.contactNumber LIKE :contact",
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

        try {
            return (Customer) q.getSingleResult();
        } catch (NoResultException | NonUniqueResultException ex) {
            throw new CustomerException("Customer phone number " + phone + " does not exist.");
        }
    }

    @Override
    public Customer loginAuthentication(String email, String password) throws CustomerException {
        try {
            Customer c = getCustomerByEmail(email);

            if (passwordEncoder.matches(password, c.getPassword())) {
                return c;
            } else {
                throw new CustomerException("Authentication Fail");
            }
        } catch (Exception ex) {
            throw new CustomerException("Authentication Fail. Invalid Username or Password.");
        }
    }

    @Override
    public void resetPassword(Long id) throws CustomerException {
        Customer c = getCustomerById(id);
        String tempPassword = StringGenerator.generateRandom(48, 122, 8);
        c.setPassword(passwordEncoder.encode(tempPassword));

        emailService.sendCustomerPassword(c, tempPassword);
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
                    try {
                        Voucher voucher1 = new Voucher(amount, new SimpleDateFormat("yyyy-MM-dd").parse(date));
                        em.persist(voucher1);
                        vouchers.add(voucher1);
                    } catch (ParseException e) {
                        e.printStackTrace();
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
    public Voucher issueVoucher(String voucherCode, Long customerId) throws CustomerException {
        Voucher voucher = getVoucher(voucherCode);
        Customer customer = getCustomerById(customerId);

        emailService.sendSimpleMessage(customer.getEmail(), "iORA S$" + voucher.getAmount() + " Voucher",
                "Dear customer, Your S$" + voucher.getAmount() + " voucher code is " + voucher.getVoucherCode()
                        + ". Please redeem it any of our physical or online stores before the expiry date "
                        + new SimpleDateFormat("yyyy-mm-dd").format(voucher.getExpiry()));
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
    public Customer redeemPoints(String email, int amount) throws CustomerException {
        Customer customer = getCustomerByEmail(email);
        if (customer.getMembershipPoints() < amount) {
            throw new CustomerException("Insufficient membership points");
        } else {
            customer.setMembershipPoints(customer.getMembershipPoints() - amount);
        }

        Calendar cal = Calendar.getInstance();
        cal.add(Calendar.YEAR, 2);
        Voucher v = new Voucher(amount, cal.getTime());
        em.persist(v);

        issueVoucher(v.getVoucherCode(), customer.getId());
        return customer;
    }

    @Override
    public List<MembershipTier> listOfMembershipTier() {
        return em.createQuery("SELECT m FROM MembershipTier m ORDER BY m.multiplier ASC", MembershipTier.class)
                .getResultList();
    }

    @Override
    public MembershipTier findMembershipTierById(String name) {
        return em.find(MembershipTier.class, name.toUpperCase());
    }

    @Override
    public MembershipTier createMembershipTier(MembershipTier membershipTier) {
        if (membershipTier.getBirthday() == null) {
            membershipTier.setBirthday(em.find(BirthdayPoints.class, "STANDARD"));
        }
        return em.merge(membershipTier);
    }

    @Override
    public void deleteMembershipTier(String name) {
        MembershipTier membershipTier = em.find(MembershipTier.class, name);
        if (membershipTier != null) {
            TypedQuery<Customer> q = em.createQuery("SELECT c FROM Customer c WHERE c.membershipTier = :tier",
                    Customer.class);
            q.setParameter("tier", membershipTier);

            for (Customer c : q.getResultList()) {
                c.setMembershipTier(em
                        .createQuery("SELECT m FROM MembershipTier m ORDER BY m.multiplier ASC", MembershipTier.class)
                        .getResultList().get(0));
            }

            em.remove(membershipTier);
        }
    }

    @Override
    public SupportTicket getSupportTicket(Long id) throws SupportTicketException {
        SupportTicket st = em.find(SupportTicket.class, id);
        if (st == null) {
            throw new SupportTicketException("Support ticket cannot be found.");
        }
        return st;
    }

    @Override
    public List<SupportTicket> getAllSupportTickets() {
        TypedQuery<SupportTicket> q = em.createQuery("SELECT st FROM SupportTicket st", SupportTicket.class);
        return q.getResultList();
    }

    @Override
    public SupportTicket createSupportTicket(SupportTicket supportTicket) {
        em.persist(supportTicket);
        return supportTicket;
    }

    @Override
    public SupportTicket updateSupportTicket(SupportTicket supportTicket) throws SupportTicketException {
        getSupportTicket(supportTicket.getId());
        return em.merge(supportTicket);
    }

    @Override
    public SupportTicket resolveSupportTicket(Long id) throws SupportTicketException {
        SupportTicket st = getSupportTicket(id);
        st.setStatus(SupportTicket.Status.RESOLVED);
        return em.merge(st);
    }

    @Override
    public SupportTicket replySupportTicket(Long id, String message, String name, String imageUrl)
            throws SupportTicketException {
        SupportTicket st = getSupportTicket(id);

        if (st.getStatus() == SupportTicket.Status.RESOLVED) {
            throw new SupportTicketException("Ticket has already been resolved.");
        } else if (st.getStatus() == SupportTicket.Status.PENDING) {
            st.setStatus(SupportTicket.Status.PENDING_CUSTOMER);
        } else {
            st.setStatus(SupportTicket.Status.PENDING);
        }

        st.addMessage(new SupportTicketMsg(message, name, imageUrl));
        return em.merge(st);
    }

    @Override
    public Long deleteSupportTicket(Long id) throws SupportTicketException {
        SupportTicket st = getSupportTicket(id);
        Customer c = st.getCustomer();
        c.removeSupportTicket(st);

        em.remove(st);
        return id;
    }
}