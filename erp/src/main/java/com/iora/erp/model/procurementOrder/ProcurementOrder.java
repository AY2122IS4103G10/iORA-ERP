package com.iora.erp.model.procurementOrder;

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
import javax.persistence.OneToOne;

import com.iora.erp.model.site.Site;

@Entity
public class ProcurementOrder {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ElementCollection
    private List<POStatus> statusHistory;
    @OneToOne(cascade=CascadeType.ALL)
    private ProcurementOrderFulfilment procurementOrderFulfilment;
    @OneToMany(cascade = CascadeType.ALL)
    private List<ProcurementOrderLI> lineItems;

    @ManyToOne
    private Site manufacturing;
    @ManyToOne
    private Site headquarters;
    @ManyToOne
    private Site warehouse;

    public ProcurementOrder() {
    }

    public ProcurementOrder(Long id) {
        this.id = id;
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

    public ProcurementOrderFulfilment getProcurementOrderFulfilment() {
        return this.procurementOrderFulfilment;
    }

    public void setProcurementOrderFulfilment(ProcurementOrderFulfilment procurementOrderFulfilment) {
        this.procurementOrderFulfilment = procurementOrderFulfilment;
    }

    public List<ProcurementOrderLI> getLineItems() {
        return this.lineItems;
    }

    public void setLineItems(List<ProcurementOrderLI> lineItems) {
        this.lineItems = lineItems;
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
