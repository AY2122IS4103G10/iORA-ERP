package com.iora.erp.model.product;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class Product {
    
    @Id
    private String sku;

    @OneToMany(mappedBy = "product")
    private List<ProductItem> productItems;

    public Product(String sku) {
        this.sku = sku;
        this.productItems = new ArrayList<>();
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
