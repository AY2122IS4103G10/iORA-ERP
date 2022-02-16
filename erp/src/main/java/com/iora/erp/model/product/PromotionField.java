package com.iora.erp.model.product;

import javax.persistence.Entity;

@Entity
public class PromotionField extends ProductField {
    private double discountedPrice;

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
}
