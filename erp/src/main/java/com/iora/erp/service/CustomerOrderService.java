package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.InsufficientPaymentException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;

public interface CustomerOrderService {
    public abstract CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException;
    public abstract List<CustomerOrder> searchCustomerOrders(Long siteId, Long orderId);
    public abstract List<CustomerOrder> searchStoreOrders(Long siteId, Long orderId);
    public abstract List<OnlineOrder> searchOnlineOrders(Long siteId, Long orderId);

    public abstract CustomerOrder createCustomerOrder(CustomerOrder customerOrder);
    public abstract CustomerOrder updateCustomerOrder(CustomerOrder customerOrder) throws CustomerOrderException;
    public abstract CustomerOrder finaliseCustomerOrder(CustomerOrder customerOrder, List<Payment> payments) throws CustomerOrderException, InsufficientPaymentException;
    
    public abstract CustomerOrderLI getCustomerOrderLI(Long id) throws CustomerOrderException;
    public abstract List<CustomerOrderLI> getCustomerOrderLIs(CustomerOrder customerOrder);
    public abstract CustomerOrderLI createCustomerOrderLI(CustomerOrderLI customerOrderLI);
    public abstract CustomerOrderLI updateCustomerOrderLI(CustomerOrderLI customerOrderLI) throws CustomerOrderException;
    
    public abstract List<CustomerOrderLI> addToCustomerOrderLIs(List<CustomerOrderLI> lineItems, String rfidsku) throws CustomerOrderException;
    public abstract List<CustomerOrderLI> removeFromCustomerOrderLIs(List<CustomerOrderLI> lineItems, String rfidsku) throws CustomerOrderException;
    public abstract List<List<CustomerOrderLI>> calculatePromotions(List<CustomerOrderLI> lineItems);

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

    public abstract OnlineOrder scanProduct(OnlineOrder onlineOrder, String rfidsku, int qty) throws CustomerOrderException, NoStockLevelException, IllegalTransferException, ProductException;
}
