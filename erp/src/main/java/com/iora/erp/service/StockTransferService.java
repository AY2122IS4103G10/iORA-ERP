package com.iora.erp.service;

import java.util.List;

import javax.naming.directory.InvalidAttributesException;

import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.stockTransfer.StockTransferOrder;

public interface StockTransferService {
    public abstract StockTransferOrder getStockTransferOrder(Long id) throws StockTransferException;
    public abstract List<StockTransferOrder> getStockTransferOrders();
    public abstract List<StockTransferOrder> getStockTransferOrderOfSite(Site site);
    public abstract List<StockTransferOrder> getStockTransferOrdersByStatus(String status);
    public abstract List<StockTransferOrder> getSTOBySiteStatus(Long siteId, String status) throws StockTransferException;

    public abstract StockTransferOrder createStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId) throws SiteConfirmationException, InvalidAttributesException;
    public abstract StockTransferOrder updateOrderDetails(StockTransferOrder stockTransferOrder, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract StockTransferOrder cancelStockTransferOrder(Long id, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract StockTransferOrder rejectStockTransferOrder(Long id, Long siteId) throws StockTransferException, SiteConfirmationException;
    public abstract StockTransferOrder confirmStockTransferOrder(Long id, Long siteId) throws SiteConfirmationException, StockTransferException;
    public abstract StockTransferOrder pickPackTransferOrder(Long id, Long siteId) throws StockTransferException, SiteConfirmationException;
    public abstract StockTransferOrder scanProductAtFromSite(Long id, String rfidsku, int qty) throws StockTransferException, ProductException;
    public abstract StockTransferOrder deliverStockTransferOrder(Long id) throws StockTransferException;
    public abstract StockTransferOrder deliverMultipleStockTransferOrder(Long id) throws StockTransferException;
    public abstract StockTransferOrder scanProductAtToSite(Long id, String rfidsku, int qty) throws StockTransferException, ProductException;
    public abstract StockTransferOrder completeStockTransferOrder(Long orderId) throws StockTransferException, SiteConfirmationException;
}
