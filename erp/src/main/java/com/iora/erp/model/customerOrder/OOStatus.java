package com.iora.erp.model.customerOrder;

import java.time.LocalDateTime;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.iora.erp.enumeration.OnlineOrderStatus;
import com.iora.erp.model.site.Site;

@Entity
public class OOStatus {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Site actionBy;

    @Column(nullable = false, columnDefinition = "TIMESTAMP")
    private LocalDateTime timeStamp;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OnlineOrderStatus status;

    public OOStatus() {
    }

    public OOStatus(Site actionBy, LocalDateTime timeStamp, OnlineOrderStatus status) {
        this.actionBy = actionBy;
        this.timeStamp = timeStamp;
        this.status = status;
    }

    public Site getActionBy() {
        return this.actionBy;
    }

    public void setActionBy(Site actionBy) {
        this.actionBy = actionBy;
    }

    public LocalDateTime getTimeStamp() {
        return this.timeStamp;
    }

    public void setTimeStamp(LocalDateTime timeStamp) {
        this.timeStamp = timeStamp;
    }

    public OnlineOrderStatus getStatus() {
        return this.status;
    }

    public void setStatus(OnlineOrderStatus status) {
        this.status = status;
    }

    @Override
    public String toString() {
        return "{" +
                " actionBy='" + getActionBy() + "'" +
                ", timeStamp='" + getTimeStamp() + "'" +
                ", status='" + getStatus() + "'" +
                "}";
    }
}
