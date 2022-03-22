package com.iora.erp.model.stockTransfer;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Embeddable;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import com.iora.erp.enumeration.StockTransferStatusEnum;
import com.iora.erp.model.site.Site;

@Embeddable
public class STOStatus {
    @ManyToOne
    private Site actionBy;

    @Temporal(TemporalType.TIMESTAMP)
    private Date timeStamp;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private StockTransferStatusEnum status;

    public STOStatus() {
    }

    public STOStatus(Site actionBy, Date timeStamp, StockTransferStatusEnum status) {
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

    public StockTransferStatusEnum getStatus() {
        return this.status;
    }

    public void setStatus(StockTransferStatusEnum status) {
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
