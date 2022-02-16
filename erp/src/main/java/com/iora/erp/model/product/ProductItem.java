package com.iora.erp.model.product;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.xml.bind.annotation.XmlTransient;

import com.iora.erp.model.site.StockLevel;

@Entity
public class ProductItem {
    @Id
    private String rfid;

    @Column(nullable = false)
    private boolean available;

    @Column(nullable = false)
    private String productSKU;

    @ManyToOne
    @XmlTransient
    private StockLevel stockLevel;

    public ProductItem() {
    }

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

    public String getProductSKU() {
        return this.productSKU;
    }

    public void setProductSKU(String productSKU) {
        this.productSKU = productSKU;
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
