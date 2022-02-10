package com.iora.erp.model.site;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Entity
public class OnlineStoreSite extends Site {

    @OneToOne(cascade = CascadeType.ALL)
    private StockLevel stockLevel;
    
}
