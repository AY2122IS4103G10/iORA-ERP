package com.iora.erp.enumeration;

public enum StockTransferStatus implements StatusEnum {
    PENDINGALL("Pending approval from 2 other sites."),
    PENDINGONE("Pending approval from 1 other site."),
    CONFIRMED("Sender site has approved the Stock Transfer and is now packing the order."),
    READY("Order is ready and will be out for delivery on the next available slot."),
    DELIVERING("Order is out for delivery to receipient site."),
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
