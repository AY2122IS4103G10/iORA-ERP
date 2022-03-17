package com.iora.erp.enumeration;

public enum StockTransferStatus implements StatusEnum {
    PENDING("Pending approval from origin site."),
    ACCEPTED("Order has been approved and will be picked soon."),
    PICKING("Items are being picked."),
    PICKED("Items are picked and is ready for packing."),
    PACKING("Items are being packed."),
    PACKED("Items are packed and is being processed for delivering"),
    READY_FOR_DELIVERY("Order is ready and will be out for delivery on the next available slot."),
    DELIVERING("Order is on the way to its destination in 1 single delivery."),
    DELIVERING_MULTIPLE("Order is on the way to its destination in multiple deliveries."),
    COMPLETED("Stock Transfer Order has been fulfilled"),
    CANCELLED("Stock Transfer Order has been cancelled");

    private String description;

    private StockTransferStatus(String description) {
        this.description = description;
    }

    @Override
    public String getDescription() {
        return this.description;
    }
}
