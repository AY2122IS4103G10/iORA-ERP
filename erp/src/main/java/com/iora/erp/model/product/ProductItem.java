package com.iora.erp.model.product;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.xml.bind.annotation.XmlTransient;

import com.iora.erp.model.site.StockLevel;

public class ProductItem {
    @Id
    private String rfid;

    @Column(nullable = false)
    private boolean available;

    @ManyToOne
    private Product product;

    @ManyToOne
    @XmlTransient
    private StockLevel stockLevel;

    public ProductItem(String rfid) {
        this.rfid = rfid;
        this.available = true;
    }

    public String getRfid() {
        return this.rfid;
    }

    public void setRfid(String rfid) {
        this.rfid = rfid;
    }

    public boolean isAvailable() {
        return this.available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public Product getProduct() {
        return this.product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public StockLevel getStockLevel() {
        return this.stockLevel;
    }

    public void setStockLevel(StockLevel stockLevel) {
        this.stockLevel = stockLevel;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof ProductItem)) {
            return false;
        }
        ProductItem productItem = (ProductItem) o;
        if ((this.rfid == null && productItem.rfid == null) || (this.rfid == null && !this.rfid.equals(productItem.rfid))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Field[ rfid=" + rfid + " ]";
    }
}
