package com.iora.erp.service;

import java.util.List;
import java.util.Map;

import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;

public interface StripeService {
    public abstract String createPaymentIntent(List<CustomerOrderLI> lineItems, Long voucherAmount) throws StripeException;
    public abstract Map<String, String> createConnnectionToken() throws StripeException;
    public abstract PaymentIntent capturePayment(String clientSecret) throws StripeException;

    public abstract PaymentIntent cancelPayment(String clientSecret) throws StripeException;
    public abstract Refund refundPayment(String clientSecret, double amount) throws StripeException;
}
