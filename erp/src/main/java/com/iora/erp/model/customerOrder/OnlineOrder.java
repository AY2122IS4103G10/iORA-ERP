package com.iora.erp.model.customerOrder;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iora.erp.enumeration.OnlineOrderStatusEnum;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StoreSite;

@Entity
public class OnlineOrder extends CustomerOrder {

    @Enumerated(EnumType.STRING)
    private OnlineOrderStatusEnum status;

    private boolean delivery;

    @ManyToOne
    private StoreSite pickupSite;

    @OneToOne(cascade = CascadeType.ALL)
    private DeliveryAddress deliveryAddress;

    @OneToMany
    private List<Delivery> parcelDelivery;

    @ElementCollection
    private List<OOStatus> statusHistory;

    public OnlineOrder() {
        super();
        this.status = OnlineOrderStatusEnum.PENDING;
        this.statusHistory = new ArrayList<>();
    }

    public OnlineOrder(boolean delivery) {
        this();
        this.delivery = delivery;
    }

    public OnlineOrderStatusEnum getStatus() {
        return this.status;
    }

    public void setStatus(OnlineOrderStatusEnum status) {
        this.status = status;
    }

    public boolean isDelivery() {
        return this.delivery;
    }

    public boolean getDelivery() {
        return this.delivery;
    }

    public void setDelivery(boolean delivery) {
        this.delivery = delivery;
    }

    public StoreSite getPickupSite() {
        return this.pickupSite;
    }

    public void setPickupSite(StoreSite pickupSite) {
        this.pickupSite = pickupSite;
    }

    public List<OOStatus> getStatusHistory() {
        return this.statusHistory;
    }

    public void setStatusHistory(List<OOStatus> statusHistory) {
        this.statusHistory = statusHistory;
    }

    public void addStatusHistory(OOStatus statusHistory) {
        this.statusHistory.add(statusHistory);
    }

    @JsonIgnore
    public OnlineOrderStatusEnum getLastStatus() {
        try {
            return this.statusHistory.get(this.statusHistory.size() - 1).getStatus();
        } catch (Exception ex) {
            return null;
        }
    }

    @JsonIgnore
    public Site getLastActor() {
        try {
            return this.statusHistory.get(this.statusHistory.size() - 1).getActionBy();
        } catch (Exception ex) {
            return null;
        }
    }

    public List<Delivery> getParcelDelivery() {
        return parcelDelivery;
    }

    public void setParcelDelivery(List<Delivery> parcelDelivery) {
        this.parcelDelivery = parcelDelivery;
    }

    public DeliveryAddress getDeliveryAddress() {
        return deliveryAddress;
    }

    public void setDeliveryAddress(DeliveryAddress deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
