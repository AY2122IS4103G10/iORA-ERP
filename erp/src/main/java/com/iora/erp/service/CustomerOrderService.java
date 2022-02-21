package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;

public interface CustomerOrderService {
    public abstract CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException;
    public abstract List<OnlineOrder> getAllOnlineOrders();
    public abstract List<OnlineOrder> getOnlineOrdersBySite(Long siteId);
    public abstract List<OnlineOrder> getOnlineOrdersBySiteDate(Long siteId, String date);
    public abstract List<CustomerOrder> getAllInStoreOrders();
    public abstract List<CustomerOrder> getInStoreOrdersBySite(Long siteId);
    public abstract List<CustomerOrder> getInStoreOrdersBySiteDate(Long siteId, String date);
    public abstract void createCustomerOrder(CustomerOrder customerOrder);
    public abstract void updateCustomerOrder(CustomerOrder customerOrder) throws CustomerOrderException;
    
    public abstract CustomerOrderLI getCustomerOrderLI(Long id) throws CustomerOrderException;
    public abstract List<CustomerOrderLI> getCustomerOrderLIs(CustomerOrder customerOrder);
    public abstract void createCustomerOrderLI(CustomerOrderLI customerOrderLI);
    public abstract void updateCustomerOrderLI(CustomerOrderLI customerOrderLI) throws CustomerOrderException;

    public abstract Payment getPayment(Long id) throws CustomerOrderException;
    public abstract List<Payment> getAllPayments();
    public abstract void createPayment(Payment payment);
    public abstract void updatePayment(Payment payment) throws CustomerOrderException;

    public abstract ExchangeLI getExchangeLI(Long id) throws CustomerOrderException;
    public abstract List<ExchangeLI> getAllExchangeLIs();
    public abstract void createExchangeLI(ExchangeLI exchangeLI);
    public abstract void updateExchangeLI(ExchangeLI exchangeLI) throws CustomerOrderException;

    public abstract RefundLI getRefundLI(Long id) throws CustomerOrderException;
    public abstract List<RefundLI> getAllRefundLIs();
    public abstract void createRefundLI(RefundLI refundLI);
    public abstract void updateRefundLI(RefundLI refundLI) throws CustomerOrderException;
}
