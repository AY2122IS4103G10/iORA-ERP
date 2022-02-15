package com.iora.erp.model.product;

import javax.persistence.Entity;

@Entity
public class PromotionField extends ProductField {
    private double discountedPrice;

    public double getDiscountedPrice() {
        return this.discountedPrice;
    }

    public void setDiscountedPrice(double discountedPrice) {
        this.discountedPrice = discountedPrice;
    }
}
