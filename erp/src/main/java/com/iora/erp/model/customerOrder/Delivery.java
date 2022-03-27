package com.iora.erp.model.customerOrder;

import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

import com.iora.erp.enumeration.ParcelSize;

@Entity
public class Delivery {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String parcelID;
    private String shipmentID;
    private Integer quantity;

    @Enumerated(EnumType.STRING)
    private ParcelSize ps;

    public Delivery(Integer quantity, String parcelSize) {
        this.quantity = quantity;
        this.ps = ParcelSize.valueOf(parcelSize);
    }

    public Delivery() {
    }

    public String getParcelID() {
        return parcelID;
    }

    public void setParcelID(String parcelID) {
        this.parcelID = parcelID;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ParcelSize getPs() {
        return ps;
    }

    public void setPs(ParcelSize ps) {
        this.ps = ps;
    }

    public String getShipmentID() {
        return shipmentID;
    }

    public void setShipmentID(String shipmentID) {
        this.shipmentID = shipmentID;
    }

}
