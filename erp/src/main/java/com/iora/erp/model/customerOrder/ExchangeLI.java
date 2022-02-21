package com.iora.erp.model.customerOrder;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.iora.erp.model.product.ProductItem;

@Entity
public class ExchangeLI {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(optional = false)
    private ProductItem oldItem;

    @OneToOne(optional = false)
    private ProductItem newItem;

    public ExchangeLI() {
    }

    public ExchangeLI(ProductItem oldItem, ProductItem newItem) {
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

    public ProductItem getOldItem() {
        return this.oldItem;
    }

    public void setOldItem(ProductItem oldItem) {
        this.oldItem = oldItem;
    }

    public ProductItem getNewItem() {
        return this.newItem;
    }

    public void setNewItem(ProductItem newItem) {
        this.newItem = newItem;
    }
}
