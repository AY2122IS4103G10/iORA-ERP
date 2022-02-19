package com.iora.erp.model.site;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

import com.iora.erp.model.product.ProductItem;

@Entity
public class StockLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "stockLevel")
    private List<ProductItem> productItems;

    @ElementCollection
    private Map<String, Long> products;

    @ElementCollection
    private Map<String, Long> models;
    
    @ElementCollection
    private Map<String, Long> reserveProducts;

    public StockLevel() {
        this.productItems = new ArrayList<>();
        this.products = new HashMap<>();
        this.models = new HashMap<>();
        this.reserveProducts = new HashMap<>();
    }

    public StockLevel(List<ProductItem> productItems) {
        this.productItems = productItems;
        String SKUCode;
        String modelCode;
        for (ProductItem item: productItems) {
            item.setStockLevel(this);
            SKUCode = item.getProductSKU();
            modelCode = SKUCode.split("-")[0];
            products.merge(SKUCode, 1L, (x, y) -> x + y);
            models.merge(modelCode, 1L, (x,y) -> x + y);
        }
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<ProductItem> getProductItems() {
        return this.productItems;
    }

    public void setProductItems(List<ProductItem> productItems) {
        this.productItems = productItems;
    }

    public Map<String,Long> getProducts() {
        return this.products;
    }

    public void setProducts(Map<String,Long> products) {
        this.products = products;
    }

    public Map<String,Long> getModels() {
        return this.models;
    }

    public void setModels(Map<String,Long> models) {
        this.models = models;
    }

    public Map<String,Long> getReserveProducts() {
        return this.reserveProducts;
    }

    public void setReserveProducts(Map<String,Long> reserveProducts) {
        this.reserveProducts = reserveProducts;
    }

}
