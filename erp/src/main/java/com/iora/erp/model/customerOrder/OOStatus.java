package com.iora.erp.model.customerOrder;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.iora.erp.enumeration.OnlineOrderStatus;
import com.iora.erp.model.site.Site;

@Embeddable
public class OOStatus {
    @ManyToOne
    private Site actionBy;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OnlineOrderStatus status;

    public OOStatus() {
    }

    public OOStatus(Site actionBy, Date timeStamp, OnlineOrderStatus status) {
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

    public Date getTimeStamp() {
        return this.timeStamp;
    }

    public void setTimeStamp(Date timeStamp) {
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
