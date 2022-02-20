package com.iora.erp.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;

    /*
     * ---------------------------------------------------------
     * Methods are not tested yet, for implementation in Second System Release
     * ---------------------------------------------------------
     */

public class CustomerOrderServiceImpl implements CustomerOrderService {
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
    public List<OnlineOrder> getOnlineOrders() {
        TypedQuery<OnlineOrder> q = em.createQuery("SELECT oo FROM OnlineOrder oo", OnlineOrder.class);
        return q.getResultList();
    }

    @Override
    public List<CustomerOrder> getInStoreOrders() {
        TypedQuery<CustomerOrder> q = em.createQuery("SELECT co FROM CustomerOrder co", CustomerOrder.class);
        List<CustomerOrder> customerOrders = q.getResultList();

        customerOrders.removeAll(getOnlineOrders());

        return customerOrders;
    }

    @Override
    public void createCustomerOrder(CustomerOrder customerOrder) {
        em.persist(customerOrder);
    }

    @Override
    public void updateCustomerOrder(CustomerOrder customerOrder) throws CustomerOrderException {
        CustomerOrder old = getCustomerOrder(customerOrder.getId());
        old.setDateTime(customerOrder.getDateTime());
        old.setLineItems(customerOrder.getLineItems());
        old.setPayments(customerOrder.getPayments());
        old.setExhcangedLIs(customerOrder.getExhcangedLIs());
        old.setRefundedLIs(customerOrder.getRefundedLIs());
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
    public void createCustomerOrderLI(CustomerOrderLI customerOrderLI) {
        em.persist(customerOrderLI);

    }

    @Override
    public void updateCustomerOrderLI(CustomerOrderLI customerOrderLI) throws CustomerOrderException {
        CustomerOrderLI old = getCustomerOrderLI(customerOrderLI.getId());
        old.setProductItems(customerOrderLI.getProductItems());
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
    public void createPayment(Payment payment) {
        em.persist(payment);

    }

    @Override
    public void updatePayment(Payment payment) throws CustomerOrderException {
        Payment old = getPayment(payment.getId());
        old.setAmount(payment.getAmount());
        old.setCcTransactionId(payment.getCcTransactionId());
        old.setDateTime(payment.getDateTime());
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
    public void createExchangeLI(ExchangeLI exchangeLI) {
        em.persist(exchangeLI);

    }

    @Override
    public void updateExchangeLI(ExchangeLI exchangeLI) throws CustomerOrderException {
        ExchangeLI old = getExchangeLI(exchangeLI.getId());
        old.setNewItem(exchangeLI.getNewItem());
        old.setOldItem(exchangeLI.getOldItem());
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
    public void createRefundLI(RefundLI refundLI) {
        em.persist(refundLI);

    }

    @Override
    public void updateRefundLI(RefundLI refundLI) throws CustomerOrderException {
        RefundLI old = getRefundLI(refundLI.getId());
        old.setRefundedItem(refundLI.getRefundedItem());
    }
}
