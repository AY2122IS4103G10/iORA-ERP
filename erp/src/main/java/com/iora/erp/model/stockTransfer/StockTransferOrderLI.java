package com.iora.erp.model.stockTransfer;

import java.util.List;
import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Transient;

import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductItem;

@Entity
public class StockTransferOrderLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @ManyToOne
    private Product product;

    private Integer requestedQty;
    @OneToMany
    private List<ProductItem> requestedProductItems;

    private Integer actualQty;
    @OneToMany
    private List<ProductItem> actualProductItems;

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

    public Integer getRequestedQty() {
        return this.requestedQty;
    }

    public void setRequestedQty(Integer requestedQty) {
        this.requestedQty = requestedQty;
    }

    public List<ProductItem> getRequestedProductItems() {
        return this.requestedProductItems;
    }

    public void setRequestedProductItems(List<ProductItem> requestedProductItems) {
        this.requestedProductItems = requestedProductItems;
    }

    public Integer getActualQty() {
        return this.actualQty;
    }

    public void setActualQty(Integer actualQty) {
        this.actualQty = actualQty;
    }

    public List<ProductItem> getActualProductItems() {
        return this.actualProductItems;
    }

    public void setActualProductItems(List<ProductItem> actualProductItems) {
        this.actualProductItems = actualProductItems;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof StockTransferOrderLI)) {
            return false;
        }
        StockTransferOrderLI stockTransferOrderLI = (StockTransferOrderLI) o;
        return Objects.equals(id, stockTransferOrderLI.id);
    }
    
    @Override
    public int hashCode() {
        return Objects.hashCode(id);
    }

    @Override
    public String toString() {
        return "{" +
                " id='" + getId() + "'" +
                "}";
    }
}
