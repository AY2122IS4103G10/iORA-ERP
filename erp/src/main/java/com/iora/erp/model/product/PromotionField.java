package com.iora.erp.model.product;

import javax.persistence.Entity;

@Entity
public class PromotionField extends ProductField {
    private double discountedPrice;
    private boolean available = true;

    public PromotionField() {
        super();
    }

    public PromotionField(String fieldName, String fieldValue, double discountedPrice) {
        super(fieldName, fieldValue);
        this.discountedPrice = discountedPrice;
    }

    public double getDiscountedPrice() {
        return this.discountedPrice;
    }

    public void setDiscountedPrice(double discountedPrice) {
        this.discountedPrice = discountedPrice;
    }

    public boolean isAvailable() {
        return this.available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }
}
