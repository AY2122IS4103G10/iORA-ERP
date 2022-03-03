package com.iora.erp.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.Calendar;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.Currency;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("customerOrderServiceImpl")
@Transactional
public class CustomerOrderServiceImpl implements CustomerOrderService {
    @Autowired
    CustomerService customerService;
    @PersistenceContext
    private EntityManager em;

    @Override
    public CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException {
        CustomerOrder customerOrder = em.find(CustomerOrder.class, id);

        if (customerOrder == null) {
            throw new CustomerOrderException("CustomerOrder with id " + id + " cannot be found.");
        } else {
            return customerOrder;
        }
    }

    @Override
    public List<OnlineOrder> getAllOnlineOrders() {
        TypedQuery<OnlineOrder> q = em.createQuery("SELECT oo FROM OnlineOrder oo", OnlineOrder.class);
        return q.getResultList();
    }

    @Override
    public List<OnlineOrder> getOnlineOrdersBySite(Long siteId) {
        TypedQuery<OnlineOrder> q = em.createQuery("SELECT oo FROM OnlineOrder oo WHERE oo.onlineStoreSiteId = :siteId",
                OnlineOrder.class);
        q.setParameter("siteId", siteId);
        return q.getResultList();
    }

    @Override
    public List<OnlineOrder> getOnlineOrdersBySiteDate(Long siteId, String date) {
        TypedQuery<OnlineOrder> q = em.createQuery(
                "SELECT oo FROM OnlineOrder oo WHERE oo.storeSiteId = :siteId AND SUBSTRING(oo.dateTime, 0, 10) = :date",
                OnlineOrder.class);
        q.setParameter("siteId", siteId);
        q.setParameter("date", date);
        return q.getResultList();
    }

    @Override
    public List<CustomerOrder> getAllInStoreOrders() {
        TypedQuery<CustomerOrder> q = em.createQuery("SELECT co FROM CustomerOrder co", CustomerOrder.class);
        List<CustomerOrder> customerOrders = q.getResultList();

        customerOrders.removeAll(getAllOnlineOrders());

        return customerOrders;
    }

