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
    private int fulfilledQty;
    private int actualQty;

    public ProcurementOrderLI() {
        this.requestedQty = 0;
        this.fulfilledQty = 0;
        this.actualQty = 0;
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

    public int getFulfilledQty() {
        return this.fulfilledQty;
    }

    public void setFulfilledQty(int fulfilledQty) {
        this.fulfilledQty = fulfilledQty;
    }

    public int getActualQty() {
        return this.actualQty;
    }

    public void setActualQty(int actualQty) {
        this.actualQty = actualQty;
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
