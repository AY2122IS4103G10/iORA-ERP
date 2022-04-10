package com.iora.erp.model.customerOrder;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.iora.erp.enumeration.OnlineOrderStatusEnum;
import com.iora.erp.model.site.Site;

@Embeddable
public class OOStatus {
    @JsonIgnoreProperties({"stockLevel"})
    @ManyToOne
    private Site actionBy;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private OnlineOrderStatusEnum status;

    public OOStatus() {
    }

    public OOStatus(Site actionBy, Date timeStamp, OnlineOrderStatusEnum status) {
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

    public OnlineOrderStatusEnum getStatus() {
        return this.status;
    }

    public void setStatus(OnlineOrderStatusEnum status) {
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
