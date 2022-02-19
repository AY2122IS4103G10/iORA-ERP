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
    public abstract void createProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException;
    public abstract void updateProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException;
    public abstract void deleteProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract void rejectProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract void confirmProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract void fulfilProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException;
    public abstract void shipProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException;
    public abstract void verifyProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException;
    public abstract void completeProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
}
