package com.iora.erp.service;

import java.util.List;

import javax.annotation.PostConstruct;

import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.param.PaymentIntentCreateParams;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("stripeServiceImpl")
@Transactional
public class StripeServiceImpl implements StripeService {
    @Value("${STRIPE_SECRET_KEY}")
    private String secretKey;

    @PostConstruct
    public void init() {
        Stripe.apiKey = secretKey;
    }

    @Override
    public String chargeCreditCard(List<CustomerOrderLI> lineItems) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(calculateOrderAmount(lineItems))
                .setCurrency("sgd")
                .build();

        // Create a PaymentIntent with the order amount and currency
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return paymentIntent.getClientSecret();
    }

    private Long calculateOrderAmount(List<CustomerOrderLI> lineItems) {
        double amount = 0;

        for (CustomerOrderLI item : lineItems) {
            amount += item.getSubTotal();
        }

        return Long.valueOf((long) (amount * 100));
    }
}
