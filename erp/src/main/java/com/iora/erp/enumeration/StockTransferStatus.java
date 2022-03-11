package com.iora.erp.enumeration;

public enum StockTransferStatus implements StatusEnum {
    PENDINGALL("Pending approval from 2 other sites."),
    PENDINGONE("Pending approval from 1 other site."),
    ACCEPTED("All sites have approved the order and is now ready for picking."),
    PICKING("Items are being picked."),
    PICKED("Items are picked and is ready for packing."),
    PACKING("Items are being packed."),
    PACKED("Items are packed and is being processed for delivering"),
    READY_FOR_DELIVERY("Order is ready and will be out for delivery on the next available slot."),
    DELIVERING("Order is out for delivery."),
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
