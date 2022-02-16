package com.iora.erp.model.procurementOrder;

import java.util.List;
import java.util.Objects;

import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.OneToOne;

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
    }

    public ProcurementOrderFulfilment(Long id) {
        this.id = id;
    }

    public Long getId() {
        return this.id;
    }

    public void setId(Long id) {
        this.id = id;
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
