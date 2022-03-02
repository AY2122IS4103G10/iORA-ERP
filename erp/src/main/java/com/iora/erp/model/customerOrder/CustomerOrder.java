package com.iora.erp.model.customerOrder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.iora.erp.model.customer.Customer;

@Entity
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long storeSiteId;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime dateTime;

    @Column(nullable = false)
    private Double totalAmount;

    @OneToMany
    private List<CustomerOrderLI> lineItems;

    @OneToMany
    private List<Payment> payments;

    @OneToMany
    private List<RefundLI> refundedLIs;

    @OneToMany
    private List<ExchangeLI> exhcangedLIs;

    @Column
    private Long customerId;

    public CustomerOrder() {
        dateTime = LocalDateTime.now();
        this.lineItems = new ArrayList<>();
        this.payments = new ArrayList<>();
        this.refundedLIs = new ArrayList<>();
        this.exhcangedLIs = new ArrayList<>();
        this.totalAmount = 0.0;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getDateTime() {
        return this.dateTime;
    }

    public void setDateTime(LocalDateTime dateTime) {
        this.dateTime = dateTime;
    }

    public List<CustomerOrderLI> getLineItems() {
        return this.lineItems;
    }

    public void setLineItems(List<CustomerOrderLI> lineItems) {
        this.lineItems = lineItems;
    }

    public void addLineItem(CustomerOrderLI lineItem) {
        this.lineItems.add(lineItem);
    }

    public List<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
    }

    public void addPayment(Payment payment) {
        this.payments.add(payment);
        this.totalAmount += payment.getAmount();
    }

    public List<RefundLI> getRefundedLIs() {
        return this.refundedLIs;
    }

    public void setRefundedLIs(List<RefundLI> refundedLIs) {
        this.refundedLIs = refundedLIs;
    }

    public void addRefundedLI(RefundLI refundedLI) {
        this.refundedLIs.add(refundedLI);
    }

    public List<ExchangeLI> getExhcangedLIs() {
        return this.exhcangedLIs;
    }

    public void setExhcangedLIs(List<ExchangeLI> exhcangedLIs) {
        this.exhcangedLIs = exhcangedLIs;
    }

    public void addExchangedLI(ExchangeLI exchangedLI) {
        this.exhcangedLIs.add(exchangedLI);
    }

    public Long getCustomerId() {
        return this.customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }

    public Long getStoreSiteId() {
        return storeSiteId;
    }

    public void setStoreSiteId(Long storeSiteId) {
        this.storeSiteId = storeSiteId;
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(Double totalAmount) {
        this.totalAmount = totalAmount;
    }
}
