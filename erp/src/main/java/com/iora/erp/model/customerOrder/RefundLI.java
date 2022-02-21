package com.iora.erp.model.customerOrder;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.iora.erp.model.product.ProductItem;

@Entity
public class RefundLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    private ProductItem refundedItem;

    public RefundLI() {
    }

    public RefundLI(ProductItem refundedItem) {
        this();
        this.refundedItem = refundedItem;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public ProductItem getRefundedItem() {
        return this.refundedItem;
    }

    public void setRefundedItem(ProductItem refundedItem) {
        this.refundedItem = refundedItem;
    }    
}
