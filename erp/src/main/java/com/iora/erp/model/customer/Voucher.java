package com.iora.erp.model.customer;

import java.time.LocalDate;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.iora.erp.utils.StringGenerator;

@Entity
public class Voucher {
    @Id
    private String voucherCode;

    @Column(nullable = false, scale = 2)
    private double amount;

    @Column(nullable = false)
    private LocalDate expiry;

    @Column(nullable = false)
    private boolean issued;

    @Column(nullable = false)
    private boolean redeemed;

    public Voucher() {
    }

    public Voucher(double amount, LocalDate expiry) {
        this();
        this.voucherCode = StringGenerator.generateRandom(48, 122, 10);
        this.amount = amount;
        this.expiry = expiry;
        this.issued = false;
        this.redeemed = false;
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

    public LocalDate getExpiry() {
        return this.expiry;
    }

    public void setExpiry(LocalDate expiry) {
        this.expiry = expiry;
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
