package com.iora.erp.model.procurementOrder;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.iora.erp.enumeration.ProcurementOrderStatus;
import com.iora.erp.model.site.Site;

@Embeddable
public class POStatus {
    @ManyToOne
    private Site actionBy;
    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;
    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private ProcurementOrderStatus status;


    public POStatus() {
    }

    public POStatus(Site actionBy, Date timeStamp, ProcurementOrderStatus status) {
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

    public ProcurementOrderStatus getStatus() {
        return this.status;
    }

    public void setStatus(ProcurementOrderStatus status) {
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

    public POStatus status(ProcurementOrderStatus status) {
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