    @Override
    public List<CustomerOrder> getInStoreOrdersBySite(Long siteId) {
        TypedQuery<CustomerOrder> q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.storeSiteId = :siteId",
                CustomerOrder.class);
        q.setParameter("siteId", siteId);
        return q.getResultList();
    }

    @Override
    public List<CustomerOrder> getInStoreOrdersBySiteDate(Long siteId, String date) {
        TypedQuery<CustomerOrder> q = em.createQuery(
                "SELECT co FROM CustomerOrder co WHERE co.storeSiteId = :siteId AND SUBSTRING(co.dateTime, 0, 10) = :date",
                CustomerOrder.class);
        q.setParameter("siteId", siteId);
        q.setParameter("date", date);
        return q.getResultList();
    }

    @Override
    public CustomerOrder createCustomerOrder(CustomerOrder customerOrder) {
        // updateMembershipPoints(customerOrder);
        em.persist(customerOrder);
        return customerOrder;
    }

    @Override
    public CustomerOrder updateCustomerOrder(CustomerOrder customerOrder) throws CustomerOrderException {
        CustomerOrder old = getCustomerOrder(customerOrder.getId());
        old.setDateTime(customerOrder.getDateTime());
        old.setLineItems(customerOrder.getLineItems());
        old.setPayments(customerOrder.getPayments());
        old.setExhcangedLIs(customerOrder.getExhcangedLIs());
        old.setRefundedLIs(customerOrder.getRefundedLIs());
        return em.merge(old);
    }

    @Override
    public CustomerOrderLI getCustomerOrderLI(Long id) throws CustomerOrderException {
        CustomerOrderLI customerOrderLI = em.find(CustomerOrderLI.class, id);

        if (customerOrderLI == null) {
            throw new CustomerOrderException("CustomerOrder LineItem with id " + id + " cannot be found.");
        } else {
            return customerOrderLI;
        }
    }

    @Override
    public List<CustomerOrderLI> getCustomerOrderLIs(CustomerOrder customerOrder) {
        return customerOrder.getLineItems();
    }

    @Override
    public CustomerOrderLI createCustomerOrderLI(CustomerOrderLI customerOrderLI) {
        em.persist(customerOrderLI);
        return customerOrderLI;
    }

    @Override
    public CustomerOrderLI updateCustomerOrderLI(CustomerOrderLI customerOrderLI) throws CustomerOrderException {
        CustomerOrderLI old = getCustomerOrderLI(customerOrderLI.getId());
        old.setProductItems(customerOrderLI.getProductItems());
        return em.merge(old);
    }

    @Override
    public Payment getPayment(Long id) throws CustomerOrderException {
        Payment payment = em.find(Payment.class, id);

        if (payment == null) {
            throw new CustomerOrderException("Payment with id " + id + " cannot be found.");
        } else {
            return payment;
        }
    }

    @Override
    public List<Payment> getAllPayments() {
        TypedQuery<Payment> q = em.createQuery("SELECT p FROM Payment p", Payment.class);
        return q.getResultList();
    }

    @Override
    public Payment createPayment(Payment payment) {
        em.persist(payment);
        return payment;
    }

    @Override
    public Payment updatePayment(Payment payment) throws CustomerOrderException {
        Payment old = getPayment(payment.getId());
        old.setAmount(payment.getAmount());
        old.setCcTransactionId(payment.getCcTransactionId());
        old.setDateTime(payment.getDateTime());
        return em.merge(old);
    }

    @Override
    public ExchangeLI getExchangeLI(Long id) throws CustomerOrderException {
        ExchangeLI exchangeLI = em.find(ExchangeLI.class, id);

        if (exchangeLI == null) {
            throw new CustomerOrderException("Echange Line Item with id " + id + " cannot be found.");
        } else {
            return exchangeLI;
        }
    }

    @Override
    public List<ExchangeLI> getAllExchangeLIs() {
        TypedQuery<ExchangeLI> q = em.createQuery("SELECT eLI FROM ExchangeLI eLI", ExchangeLI.class);
        return q.getResultList();
    }

    @Override
    public ExchangeLI createExchangeLI(ExchangeLI exchangeLI) {
        em.persist(exchangeLI);
        return exchangeLI;
    }

    @Override
    public ExchangeLI updateExchangeLI(ExchangeLI exchangeLI) throws CustomerOrderException {
        ExchangeLI old = getExchangeLI(exchangeLI.getId());
        old.setNewItem(exchangeLI.getNewItem());
        old.setOldItem(exchangeLI.getOldItem());
        return em.merge(old);
    }

    @Override
    public RefundLI getRefundLI(Long id) throws CustomerOrderException {
        RefundLI refundLI = em.find(RefundLI.class, id);

        if (refundLI == null) {
            throw new CustomerOrderException("Refund Line Item with id " + id + " cannot be found.");
        } else {
            return refundLI;
        }
    }

    @Override
    public List<RefundLI> getAllRefundLIs() {
        TypedQuery<RefundLI> q = em.createQuery("SELECT rLI FROM RefundLI rLI", RefundLI.class);
        return q.getResultList();
    }

    @Override
    public RefundLI createRefundLI(RefundLI refundLI) {
        em.persist(refundLI);
        return refundLI;
    }

    @Override
    public RefundLI updateRefundLI(RefundLI refundLI) throws CustomerOrderException {
        RefundLI old = getRefundLI(refundLI.getId());
        old.setRefundedItem(refundLI.getRefundedItem());
        return em.merge(old);
    }

    // Helper methods

    // do this: implement updated method upon payment, and update after currency amount added to payments
    public void updateMembershipPoints(CustomerOrder order) throws CustomerException {
        Customer customer = customerService.getCustomerById(order.getCustomerId());

        Currency currency = em.find(Currency.class, "SGD");
        Double spending = em
                .createQuery("SELECT o.payments FROM CustomerOrder o WHERE o.customer.id = :id AND o.dateTime >= :date",
                        Payment.class)
                .setParameter("id", customer.getId())
                .setParameter("date", Timestamp.valueOf(LocalDateTime.now().minusYears(2)), TemporalType.TIMESTAMP)
                .getResultList()
                .stream()
                .mapToDouble(x -> x.getAmount())
                .sum();
        List<MembershipTier> tiers = em
                .createQuery("SELECT m FROM MembershipTier m ORDER BY m.multiplier ASC", MembershipTier.class)
                .getResultList();
        MembershipTier membershipTier = tiers.get(0);
        for (MembershipTier tier : tiers) {
            if (spending > tier.getThreshold().get(currency)) {
                membershipTier = tier;
            }
        }
        customer.setMembershipTier(membershipTier);

        double bdayMultiplier = 1;
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        Calendar cal = Calendar.getInstance();
        cal.setTime(customer.getDob());
        if (currentMonth == cal.get(Calendar.MONTH)) {
            Integer ordersThisMonth = em
                    .createQuery("SELECT o FROM CustomerOrder o WHERE o.customer.id = :id AND o.dateTime >= :date",
                            CustomerOrder.class)
                    .setParameter("id", customer.getId())
                    .setParameter("date",
                            Timestamp.valueOf(LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth())),
                            TemporalType.TIMESTAMP)
                    .getResultList()
                    .size();
            if (ordersThisMonth == 0) {
                bdayMultiplier = membershipTier.getBirthday().getMultiplier();
            }
        }
        Integer membershipPoints = customer.getMembershipPoints();
        for (Payment p : order.getPayments()) {
            membershipPoints = Integer.sum(membershipPoints,
                    (int) (p.getAmount() * bdayMultiplier * membershipTier.getMultiplier()));
        }
        customer.setMembershipPoints(membershipPoints);

    }

}
