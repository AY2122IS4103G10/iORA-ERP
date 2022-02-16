package com.iora.erp.model.customerOrder;

import java.io.Serializable;
import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Payment implements Serializable {
    private static final long serialVersionUID = 1L;
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @Column(nullable = false, scale = 2)
    private double amount;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime dateTime;

    @Column(nullable = false, unique = true)
    private String ccTransactionId;

    public Payment() {
        this.dateTime = LocalDateTime.now();
    }

    public Payment(double amount, String ccTransactionId) {
        this();
        this.amount = amount;
        this.ccTransactionId = ccTransactionId;
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

    public LocalDateTime getDateTime() {
        return this.dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public String getCcTransactionId() {
        return this.ccTransactionId;
    }

    public void setCcTransactionId(String ccTransactionId) {
        this.ccTransactionId = ccTransactionId;
    }
}