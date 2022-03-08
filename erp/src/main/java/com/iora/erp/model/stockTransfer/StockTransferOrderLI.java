package com.iora.erp.model.stockTransfer;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.iora.erp.model.product.Product;

@Entity
public class StockTransferOrderLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(optional = false)
    private Product product;
    private Integer requestedQty;
    private Integer sentQty;
    private Integer actualQty;

    public StockTransferOrderLI() {
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

    public Integer getRequestedQty() {
        return this.requestedQty;
    }

    public void setRequestedQty(Integer requestedQty) {
        this.requestedQty = requestedQty;
    }

    public Integer getSentQty() {
        return this.sentQty;
    }

    public void setSentQty(Integer sentQty) {
        this.sentQty = sentQty;
    }

    public Integer getActualQty() {
        return this.actualQty;
    }

    public void setActualQty(Integer actualQty) {
        this.actualQty = actualQty;
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
