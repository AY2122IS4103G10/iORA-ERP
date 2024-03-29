package com.iora.erp.model.procurementOrder;

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

import com.fasterxml.jackson.annotation.JsonIdentityInfo;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.ObjectIdGenerators;
import com.iora.erp.enumeration.ProcurementOrderStatusEnum;
import com.iora.erp.model.site.Site;

@Entity
public class ProcurementOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ElementCollection
    private List<POStatus> statusHistory;
    @OneToMany(cascade = CascadeType.ALL)
    private List<ProcurementOrderLI> lineItems;
    private String notes;

    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @ManyToOne
    private Site manufacturing;
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @ManyToOne
    private Site headquarters;
    @JsonIdentityInfo(generator = ObjectIdGenerators.PropertyGenerator.class, property = "id")
    @ManyToOne
    private Site warehouse;

    public ProcurementOrder() {
        this.lineItems = new ArrayList<>();
        this.statusHistory = new ArrayList<>();
    }

    public ProcurementOrder(Long id, List<POStatus> statusHistory, List<ProcurementOrderLI> lineItems,
            Site manufacturing, Site headquarters, Site warehouse) {
        this.id = id;
        this.statusHistory = statusHistory;
        this.lineItems = lineItems;
        this.manufacturing = manufacturing;
        this.headquarters = headquarters;
        this.warehouse = warehouse;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<POStatus> getStatusHistory() {
        return this.statusHistory;
    }

    public void setStatusHistory(List<POStatus> statusHistory) {
        this.statusHistory = statusHistory;
    }

    @JsonIgnore
    public ProcurementOrderStatusEnum getLastStatus() {
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

    public void addStatus(POStatus status) {
        this.statusHistory.add(status);
    }

    public List<ProcurementOrderLI> getLineItems() {
        return this.lineItems;
    }

    public void setLineItems(List<ProcurementOrderLI> lineItems) {
        this.lineItems = lineItems;
    }

    public void addLineItem(ProcurementOrderLI lineItem) {
        this.lineItems.add(lineItem);
    }

    public String getNotes() {
        return this.notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }

    public Site getManufacturing() {
        return this.manufacturing;
    }

    public void setManufacturing(Site manufacturing) {
        this.manufacturing = manufacturing;
    }

    public Site getHeadquarters() {
        return this.headquarters;
    }

    public void setHeadquarters(Site headquarters) {
        this.headquarters = headquarters;
    }

    public Site getWarehouse() {
        return this.warehouse;
    }

    public void setWarehouse(Site warehouse) {
        this.warehouse = warehouse;
    }

    public ProcurementOrder id(Long id) {
        setId(id);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof ProcurementOrder)) {
            return false;
        }
        ProcurementOrder procurementOrder = (ProcurementOrder) o;
        return Objects.equals(id, procurementOrder.id);
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
