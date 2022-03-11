package com.iora.erp.model.stockTransfer;

import java.util.ArrayList;
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

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iora.erp.enumeration.StockTransferStatus;
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

    private boolean hqAccepted;
    private boolean opAccepeted;

    public StockTransferOrder() {
        this.lineItems = new ArrayList<>();
        this.statusHistory = new ArrayList<>();
    }

    public StockTransferOrder(Site fromSite, Site toSite) {
        this();
        this.fromSite = fromSite;
        this.toSite = toSite;
    }

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

    public void addStatusHistory(STOStatus statusHistory) {
        this.statusHistory.add(statusHistory);
    }

    @JsonIgnore
    public StockTransferStatus getLastStatus() {
        try {
            return this.statusHistory.get(this.statusHistory.size() - 1).getStatus();
        } catch (Exception ex) {
            return null;
        }
    }

    @JsonIgnore
    public Site getLastActor() {
        try {
            return this.statusHistory.get(this.statusHistory.size() - 1).getActionBy();
        } catch (Exception ex) {
            return null;
        }
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

    public boolean isHqAccepted() {
        return this.hqAccepted;
    }

    public void setHqAccepted(boolean hqAccepted) {
        this.hqAccepted = hqAccepted;
    }

    public boolean isOpAccepeted() {
        return this.opAccepeted;
    }

    public void setOpAccepeted(boolean opAccepeted) {
        this.opAccepeted = opAccepeted;
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
}
