package com.iora.erp.model.customerOrder;

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

    @ManyToOne(optional = false)
    private Product product;

    @Column(nullable = false, scale = 2)
    private double subTotal;

    public CustomerOrderLI() {
    }

    public CustomerOrderLI(int qty, Product product, double subTotal) {
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
}
