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

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.iora.erp.model.site.Site;

@Entity
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime dateTime;

    @Column(nullable = false, scale = 2)
    private Double totalAmount;

    @JsonBackReference
    @ManyToOne
    private Site site;

    @OneToMany
    private List<CustomerOrderLI> lineItems;

    private List<CustomerOrderLI> packedLineItems;

    @OneToMany
    private List<Payment> payments;

    private Boolean paid = false;

    @OneToMany
    private List<RefundLI> refundedLIs;

    @OneToMany
    private List<ExchangeLI> exchangedLIs;

    private Long customerId;

    public CustomerOrder() {
        dateTime = LocalDateTime.now();
        this.lineItems = new ArrayList<>();
        this.payments = new ArrayList<>();
        this.refundedLIs = new ArrayList<>();
        this.exchangedLIs = new ArrayList<>();
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

    public Site getSite() {
        return this.site;
    }

    public void setSite(Site site) {
        this.site = site;
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

    public List<CustomerOrderLI> getPackedLineItems() {
        return this.packedLineItems;
    }

    public void setPackedLineItems(List<CustomerOrderLI> packedLineItems) {
        this.packedLineItems = packedLineItems;
    }

    public void addPackedLineItems(CustomerOrderLI packedLineItem) {
        this.packedLineItems.add(packedLineItem);
    }

    public List<Payment> getPayments() {
        return this.payments;
    }

    public void setPayments(List<Payment> payments) {
        this.payments = payments;
        for (Payment p : payments) {
            this.totalAmount += p.getAmount();
        }
    }

    public void addPayment(Payment payment) {
        this.payments.add(payment);
        this.totalAmount += payment.getAmount();
    }

    public Boolean isPaid() {
        return this.paid;
    }

    public void setPaid(Boolean paid) {
        this.paid = paid;
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

    public List<ExchangeLI> getExchangedLIs() {
        return this.exchangedLIs;
    }

    public void setExchangedLIs(List<ExchangeLI> exchangedLIs) {
        this.exchangedLIs = exchangedLIs;
    }

    public void addExchangedLI(ExchangeLI exchangedLI) {
        this.exchangedLIs.add(exchangedLI);
    }

    public Double getTotalAmount() {
        return totalAmount;
    }

    public Long getCustomerId() {
        return this.customerId;
    }

    public void setCustomerId(Long customerId) {
        this.customerId = customerId;
    }
}
