package com.iora.erp.model.procurementOrder;

import java.util.List;
import java.util.Map;
import java.util.Objects;

import javax.persistence.ElementCollection;
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

    private Double costPrice;

    private int requestedQty;
    private int pickedQty;
    private int packedQty;
    private int receivedQty;

    @ElementCollection
    private List<String> files;

    @ElementCollection
    private Map<Long, Integer> siteQuantities;

    public ProcurementOrderLI() {
        this.requestedQty = 0;
        this.pickedQty = 0;
        this.packedQty = 0;
        this.receivedQty = 0;
        this.costPrice = 0.0;
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

    public Double getCostPrice() {
        return this.costPrice;
    }

    public void setCostPrice(Double costPrice) {
        this.costPrice = costPrice;
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

    public List<String> getFiles() {
        return this.files;
    }

    public void setFiles(List<String> files) {
        this.files = files;
    }

    public Map<Long,Integer> getSiteQuantities() {
        return this.siteQuantities;
    }

    public void setSiteQuantities(Map<Long,Integer> siteQuantities) {
        this.siteQuantities = siteQuantities;
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
