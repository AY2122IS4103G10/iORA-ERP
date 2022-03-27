package com.iora.erp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;

import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.stripe.Stripe;
import com.stripe.exception.StripeException;
import com.stripe.model.PaymentIntent;
import com.stripe.model.Refund;
import com.stripe.model.terminal.ConnectionToken;
import com.stripe.param.PaymentIntentCancelParams;
import com.stripe.param.PaymentIntentCaptureParams;
import com.stripe.param.PaymentIntentCreateParams;
import com.stripe.param.RefundCreateParams;
import com.stripe.param.PaymentIntentCreateParams.CaptureMethod;
import com.stripe.param.terminal.ConnectionTokenCreateParams;

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
    public String createPaymentIntent(List<CustomerOrderLI> lineItems) throws StripeException {
        PaymentIntentCreateParams params = PaymentIntentCreateParams.builder()
                .setAmount(calculateOrderAmount(lineItems))
                .setCurrency("sgd")
                .addPaymentMethodType("card_present")
                .addPaymentMethodType("card")
                .setCaptureMethod(CaptureMethod.MANUAL)
                .build();

        // Create a PaymentIntent with the order amount and currency
        PaymentIntent paymentIntent = PaymentIntent.create(params);

        return paymentIntent.getClientSecret();
    }

    @Override
    public Map<String, String> createConnnectionToken() throws StripeException {
        ConnectionTokenCreateParams params = ConnectionTokenCreateParams.builder().build();
        ConnectionToken connectionToken = ConnectionToken.create(params);

        Map<String, String> map = new HashMap<>();
        map.put("secret", connectionToken.getSecret());

        return map;
    }

    public PaymentIntent capturePayment(String clientSecret) throws StripeException {
        PaymentIntent resource = PaymentIntent.retrieve(clientSecret);
        PaymentIntentCaptureParams params = PaymentIntentCaptureParams.builder().build();

        return resource.capture(params);
    }

    private Long calculateOrderAmount(List<CustomerOrderLI> lineItems) {
        double amount = 0;

        for (CustomerOrderLI item : lineItems) {
            amount += item.getSubTotal();
        }

        return Long.valueOf((long) (amount * 100));
    }

    @Override
    public PaymentIntent cancelPayment(String clientSecret) throws StripeException {
        PaymentIntent resource = PaymentIntent.retrieve(clientSecret);
        PaymentIntentCancelParams params = PaymentIntentCancelParams.builder().build();

        return resource.cancel(params);
    }

    @Override
    public Refund refundPayment(String clientSecret, double amount) throws StripeException {
        RefundCreateParams params = RefundCreateParams
                .builder()
                .setPaymentIntent("clientSecret")
                .setAmount(Long.valueOf((long) (amount * 100)))
                .build();

        return Refund.create(params);
    }
}
