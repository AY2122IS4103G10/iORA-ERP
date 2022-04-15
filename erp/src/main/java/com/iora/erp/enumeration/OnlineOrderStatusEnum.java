package com.iora.erp.enumeration;

public enum OnlineOrderStatusEnum implements StatusEnum {
    PENDING("Order has been confirmed and will be prepared soon."),
    PICKING("Items are being picked by warehouse staff."),
    PICKED("Items are picked and is ready to be packed"),
    PACKING("Items are being packed by warehouse staff."),
    PACKED("Items are packed and is ready to be processed."),
    READY_FOR_DELIVERY("Order is ready and will be out for delivery on the next available slot."),
    DELIVERING("Order is on its way to its destination in a single delivery."),
    DELIVERING_MULTIPLE("Order is on its way to its destination in multiple delivery."),
    LOST("Order is lost on its way to its destination."),
    READY_FOR_COLLECTION("Order is ready for collection at the designated outlet."),
    COLLECTED("Order has been collected."),
    DELIVERED("Order has been delivered."),
    CANCELLED("Order has been cancelled.");

    private String description;

    private OnlineOrderStatusEnum(String description) {
        this.description = description;
    }

    @Override
    public String getDescription() {
        return this.description;
    }
}
