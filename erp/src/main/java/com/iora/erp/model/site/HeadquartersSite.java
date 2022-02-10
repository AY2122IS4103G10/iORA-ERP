package com.iora.erp.model.site;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class HeadquartersSite extends Site {

    // The Headquarters' stock is only for inventory
    @OneToOne(cascade = CascadeType.ALL)
    private StockLevel inventory;
    
}
