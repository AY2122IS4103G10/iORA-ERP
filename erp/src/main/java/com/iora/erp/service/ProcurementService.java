package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.IllegalPOModificationException;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.ProcurementOrderException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.site.Site;

public interface ProcurementService {
    public abstract ProcurementOrder getProcurementOrder(Long id) throws ProcurementOrderException;
    public abstract List<ProcurementOrder> getProcurementOrders();
    public abstract List<ProcurementOrder> getProcurementOrdersOfSite(Site site);
    public abstract List<ProcurementOrder> getProcurementOrdersByStatus(String status);
    public abstract List<ProcurementOrder> getPOBySiteStatus(Long siteId, String status) throws ProcurementOrderException;

    public abstract ProcurementOrder createProcurementOrder(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException;
    public abstract ProcurementOrder updateProcurementOrderDetails(ProcurementOrder procurementOrder, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder deleteProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder rejectProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder acceptProcurementOrder(Long id, Long siteId) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder manufactureProcurementOrder(Long id) throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException, IllegalTransferException;
    public abstract ProcurementOrder pickPackProcurementOrder(Long id) throws ProcurementOrderException;
    public abstract ProcurementOrder scanProductAtFactory(Long id, String rfidsku, int qty) throws ProductException, ProcurementOrderException;
    public abstract ProcurementOrder pickpackAtFactory(Long id, String rfidsku, int qty) throws ProductException, ProcurementOrderException;
    public abstract ProcurementOrder shipProcurementOrder(Long id) throws IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder shipMultipleProcurementOrder(Long id) throws IllegalPOModificationException, ProcurementOrderException;
    public abstract ProcurementOrder scanProductAtWarehouse(Long id, String rfidsku, int qty) throws ProductException, ProcurementOrderException;
    public abstract ProcurementOrder completeProcurementOrder(Long id) throws IllegalPOModificationException, ProcurementOrderException;
}