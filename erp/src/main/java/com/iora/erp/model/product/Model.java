package com.iora.erp.model.product;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.Size;

@Entity
public class Model {

    @Id
    private String modelCode;

    @Column(nullable = false)
    private String name;

    @Column(length = 512)
    @Size(max = 512)
    private String description;

    @Column(nullable = false, scale = 2)
    private double listPrice;

    @Column(nullable = false, scale = 2)
    private double discountPrice;

    @Column(nullable = false)
    private boolean onlineOnly;

    @Column(nullable = false)
    private boolean available;

    @OneToMany
    private List<Product> products;

    @ManyToMany
    private Set<ProductField> productFields;

    public Model() {
    }

    public Model(String modelCode) {
        this.modelCode = modelCode;
        products = new ArrayList<>();
        productFields = new HashSet<>();
    }

    public Model(String modelCode, String name, String description, double listPrice, double discountPrice,
            boolean onlineOnly,
            boolean available) {
        this(modelCode);
        this.name = name;
        this.description = description;
        this.listPrice = listPrice;
        this.discountPrice = discountPrice;
        this.onlineOnly = onlineOnly;
        this.available = available;
    }

    public String getModelCode() {
        return this.modelCode;
    }

    public void setModelCode(String modelCode) {
        this.modelCode = modelCode;
    }

    public String getName() {
        return this.name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return this.description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public double getListPrice() {
        return this.listPrice;
    }

    public void setListPrice(double listPrice) {
        this.listPrice = listPrice;
    }

    public double getDiscountPrice() {
        return this.discountPrice;
    }

    public void setDiscountPrice(double discountPrice) {
        this.discountPrice = discountPrice;
    }

    public boolean getAvailable() {
        return this.available;
    }

    public boolean isOnlineOnly() {
        return this.onlineOnly;
    }

    public void setOnlineOnly(boolean onlineOnly) {
        this.onlineOnly = onlineOnly;
    }

    public boolean isAvailable() {
        return this.available;
    }

    public void setAvailable(boolean available) {
        this.available = available;
    }

    public List<Product> getProducts() {
        return this.products;
    }

    public void setProducts(List<Product> products) {
        this.products = products;
    }

    public Set<ProductField> getProductFields() {
        return this.productFields;
    }

    public void setProductFields(Set<ProductField> productFields) {
        this.productFields = productFields;
    }

    public void addProductField(ProductField productField) {
        this.productFields.add(productField);
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Model)) {
            return false;
        }
        Model model = (Model) o;
        if ((this.modelCode == null && model.modelCode == null)
                || (this.modelCode == null && !this.modelCode.equals(model.modelCode))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Field[ modelCode=" + modelCode + " ]";
    }
}