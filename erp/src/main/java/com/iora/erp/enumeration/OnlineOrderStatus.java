package com.iora.erp.enumeration;

public enum OnlineOrderStatus implements StatusEnum {
    PENDING("Order has been received. We are preparing your order."),
    SHIPPING_TO_WAREHOUSE("Order is on its way to our warehouse."),
    READY_FOR_DELIVERY("Order is ready and will be out for delivery on the next available slot."),
    OUT_FOR_DELIVERY("Order is on its way to you."),
    READY_FOR_COLLECTION("Order is ready for collection at your designated outlet."),
    COLLECTED("Order has been collected."),
    DELIVERED("Order has been delivered."),
    CANCELLED("Order has been cancelled.");

    private String description;

    private OnlineOrderStatus(String description) {
        this.description = description;
    }

    @Override
    public String getDescription() {
        return this.description;
    }
}
