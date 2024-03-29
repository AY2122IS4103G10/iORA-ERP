package com.iora.erp.model.customerOrder;

import java.util.Objects;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.iora.erp.model.product.Product;

@Entity
public class CustomerOrderLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int qty;

    // Used only for onlineOrder
    private int pickedQty;
    private int packedQty;

    @ManyToOne(optional = false)
    private Product product;

    @Column(scale = 2)
    private double subTotal;

    public CustomerOrderLI() {
        this.pickedQty = 0;
        this.packedQty = 0;
    }

    public CustomerOrderLI(int qty, Product product) {
        this();
        this.qty = qty;
        this.product = product;
    }

    public CustomerOrderLI(int qty, Product product, double subTotal) {
        this();
        this.qty = qty;
        this.product = product;
        this.subTotal = subTotal;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public int getQty() {
        return this.qty;
    }

    public void setQty(int qty) {
        this.qty = qty;
    }

    public int getPickedQty() {
        return this.pickedQty;
    }

    public void setPickedQty(int pickedQty) {
        this.pickedQty = pickedQty;
    }

    public int getPackedQty() {
        return this.packedQty;
    }

    public void setPackedQty(int packedQty) {
        this.packedQty = packedQty;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public double getSubTotal() {
        return this.subTotal;
    }

    public void setSubTotal(double subTotal) {
        this.subTotal = subTotal;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof CustomerOrderLI)) {
            return false;
        }
        CustomerOrderLI customerOrderLI = (CustomerOrderLI) o;
        return Objects.equals(product, customerOrderLI.product) && Objects.equals(qty, customerOrderLI.qty);
    }
}
