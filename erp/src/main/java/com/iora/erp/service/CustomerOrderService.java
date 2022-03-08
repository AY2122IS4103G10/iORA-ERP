package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.InsufficientPaymentException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;

public interface CustomerOrderService {
    public abstract CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException;
    public abstract List<CustomerOrder> searchCustomerOrders(String id);

    public abstract List<OnlineOrder> getAllOnlineOrders();
    public abstract List<OnlineOrder> getOnlineOrdersBySite(Long siteId);
    public abstract List<OnlineOrder> getOnlineOrdersBySiteDate(Long siteId, String date);

    public abstract List<CustomerOrder> getAllInStoreOrders();
    public abstract List<CustomerOrder> getInStoreOrdersBySite(Long siteId);
    public abstract List<CustomerOrder> getInStoreOrdersBySiteDate(Long siteId, String date);

    public abstract CustomerOrder createCustomerOrder(CustomerOrder customerOrder);
    public abstract CustomerOrder updateCustomerOrder(CustomerOrder customerOrder) throws CustomerOrderException;
    public abstract CustomerOrder finaliseCustomerOrder(CustomerOrder customerOrder, List<Payment> payments) throws CustomerOrderException, InsufficientPaymentException;
    
    public abstract CustomerOrderLI getCustomerOrderLI(Long id) throws CustomerOrderException;
    public abstract List<CustomerOrderLI> getCustomerOrderLIs(CustomerOrder customerOrder);
    public abstract CustomerOrderLI createCustomerOrderLI(CustomerOrderLI customerOrderLI);
    public abstract CustomerOrderLI updateCustomerOrderLI(CustomerOrderLI customerOrderLI) throws CustomerOrderException;
    //public abstract List<List<CustomerOrderLI>> addToCustomerOrderLIs(List<CustomerOrderLI> lineItems, String rfid);

    public abstract Payment getPayment(Long id) throws CustomerOrderException;
    public abstract List<Payment> getAllPayments();
    public abstract Payment createPayment(Payment payment);
    public abstract Payment updatePayment(Payment payment) throws CustomerOrderException;

    public abstract ExchangeLI getExchangeLI(Long id) throws CustomerOrderException;
    public abstract List<ExchangeLI> getAllExchangeLIs();
    public abstract ExchangeLI createExchangeLI(ExchangeLI exchangeLI);
    public abstract ExchangeLI updateExchangeLI(ExchangeLI exchangeLI) throws CustomerOrderException;

    public abstract RefundLI getRefundLI(Long id) throws CustomerOrderException;
    public abstract List<RefundLI> getAllRefundLIs();
    public abstract RefundLI createRefundLI(RefundLI refundLI);
    public abstract RefundLI updateRefundLI(RefundLI refundLI) throws CustomerOrderException;
}
