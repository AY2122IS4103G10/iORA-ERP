package com.iora.erp.model.customerOrder;

import com.stripe.model.Token;

public class PaymentRequest {
    private String description;
    private int amount;
    private String currency = "SGD";
    private String stripeEmail;
    private Token token;

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public int getAmount() {
        return amount;
    }

    public void setAmount(int amount) {
        this.amount = amount;
    }

    public String getCurrency() {
        return currency;
    }

    public void setCurrency(String currency) {
        this.currency = currency;
    }

    public String getStripeEmail() {
        return stripeEmail;
    }

    public void setStripeEmail(String stripeEmail) {
        this.stripeEmail = stripeEmail;
    }

    public Token getToken() {
        return token;
    }

    public void setToken(Token stripeToken) {
        this.token = stripeToken;
    }

}