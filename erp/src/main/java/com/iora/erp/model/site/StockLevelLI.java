package com.iora.erp.model.site;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.iora.erp.model.product.Product;

@Entity
public class StockLevelLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    @JsonBackReference
    @ManyToOne
    private StockLevel stockLevel;

    @Column(nullable = false)
    private Long qty = 0L;

    @Column(nullable = false)
    private Long reserveQty;

    public StockLevelLI() {
    }

    public StockLevelLI(Product product, StockLevel stockLevel, Long qty, Long reserveQty) {
        this.product = product;
        this.stockLevel = stockLevel;
        this.qty = qty;
        this.reserveQty = reserveQty;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getSKU() {
        return this.product.getSku();
    }

    public StockLevel getStockLevel() {
        return this.stockLevel;
    }

    public void setStockLevel(StockLevel stockLevel) {
        this.stockLevel = stockLevel;
    }

    public Long getQty() {
        return this.qty;
    }

    public void setQty(Long qty) {
        this.qty = qty;
    }

    public Long getReserveQty() {
        return this.reserveQty;
    }

    public void setReserveQty(Long reserveQty) {
        this.reserveQty = reserveQty;
    }

}
