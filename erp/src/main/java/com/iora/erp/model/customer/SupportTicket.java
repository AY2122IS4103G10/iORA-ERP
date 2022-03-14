package com.iora.erp.model.customer;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.iora.erp.model.customerOrder.CustomerOrder;

@Entity
public class SupportTicket {
    public enum Status {
        PENDING, RESOLVED;
    }

    public enum Category {
        ACCOUNT, ORDER, GENERAL;
    }

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Status status;

    @Column(nullable = false)
    private Category category;

    @Column(nullable = false)
    private String subject;

    @ManyToOne
    private CustomerOrder customerOrder;
    
    @OneToMany
    private List<SupportTicketMsg> messages;

    public SupportTicket() {
        messages = new ArrayList<>();
    }

    public SupportTicket(Status status, Category category, String subject) {
        this();
        this.status = status;
        this.category = category;
        this.subject = subject;
    }


    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Status getStatus() {
        return this.status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }

    public Category getCategory() {
        return this.category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public String getSubject() {
        return this.subject;
    }

    public void setSubject(String subject) {
        this.subject = subject;
    }

    public CustomerOrder getCustomerOrder() {
        return this.customerOrder;
    }

    public void setCustomerOrder(CustomerOrder customerOrder) {
        this.customerOrder = customerOrder;
    }

    public List<SupportTicketMsg> getMessages() {
        return this.messages;
    }

    public void setMessages(List<SupportTicketMsg> messages) {
        this.messages = messages;
    }

    public void addMessage(SupportTicketMsg message) {
        this.messages.add(message);
    }
}
