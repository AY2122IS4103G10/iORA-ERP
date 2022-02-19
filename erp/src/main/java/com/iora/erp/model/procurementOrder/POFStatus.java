package com.iora.erp.model.procurementOrder;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.iora.erp.enumeration.ProcurementOrderFulfilmentStatus;
import com.iora.erp.model.site.Site;

@Embeddable
public class POFStatus {
    @ManyToOne
    private Site actionBy;
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProcurementOrderFulfilmentStatus status;

    public POFStatus() {
    }

    public POFStatus(Site actionBy, Date timeStamp, ProcurementOrderFulfilmentStatus status) {
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

    public ProcurementOrderFulfilmentStatus getStatus() {
        return this.status;
    }

    public void setStatus(ProcurementOrderFulfilmentStatus status) {
        this.status = status;
    }

    public POFStatus actionBy(Site actionBy) {
        setActionBy(actionBy);
        return this;
    }

    public POFStatus timeStamp(Date timeStamp) {
        setTimeStamp(timeStamp);
        return this;
    }

    public POFStatus status(ProcurementOrderFulfilmentStatus status) {
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
