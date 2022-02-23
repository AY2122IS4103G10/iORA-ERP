package com.iora.erp.model.procurementOrder;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.Column;
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
public class ProcurementOrderLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    private Product product;

    @Column
    private int requestedQty;
    @OneToMany(cascade = { CascadeType.PERSIST, CascadeType.MERGE })
    private List<ProductItem> fulfilledProductItems;
    @Transient
    private int fulfilledQty;
    @OneToMany
    private List<ProductItem> actualProductItems;
    @Transient
    private int actualQty;

    public ProcurementOrderLI() {
        fulfilledProductItems = new ArrayList<>();
        actualProductItems = new ArrayList<>();
    }

    public ProcurementOrderLI(Long id) {
        this.id = id;
        fulfilledProductItems = new ArrayList<>();
        actualProductItems = new ArrayList<>();
    }


    public ProcurementOrderLI(Long id, Product product, int requestedQty, List<ProductItem> fulfilledProductItems, List<ProductItem> actualProductItems) {
        this.id = id;
        this.product = product;
        this.requestedQty = requestedQty;
        this.fulfilledProductItems = new ArrayList<>(fulfilledProductItems);
        this.actualProductItems = new ArrayList<>(actualProductItems);
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

    public List<ProductItem> getFulfilledProductItems() {
        return this.fulfilledProductItems;
    }

    public void setFulfilledProductItems(List<ProductItem> fulfilledProductItems) {
        this.fulfilledProductItems = fulfilledProductItems;
    }

    public int getFulfilledQty() {
        return this.fulfilledProductItems.size();
    }

    public List<ProductItem> getActualProductItems() {
        return this.actualProductItems;
    }

    public void setActualProductItems(List<ProductItem> actualProductItems) {
        this.actualProductItems = actualProductItems;
    }

    public int getActualQty() {
        return this.actualProductItems.size();
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
