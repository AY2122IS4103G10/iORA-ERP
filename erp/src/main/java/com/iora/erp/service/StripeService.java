package com.iora.erp.service;

import java.util.List;

import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.stripe.exception.StripeException;

public interface StripeService {
    public abstract String chargeCreditCard(List<CustomerOrderLI> lineItems) throws StripeException;
}
