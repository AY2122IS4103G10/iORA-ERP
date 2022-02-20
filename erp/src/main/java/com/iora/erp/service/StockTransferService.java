package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.stockTransfer.StockTransferOrder;

public interface StockTransferService {
    public abstract StockTransferOrder getStockTransferOrder(Long id) throws StockTransferException;
    public abstract List<StockTransferOrder> getStockTransferOrder() throws StockTransferException;
    public abstract List<StockTransferOrder> getStockTransferOrderOfSite(Site site);
    public abstract void createStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId) throws SiteConfirmationException;
    public abstract void updateStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract void deleteStockTransferOrder(Long id, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract void rejectStockTransferOrder(Long id, Long siteId) throws StockTransferException, SiteConfirmationException;
    public abstract void confirmStockTransferOrder(Long id, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract void fulfilStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract void deliverStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract void completeStockTransferOrder(Long id, Long siteId) throws StockTransferException, SiteConfirmationException;
}
