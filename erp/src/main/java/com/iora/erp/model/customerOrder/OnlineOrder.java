package com.iora.erp.model.customerOrder;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import com.iora.erp.enumeration.Country;
import com.iora.erp.enumeration.OnlineOrderStatus;
import com.iora.erp.model.site.StoreSite;

@Entity
public class OnlineOrder extends CustomerOrder {
    @Column
    private Long onlineStoreSiteId;

    @Column
    @Enumerated(EnumType.STRING)
    private OnlineOrderStatus status;

    @Column
    private boolean delivery;

    @Column
    @Enumerated(EnumType.STRING)
    private Country country;

    @Column
    private StoreSite pickupSite;

    @Column
    private String deliveryAddress;

    public OnlineOrder() {
        super();
        this.status = OnlineOrderStatus.CONFIRMED;
    }

    public OnlineOrder(boolean delivery, Country country) {
        this();
        this.delivery = delivery;
        this.country = country;
    }

    public OnlineOrderStatus getStatus() {
        return this.status;
    }

    public void setStatus(OnlineOrderStatus status) {
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

    public Country getCountry() {
        return this.country;
    }

    public void setCountry(Country country) {
        this.country = country;
    }

    public StoreSite getPickupSite() {
        return this.pickupSite;
    }

    public void setPickupSite(StoreSite pickupSite) {
        this.pickupSite = pickupSite;
    }

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
