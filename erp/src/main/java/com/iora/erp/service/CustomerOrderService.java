package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.product.ProductItem;

public interface CustomerOrderService {
    public abstract CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException;
    public abstract void createCustomerOrderLI(List<ProductItem> productItems);
    public abstract void createPayment(double amount, String ccTransactionId);
    public abstract void createCustomerOrder();


}
