package com.iora.erp.model.procurementOrder;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.iora.erp.enumeration.ProcurementOrderStatusEnum;
import com.iora.erp.model.site.Site;

@Embeddable
public class POStatus {
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @ManyToOne
    private Site actionBy;
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProcurementOrderStatusEnum status;

    public POStatus() {
    }

    public POStatus(Site actionBy, Date timeStamp, ProcurementOrderStatusEnum status) {
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

    public ProcurementOrderStatusEnum getStatus() {
        return this.status;
    }

    public void setStatus(ProcurementOrderStatusEnum status) {
        this.status = status;
    }

    public POStatus actionBy(Site actionBy) {
        setActionBy(actionBy);
        return this;
    }

    public POStatus timeStamp(Date timeStamp) {
        setTimeStamp(timeStamp);
        return this;
    }

    public POStatus status(ProcurementOrderStatusEnum status) {
        setStatus(status);
        return this;
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
