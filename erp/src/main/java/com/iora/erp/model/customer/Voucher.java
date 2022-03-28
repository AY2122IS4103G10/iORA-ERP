package com.iora.erp.model.customer;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.utils.StringGenerator;

@Entity
public class Voucher {
    @Id
    private String voucherCode;

    @Column(nullable = false, scale = 2)
    private double amount;

    @Column(nullable = false)
    private Date expiry;

    @Column(nullable = false)
    private boolean issued;

    @Column(nullable = false)
    private boolean redeemed;

    @JsonBackReference
    @OneToOne(mappedBy = "voucher")
    CustomerOrder customerOrder;

    public Voucher() {
        this.voucherCode = StringGenerator.generateRandom(48, 122, 10);
        this.issued = false;
        this.redeemed = false;
    }

    public Voucher(double amount, Date expiry) {
        this();
        this.amount = amount;
        this.expiry = expiry;
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

    public Date getExpiry() {
        return this.expiry;
    }

    public void setExpiry(Date expiry) {
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

    public CustomerOrder getCustomerOrder() {
        return this.customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }
}
