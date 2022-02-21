package com.iora.erp.model.stockTransfer;

import java.util.List;
import java.util.Objects;

import javax.persistence.CascadeType;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;

import com.iora.erp.model.site.Site;

@Entity
public class StockTransferOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<STOStatus> statusHistory;

    @OneToMany(cascade = CascadeType.ALL)
    private List<StockTransferOrderLI> lineItems;

    @ManyToOne
    private Site fromSite;

    @ManyToOne
    private Site toSite;

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<STOStatus> getStatusHistory() {
        return this.statusHistory;
    }

    public void setStatusHistory(List<STOStatus> statusHistory) {
        this.statusHistory = statusHistory;
    }

    public List<StockTransferOrderLI> getLineItems() {
        return this.lineItems;
    }

    public void setLineItems(List<StockTransferOrderLI> lineItems) {
        this.lineItems = lineItems;
    }

    public Site getFromSite() {
        return this.fromSite;
    }

    public void setFromSite(Site fromSite) {
        this.fromSite = fromSite;
    }

    public Site getToSite() {
        return this.toSite;
    }

    public void setToSite(Site toSite) {
        this.toSite = toSite;
    }
    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof StockTransferOrder)) {
            return false;
        }
        StockTransferOrder stockTransfeOrder = (StockTransferOrder) o;
        return Objects.equals(id, stockTransfeOrder.id);
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
