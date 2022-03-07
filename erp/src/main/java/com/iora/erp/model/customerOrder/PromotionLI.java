package com.iora.erp.model.customerOrder;

import javax.persistence.Entity;
import javax.persistence.ManyToOne;

import com.iora.erp.model.product.PromotionField;

@Entity
public class PromotionLI extends CustomerOrderLI {
    @ManyToOne
    private PromotionField promotion;

    public PromotionLI() {
    }

    public PromotionLI(PromotionField promotion) {
        this.promotion = promotion;
    }

    public PromotionField getPromotion() {
        return this.promotion;
    }

    public void setPromotion(PromotionField promotion) {
        this.promotion = promotion;
    }

}
