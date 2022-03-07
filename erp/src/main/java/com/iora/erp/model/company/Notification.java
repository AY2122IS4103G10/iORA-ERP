package com.iora.erp.model.company;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.iora.erp.enumeration.NotificationEnum;

@Entity
public class Notification {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime sent;
    @Column(columnDefinition = "TIMESTAMP")
    private LocalDateTime read;
    @Column(nullable = false)
    private String title;
    @Column(nullable = false)
    private String message;
    @Column(nullable = false)
    private String fromWho;
    @Enumerated(EnumType.STRING)
    private NotificationEnum appearance;
    @ManyToOne(fetch = FetchType.LAZY)
    private Employee employee;

    public Notification() {
    }

    public Notification(Long id, LocalDateTime sent, LocalDateTime read, String title, String message, String fromWho, NotificationEnum appearance, Employee employee) {
        this.id = id;
        this.sent = sent;
        this.read = read;
        this.title = title;
        this.message = message;
        this.fromWho = fromWho;
        this.appearance = appearance;
        this.employee = employee;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public LocalDateTime getSent() {
        return this.sent;
    }

    public void setSent(LocalDateTime sent) {
        this.sent = sent;
    }

    public LocalDateTime getRead() {
        return this.read;
    }

    public void setRead(LocalDateTime read) {
        this.read = read;
    }

    public String getTitle() {
        return this.title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getMessage() {
        return this.message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public String getFromWho() {
        return this.fromWho;
    }

    public void setFromWho(String fromWho) {
        this.fromWho = fromWho;
    }

    public NotificationEnum getAppearance() {
        return this.appearance;
    }
    
    public void setAppearance(NotificationEnum appearance) {
        this.appearance = appearance;
    }

    public Employee getEmployee() {
        return this.employee;
    }

    public void setEmployee(Employee employee) {
        this.employee = employee;
    }
    
}
