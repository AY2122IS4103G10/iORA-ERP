package com.iora.erp.model.site;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToMany;

@Entity
public class StockLevel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToMany(mappedBy = "stockLevel")
    private List<StockLevelLI> products;

    public StockLevel() {
        this.products = new ArrayList<>();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<StockLevelLI> getProducts() {
        return this.products;
    }

    public void setProducts(List<StockLevelLI> products) {
        this.products = products;
    }
}
