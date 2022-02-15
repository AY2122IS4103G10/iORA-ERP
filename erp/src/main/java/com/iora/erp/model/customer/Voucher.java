package com.iora.erp.model.customer;

import java.util.Random;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class Voucher {
    @Id
    private String voucherCode;

    @Column(nullable = false, scale = 2)
    private double amount;

    @Column(nullable = false)
    private boolean issued;

    @Column(nullable = false)
    private boolean redeemed;

    public Voucher() {
    }

    public Voucher(double amount) {
        this();
        this.voucherCode = generateVoucherCode();
        this.amount = amount;
        this.issued = false;
        this.redeemed = false;
    }

    private String generateVoucherCode() {
        int leftLimit = 48;
        int rightLimit = 122;
        int targetStringLength = 10;
        Random random = new Random();

        String generatedString = random.ints(leftLimit, rightLimit + 1)
                .filter(i -> (i <= 57 || i >= 65) && (i <= 90 || i >= 97))
                .limit(targetStringLength)
                .collect(StringBuilder::new, StringBuilder::appendCodePoint, StringBuilder::append)
                .toString();

        return generatedString;
    }


    public String getVoucherCode() {
        return this.voucherCode;
    }

    public void setVoucherCode(String voucherCode) {
        this.voucherCode = voucherCode;
    }

    public double getAmount() {
        return this.amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public boolean isIssued() {
        return this.issued;
    }

    public void setIssued(boolean issued) {
        this.issued = issued;
    }

    public boolean isRedeemed() {
        return this.redeemed;
    }

    public void setRedeemed(boolean redeemed) {
        this.redeemed = redeemed;
    }
}
