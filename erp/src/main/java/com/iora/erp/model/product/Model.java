package com.iora.erp.model.product;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.OneToMany;
import javax.validation.constraints.Size;

import com.iora.erp.enumeration.FashionLine;

@Entity
public class Model {

    @Id
    private String modelCode;

    @Column(nullable = false, unique = true)
    private String name;

    @Column(length = 512)
    @Size(max = 512)
    private String description;

    @Column(nullable = false)
    @Enumerated(EnumType.STRING)
    private FashionLine fashionLine;

    @Column(nullable = false, scale = 2)
    private double price;

    @Column(nullable = false)
    private boolean onlineOnly;

    @Column(nullable = false)
    private boolean available;

    @OneToMany
    private List<Product> products;

    @ManyToMany
    private List<ProductField> productFields;

    public Model() {
    }

    public Model(String modelCode) {
        this.modelCode = modelCode;
        products = new ArrayList<>();
        productFields = new ArrayList<>();
    }

    public Model(String modelCode, String name, String description, FashionLine fashionLine, double price, boolean onlineOnly,
            boolean available) {
        this(modelCode);
        this.name = name;
        this.description = description;
        this.fashionLine = fashionLine;
        this.price = price;
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

    public FashionLine getFashionLine() {
        return this.fashionLine;
    }

    public void setFashionLine(FashionLine fashionLine) {
        this.fashionLine = fashionLine;
    }

    public double getPrice() {
        return this.price;
    }

    public void setPrice(double price) {
        this.price = price;
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

    public List<ProductField> getProductFields() {
        return this.productFields;
    }

    public void setProductFields(List<ProductField> productFields) {
        this.productFields = productFields;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof Model)) {
            return false;
        }
        Model model = (Model) o;
        if ((this.modelCode == null && model.modelCode == null) || (this.modelCode == null && !this.modelCode.equals(model.modelCode))) {
            return false;
        }
        return true;
    }

    @Override
    public String toString() {
        return "entity.Field[ modelCode=" + modelCode + " ]";
    }
}