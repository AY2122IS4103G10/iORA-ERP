package com.iora.erp.model.customerOrder;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.iora.erp.model.product.Product;

@Entity
public class ExchangeLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    private Product oldItem;

    @OneToOne(optional = false)
    private Product newItem;

    public ExchangeLI() {
    }

    public ExchangeLI(Product oldItem, Product newItem) {
        this();
        this.oldItem = oldItem;
        this.newItem = newItem;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getOldItem() {
        return this.oldItem;
    }

    public void setOldItem(Product oldItem) {
        this.oldItem = oldItem;
    }

    public Product getNewItem() {
        return this.newItem;
    }

    public void setNewItem(Product newItem) {
        this.newItem = newItem;
    }
}
