package com.iora.erp.model.customerOrder;

import java.util.Date;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.iora.erp.enumeration.ParcelSizeEnum;

@Entity
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Integer deliveryID;
    private String trackingID;
    private Date dateTime;
    private Long siteId;
    private Boolean confirmOrder;

    @Enumerated(EnumType.STRING)
    private ParcelSizeEnum ps;

    public Delivery() {
        confirmOrder = false;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Date getDateTime() {
        return dateTime;
    }

    public void setDateTime(Date dateTime) {
        this.dateTime = dateTime;
    }

    public Long getSiteId() {
        return siteId;
    }

    public void setSiteId(Long siteId) {
        this.siteId = siteId;
    }

    public Integer getDeliveryID() {
        return deliveryID;
    }

    public void setDeliveryID(Integer deliveryID) {
        this.deliveryID = deliveryID;
    }

    public String getTrackingID() {
        return trackingID;
    }

    public void setTrackingID(String trackingID) {
        this.trackingID = trackingID;
    }

    public ParcelSizeEnum getPs() {
        return ps;
    }

    public void setPs(ParcelSizeEnum ps) {
        this.ps = ps;
    }

    public Boolean getConfirmOrder() {
        return confirmOrder;
    }

    public void setConfirmOrder(Boolean confirmOrder) {
        this.confirmOrder = confirmOrder;
    }

}
