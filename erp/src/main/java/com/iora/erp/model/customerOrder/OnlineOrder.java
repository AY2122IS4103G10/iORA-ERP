package com.iora.erp.model.customerOrder;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;

import com.iora.erp.enumeration.Country;
import com.iora.erp.enumeration.OnlineOrderStatus;

@Entity
public class OnlineOrder extends CustomerOrder {

    @Enumerated(EnumType.STRING)
    private OnlineOrderStatus status;

    private boolean delivery;

    @ElementCollection
    private List<CustomerOrderLI> packedLineItems;

    @Enumerated(EnumType.STRING)
    private Country country;
    
    private String deliveryAddress;

    public OnlineOrder() {
        super();
        this.status = OnlineOrderStatus.CONFIRMED;
        this.packedLineItems = new ArrayList<>();
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
    
    public List<CustomerOrderLI> getPackedLineItems() {
        return this.packedLineItems;
    }

    public void setPackedLineItems(List<CustomerOrderLI> packedLineItems) {
        this.packedLineItems = packedLineItems;
    }

    public void addPackedLineItems(CustomerOrderLI packedLineItem) {
        this.packedLineItems.add(packedLineItem);
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

    public String getDeliveryAddress() {
        return this.deliveryAddress;
    }

    public void setDeliveryAddress(String deliveryAddress) {
        this.deliveryAddress = deliveryAddress;
    }
}
