package com.iora.erp.model.product;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

@Entity
public class ProductItem {
    @Id
    private String rfid;

    @ManyToOne (optional = false)
    private Product product;

    public ProductItem() {
    }

    public ProductItem(String rfid) {
        this.rfid = rfid;
    }

    public String getRfid() {
        return this.rfid;
    }

    public void setRfid(String rfid) {
        this.rfid = rfid;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof ProductItem)) {
            return false;
        }
        ProductItem productItem = (ProductItem) o;
        return this.rfid == productItem.rfid;
    }

    @Override
    public String toString() {
        return "entity.Field[ rfid=" + rfid + " ]";
    }
}
