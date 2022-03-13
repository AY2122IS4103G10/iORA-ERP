package com.iora.erp.service;

import com.iora.erp.model.customerOrder.PaymentRequest;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;

public interface StripeService {
    public abstract Charge chargeCreditCard(PaymentRequest chargeRequest) throws StripeException;
}
