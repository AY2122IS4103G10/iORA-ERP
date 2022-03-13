package com.iora.erp.service;

import java.util.HashMap;
import java.util.Map;

import javax.annotation.PostConstruct;

import com.iora.erp.model.customerOrder.PaymentRequest;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.Charge;

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
    public Charge chargeCreditCard(PaymentRequest chargeRequest) throws StripeException {
        Map<String, Object> chargeParams = new HashMap<>();
        chargeParams.put("amount", chargeRequest.getAmount());
        chargeParams.put("currency", chargeRequest.getCurrency());
        chargeParams.put("source", chargeRequest.getToken().getId());
        Charge charge = Charge.create(chargeParams);
        return charge;
    }
}
