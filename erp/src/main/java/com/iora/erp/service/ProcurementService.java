package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.IllegalPOModificationException;
import com.iora.erp.exception.ProcurementOrderException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.site.Site;

public interface ProcurementService {
    public abstract ProcurementOrder getProcurementOrder(Long id);
    public abstract List<ProcurementOrder> getProcurementOrders();
    public abstract List<ProcurementOrder> getProcurementOrdersOfSite(Site site);
    public abstract ProcurementOrder createProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException;
    public abstract ProcurementOrder updateProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder deleteProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder rejectProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder confirmProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder fulfilProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder shipProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder verifyProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder completeProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
}
