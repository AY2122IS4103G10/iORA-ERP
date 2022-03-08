package com.iora.erp.model.product;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.iora.erp.model.site.StockLevelLI;

@Entity
public class Product {
    
    @Id
    private String sku;

    @ManyToMany
    private Set<ProductField> productFields;

    @JsonBackReference
    @OneToMany(mappedBy = "product")
    private List<StockLevelLI> stockLevels;

    public Product() {
    }

    public Product(String sku) {
        this.sku = sku;
        this.productFields = new HashSet<>();
        this.stockLevels = new ArrayList<>();
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

    public List<StockLevelLI> getStockLevels() {
        return this.stockLevels;
    }

    public void setStockLevels(List<StockLevelLI> stockLevels) {
        this.stockLevels = stockLevels;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Product)) {
            return false;
        }
        Product product = (Product) o;
        return Objects.equals(sku, product.sku);
    }
}
