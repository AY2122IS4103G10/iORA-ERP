package com.iora.erp.service;

import java.util.List;

import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.site.Site;

public interface ProcurementService {
    public abstract ProcurementOrder getProcurementOrder(Long id);
    public abstract List<ProcurementOrder> getProcurementOrders();
    public abstract List<ProcurementOrder> getProcurementOrdersOfSite(Site site);
    public abstract void createProcurementOrder(ProcurementOrder procurementOrder);
    public abstract void updateProcurementOrder(ProcurementOrder procurementOrder);
    public abstract void deleteProcurementOrder(Long id);
    public abstract void cancelProcurementOrder(Long id);

    public abstract void fulfilProcurementOrder(ProcurementOrder procurementOrder);
    public abstract void verifyProcurementOrder(ProcurementOrder procurementOrder);
}
