package com.iora.erp.model.site;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;

import com.iora.erp.model.product.ProductItem;

@Entity
public class StockLevel {

    @Id
    private Long id;

    @ElementCollection
    private Map<String, Long> quantities;

    @ElementCollection
    private Map<String, Long> reservationQty;

    @ElementCollection
    private Map<String, List<ProductItem>> items;

    public StockLevel(Long id) {
        this.id = id;
        this.quantities = new HashMap<>();
        this.reservationQty = new HashMap<>();
        this.items = new HashMap<>();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Map<String, Long> getQuantities() {
        return this.quantities;
    }

    public void setQuantities(Map<String, Long> quantities) {
        this.quantities = quantities;
    }

    public Map<String, Long> getReservationQty() {
        return this.reservationQty;
    }

    public void setReservationQty(Map<String, Long> reservationQty) {
        this.reservationQty = reservationQty;
    }

    public Map<String, List<ProductItem>> getItems() {
        return this.items;
    }

    public void setItems(Map<String, List<ProductItem>> items) {
        this.items = items;
    }
}
