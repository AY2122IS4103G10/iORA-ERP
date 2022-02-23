package com.iora.erp.model.procurementOrder;

import java.util.ArrayList;
import java.util.List;
import java.util.Objects;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.iora.erp.enumeration.ProcurementOrderFulfilmentStatus;

@Entity
public class ProcurementOrderFulfilment {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ElementCollection
    private List<POFStatus> statusHistory;
    @OneToOne(mappedBy = "procurementOrderFulfilment")
    private ProcurementOrder procurementOrder;

    public ProcurementOrderFulfilment() {
        this.statusHistory = new ArrayList<>();
    }

    public ProcurementOrderFulfilment(Long id) {
        this.id = id;
        this.statusHistory = new ArrayList<>();
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public List<POFStatus> getStatusHistory() {
        return this.statusHistory;
    }

    public void setStatusHistory(List<POFStatus> statusHistory) {
        this.statusHistory = statusHistory;
    }

    @JsonIgnore
    public ProcurementOrderFulfilmentStatus getLastStatus() {
        try {
            return this.statusHistory.get(this.statusHistory.size() - 1).getStatus();
        } catch (Exception ex) {
            return null;
        }
    }

    public void addStatus(POFStatus status) {
        this.statusHistory.add(status);
    }

    @JsonIgnore
    public ProcurementOrder getProcurementOrder() {
        return this.procurementOrder;
    }

    public void setProcurementOrder(ProcurementOrder procurementOrder) {
        this.procurementOrder = procurementOrder;
    }

    public ProcurementOrderFulfilment id(Long id) {
        setId(id);
        return this;
    }

    @Override
    public boolean equals(Object o) {
        if (o == this)
            return true;
        if (!(o instanceof ProcurementOrderFulfilment)) {
            return false;
        }
        ProcurementOrderFulfilment procurementOrderFulfilment = (ProcurementOrderFulfilment) o;
        return Objects.equals(id, procurementOrderFulfilment.id);
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
