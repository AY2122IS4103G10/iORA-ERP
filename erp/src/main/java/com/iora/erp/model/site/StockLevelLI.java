package com.iora.erp.model.site;

import java.util.List;

import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductItem;

@Entity
public class StockLevelLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JsonManagedReference
    @ManyToOne
    private Product product;

    @JsonBackReference
    @ManyToOne
    private StockLevel stockLevel;

    @Column(nullable = false)
    private Long qty = 0L;

    @Column(nullable = false)
    private Long reserveQty;

    // For RFIDs
    @OneToMany
    private List<ProductItem> productItems;

    public StockLevelLI() {
    }

    public StockLevelLI(Product product, StockLevel stockLevel, Long qty, Long reserveQty, List<ProductItem> productItems) {
        this.product = product;
        this.stockLevel = stockLevel;
        this.qty = qty;
        this.reserveQty = reserveQty;
        this.productItems = productItems;
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

    public List<ProductItem> getProductItems() {
        return this.productItems;
    }

    public void setProductItems(List<ProductItem> productItems) {
        this.productItems = productItems;
    }

    public Long getReserveQty() {
        return this.reserveQty;
    }

    public void setReserveQty(Long reserveQty) {
        this.reserveQty = reserveQty;
    }

}
