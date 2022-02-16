package com.iora.erp.model.product;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;

@Entity
public class Product {
    
    @Id
    private String sku;

    @OneToMany
    @JoinColumn(name = "productSKU")
    private List<ProductItem> productItems;

    @ManyToMany
    private Set<ProductField> productFields;

    public Product() {
    }

    public Product(String sku) {
        this.sku = sku;
        this.productItems = new ArrayList<>();
        this.productFields = new HashSet<>();
    }

    public String getsku() {
        return this.sku;
    }

    public void setsku(String sku) {
        this.sku = sku;
    }

    public List<ProductItem> getProductItems() {
        return this.productItems;
    }

    public void setProductItems(List<ProductItem> productItems) {
        this.productItems = productItems;
    }

    public void addProductItem(ProductItem productItem) {
        this.productItems.add(productItem);
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

    @Override
    public boolean equals(Object object) {
        if (object == this) {
            return true;
        }
        if (!(object instanceof Product)) {
            return false;
        }
        Product other = (Product) object;
        if ((this.sku == null && other.sku == null) || (this.sku == null && !this.sku.equals(other.sku))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Field[ sku=" + sku + " ]";
    }
}
