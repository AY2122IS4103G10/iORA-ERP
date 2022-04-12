package com.iora.erp.service;

import java.util.Date;
import java.util.List;
import java.util.Map;

import com.iora.erp.enumeration.ParcelSize;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.InsufficientPaymentException;
import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.RefundLI;
import com.iora.erp.model.site.Site;
import com.stripe.exception.StripeException;

public interface CustomerOrderService {
        public abstract CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException;

        public abstract List<CustomerOrder> searchCustomerOrders(Long siteId, Long orderId);

        public abstract List<CustomerOrder> searchStoreOrders(Long siteId, Long orderId);

        public abstract List<OnlineOrder> searchOnlineOrders(Long siteId, Long orderId);

        public abstract List<OnlineOrder> getOnlineOrdersOfSite(Site site);

        public abstract List<OnlineOrder> getOnlineOrdersByStatus(String status);

        public abstract List<OnlineOrder> getOOBySiteStatus(Long siteId, String status) throws CustomerOrderException;

        public abstract List<OnlineOrder> getPickupOrdersBySite(Long siteId);

        public abstract CustomerOrder createCustomerOrder(CustomerOrder customerOrder, String clientSecret)
                        throws StripeException, InsufficientPaymentException, CustomerException;

        public abstract CustomerOrder updateCustomerOrder(CustomerOrder customerOrder) throws CustomerOrderException;

        public abstract double getCurrentSpending(Long customerId);

        public abstract CustomerOrder finaliseCustomerOrder(CustomerOrder customerOrder)
                        throws CustomerOrderException, InsufficientPaymentException, CustomerException;

        public abstract CustomerOrderLI getCustomerOrderLI(Long id) throws CustomerOrderException;

        public abstract List<CustomerOrderLI> getCustomerOrderLIs(CustomerOrder customerOrder);

        public abstract CustomerOrderLI createCustomerOrderLI(CustomerOrderLI customerOrderLI) throws ModelException;

        public abstract CustomerOrderLI updateCustomerOrderLI(CustomerOrderLI customerOrderLI)
                        throws CustomerOrderException;

        public abstract List<CustomerOrderLI> addToCustomerOrderLIs(List<CustomerOrderLI> lineItems, String rfidsku)
                        throws CustomerOrderException;

        public abstract List<CustomerOrderLI> removeFromCustomerOrderLIs(List<CustomerOrderLI> lineItems,
                        String rfidsku) throws CustomerOrderException;

        public abstract List<List<CustomerOrderLI>> calculatePromotions(List<CustomerOrderLI> lineItems);

        public abstract Payment getPayment(Long id) throws CustomerOrderException;

        public abstract List<Payment> getAllPayments();

        public abstract Payment createPayment(Payment payment);

        public abstract Payment updatePayment(Payment payment) throws CustomerOrderException;

        public abstract ExchangeLI getExchangeLI(Long id) throws CustomerOrderException;

        public abstract List<ExchangeLI> getAllExchangeLIs();

        public abstract ExchangeLI createExchangeLI(Long orderId, ExchangeLI exchangeLI) throws CustomerOrderException;

        public abstract ExchangeLI updateExchangeLI(ExchangeLI exchangeLI) throws CustomerOrderException;

        public abstract RefundLI getRefundLI(Long id) throws CustomerOrderException;

        public abstract List<RefundLI> getAllRefundLIs();

        public abstract RefundLI createRefundLI(Long orderId, RefundLI refundLI, Double refundAmount)
                        throws CustomerOrderException;

        public abstract RefundLI updateRefundLI(RefundLI refundLI) throws CustomerOrderException;

        public abstract OnlineOrder createOnlineOrder(OnlineOrder onlineOrder, String clientSecret)
                        throws StripeException, InsufficientPaymentException, CustomerException;

        public abstract OnlineOrder customerCancelOnlineOrder(Long orderId, Long customerId) throws CustomerOrderException, CustomerException, StripeException;

        public abstract OnlineOrder cancelOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException;

        public abstract OnlineOrder pickPackOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException;

        public abstract Map<String, Integer> getPickingList(Long siteId) throws ProductException;

        public abstract void startPick(List<Long> orderIds) throws CustomerOrderException;

        public abstract void finishPick(List<Long> orderIds) throws CustomerOrderException;

        public abstract OnlineOrder scanProduct(Long orderId, String rfidsku, int qty) throws CustomerOrderException,
                        NoStockLevelException, IllegalTransferException, ProductException;

        public abstract OnlineOrder adjustProduct(Long orderId, String rfidsku, int qty) throws CustomerOrderException,
                        NoStockLevelException, IllegalTransferException, ProductException;

        public abstract OnlineOrder deliverOnlineOrder(Long orderId) throws CustomerOrderException;

        public abstract List<ParcelSize> getParcelSizes();

        public abstract OnlineOrder deliverMultipleOnlineOrder(Long orderId) throws CustomerOrderException;

        public abstract OnlineOrder receiveOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException;

        public abstract OnlineOrder collectOnlineOrder(Long orderId) throws CustomerOrderException;

        public abstract Map<Long, Map<String, Long>> getCustomerOrdersInDateRange(Date start, Date end);

        public abstract Map<Long, Long> getStoreOrdersInDateRange(Date start, Date end);

        public abstract Map<Long, Long> getOnlineOrdersInDateRange(Date start, Date end);

        public abstract List<CustomerOrder> getDailyCustomerOrders(Long siteId, Date date);
}