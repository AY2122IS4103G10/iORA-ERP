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
    private int requestedQty;
    private int pickedQty;
    private int packedQty;
    private int receivedQty;

    public StockTransferOrderLI() {
        this.requestedQty = 0;
        this.pickedQty = 0;
        this.packedQty = 0;
        this.receivedQty = 0;
    }

    public StockTransferOrderLI(Product product, int requestedQty) {
        this();
        this.product = product;
        this.requestedQty = requestedQty;
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

    public Integer getPickedQty() {
        return this.pickedQty;
    }

    public void setPickedQty(Integer pickedQty) {
        this.pickedQty = pickedQty;
    }

    public int getPackedQty() {
        return this.packedQty;
    }

    public void setPackedQty(int packedQty) {
        this.packedQty = packedQty;
    }

    public Integer getReceivedQty() {
        return this.receivedQty;
    }

    public void setReceivedQty(Integer receivedQty) {
        this.receivedQty = receivedQty;
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
