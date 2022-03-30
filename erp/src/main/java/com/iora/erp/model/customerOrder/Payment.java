package com.iora.erp.model.customerOrder;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.iora.erp.enumeration.PaymentTypeEnum;

//no status?
//payement

@Entity
public class Payment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, scale = 2)
    private double amount;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private Date dateTime;

    @Column(nullable = false)
    private PaymentTypeEnum paymentType;

    @Column
    private String ccTransactionId;

    public Payment() {
        this.dateTime = new Date();
    }

    public Payment(double amount, String ccTransactionId, PaymentTypeEnum pt) {
        this();
        this.amount = amount;
        this.ccTransactionId = ccTransactionId;
        this.paymentType = pt;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public double getAmount() {
        return this.amount;
    }

    public void setAmount(double amount) {
        this.amount = amount;
    }

    public Date getDateTime() {
        return this.dateTime;
    }

    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }

    public String getCcTransactionId() {
        return this.ccTransactionId;
    }

    public void setCcTransactionId(String ccTransactionId) {
        this.ccTransactionId = ccTransactionId;
    }

    public PaymentTypeEnum getPaymentType() {
        return paymentType;
    }

    public void setPaymentType(PaymentTypeEnum paymentType) {
        this.paymentType = paymentType;
    }
}
