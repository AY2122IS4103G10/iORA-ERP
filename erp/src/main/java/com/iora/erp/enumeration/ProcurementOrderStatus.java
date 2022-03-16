package com.iora.erp.enumeration;

public enum ProcurementOrderStatus implements StatusEnum {
    PENDING("Pending confirmation from factory."),
    ACCEPTED("Order has been accepted by factory."),
    MANUFACTURED("Factory has completed the manufacturing process."),
    PICKING("Items are being picked by the factory."),
    PICKED("Items are picked and is ready for packing by the factory."),
    PACKING("Items are being packed by the factory."),
    PACKED("Items are packed and is being processed for shipping"),
    READY_FOR_SHIPPING("Order is processed and ready for shipping."),
    SHIPPING("Order is on its way to its destination in one single delivery."),
    SHIPPING_MULTIPLE("Order is on its way to its destination in multiple deliveries."),
    COMPLETED("Procurement Order has been fulfilled"),
    CANCELLED("Procurement Order cancelled.");

    private String description;

    private ProcurementOrderStatus(String description) {
        this.description = description;
    }

    @Override
    public String getDescription() {
        return this.description;
    }
}
