package com.iora.erp.model.procurementOrder;

import java.util.Objects;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;

import com.iora.erp.model.product.Product;

@Entity
public class ProcurementOrderLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    private int requestedQty;
    private int pickedQty;
    private int packedQty;
    private int receivedQty;

    public ProcurementOrderLI() {
        this.requestedQty = 0;
        this.pickedQty = 0;
        this.packedQty = 0;
        this.receivedQty = 0;
    }


    public ProcurementOrderLI(Product product, int requestedQty) {
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

    public int getRequestedQty() {
        return this.requestedQty;
    }

    public void setRequestedQty(int requestedQty) {
        this.requestedQty = requestedQty;
    }

    public int getPickedQty() {
        return this.pickedQty;
    }

    public void setPickedQty(int pickedQty) {
        this.pickedQty = pickedQty;
    }

    public int getPackedQty() {
        return this.packedQty;
    }

    public void setPackedQty(int packedQty) {
        this.packedQty = packedQty;
    }

    public int getReceivedQty() {
        return this.receivedQty;
    }

    public void setReceivedQty(int receivedQty) {
        this.receivedQty = receivedQty;
    }
    
    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof ProcurementOrderLI)) {
            return false;
        }
        ProcurementOrderLI procurementOrderLI = (ProcurementOrderLI) o;
        return Objects.equals(id, procurementOrderLI.id);
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
