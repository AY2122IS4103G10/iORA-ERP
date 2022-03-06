package com.iora.erp.model.customerOrder;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import com.iora.erp.model.product.ProductItem;

@Entity
public class CustomerOrderLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Transient
    private int qty;

    @OneToMany
    private List<ProductItem> productItems;

    @Column(nullable = false, scale = 2)
    private double subTotal;

    public CustomerOrderLI() {
        this.qty = 0;
        productItems = new ArrayList<>();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQty() {
        this.qty = this.productItems.size();
        return this.qty;
    }

    public List<ProductItem> getProductItems() {
        return this.productItems;
    }

    public void setProductItems(List<ProductItem> productItems) {
        this.productItems = productItems;
        this.qty = this.productItems.size();
    }

    public void addProductItem(ProductItem productItem) {
        this.productItems.add(productItem);
        this.qty = this.productItems.size();
    }

    public void removeProductItem(ProductItem productItem) {
        this.productItems.remove(productItem);
        this.qty = this.productItems.size();
    }

    public double getSubTotal() {
        return this.subTotal;
    }

    public void setSubTotal(double subTotal) {
        this.subTotal = subTotal;
    }
}
