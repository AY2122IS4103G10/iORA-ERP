package com.iora.erp.service;

import java.time.LocalDate;
import java.util.List;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;

public interface CustomerOrderService {
    public abstract CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException;
    public abstract List<CustomerOrder> searchCustomerOrderByDate(LocalDate date);
    public abstract void createCustomerOrder(CustomerOrder customerOrder);
    public abstract void updateCustomerOrder(CustomerOrder customerOrder);
    
    public abstract CustomerOrderLI getCustomerOrderLI(Long id);
    public abstract List<CustomerOrderLI> getAllCustomerOrderLIs();
    public abstract void createCustomerOrderLI(CustomerOrderLI customerOrderLI);
    public abstract void updateCustomerOrderLI(CustomerOrderLI customerOrderLI);

    public abstract Payment getPayment(Long id);
    public abstract List<Payment> getAllPayments();
    public abstract void createPayment(Payment payment);
    public abstract void updatePayment(Payment payment);

    public abstract void getExchangeLI(Long id);
    public abstract List<ExchangeLI> getAllExchangeLIs();
    public abstract void createExchangeLI(ExchangeLI exchangeLI);
    public abstract void updateExchangeLI(ExchangeLI exchangeLI);

    public abstract void getRefundLI(Long id);
    public abstract List<RefundLI> getAllRefundLIs();
    public abstract void createRefundLI(RefundLI refundLI);
    public abstract void updateRefundLI(RefundLI refundLI);
}
