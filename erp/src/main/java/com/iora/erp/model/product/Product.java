package com.iora.erp.model.product;

import java.util.HashSet;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.iora.erp.model.site.StockLevel;

@Entity
public class Product {
    
    @Id
    private String sku;

    @ManyToMany
    private Set<ProductField> productFields;

    @JsonBackReference
    @ManyToOne
    private StockLevel stockLevel;

    public Product() {
    }

    public Product(String sku) {
        this.sku = sku;
        this.productFields = new HashSet<>();
    }

    public String getSku() {
        return this.sku;
    }

    public void setSku(String sku) {
        this.sku = sku;
    }

    public Set<ProductField> getProductFields() {
        return this.productFields;
    }

    public void setProductFields(Set<ProductField> productFields) {
        this.productFields = productFields;
    }

    public void addProductField(ProductField productField) {
        this.productFields.add(productField);
    }

    public StockLevel getStockLevel() {
        return this.stockLevel;
    }

    public void setStockLevel(StockLevel stockLevel) {
        this.stockLevel = stockLevel;
    }

    @Override
    public boolean equals(Object object) {
        if (object == this) {
            return true;
        }
        if (!(object instanceof Product)) {
            return false;
        }
        Product other = (Product) object;
        return this.sku == other.sku;
    }

    @Override
    public String toString() {
        return "entity.Field[ sku=" + sku + " ]";
    }
}
