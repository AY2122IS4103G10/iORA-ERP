package com.iora.erp.model.customerOrder;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.site.Site;

@Entity
public class CustomerOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Temporal(TemporalType.TIMESTAMP)
    private Date dateTime;

    @Column(nullable = false, scale = 2)
    private Double totalAmount;

    // This site will be supplying the inventory for the order
    @ManyToOne
    private Site site;

    @OneToMany(cascade = CascadeType.ALL)
    private List<CustomerOrderLI> lineItems;

    @OneToMany(cascade = CascadeType.ALL)
    private List<PromotionLI> promotions;

    @OneToMany(cascade = CascadeType.ALL)
    private List<Payment> payments;

    private Boolean paid;

    @OneToMany
    private List<RefundLI> refundedLIs;

    @OneToMany
    private List<ExchangeLI> exchangedLIs;

    private Long customerId;

    @OneToOne
    private Voucher voucher;

    public CustomerOrder() {
        dateTime = new Date();
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

    public Date getDateTime() {
        return this.dateTime;
    }

    public void setDateTime(Date dateTime) {
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

    public List<PromotionLI> getPromotions() {
        return this.promotions;
    }

    public void setPromotions(List<PromotionLI> promotions) {
        this.promotions = promotions;
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

    public Voucher getVoucher() {
        return this.voucher;
    }

    public void setVoucher(Voucher voucher) {
        this.voucher = voucher;
    }
}