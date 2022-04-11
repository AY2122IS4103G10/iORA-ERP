package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StockLevelLI;
import com.iora.erp.model.site.StoreSite;

public interface SiteService {
    public abstract Site createSite(Site site, String siteType);
    public abstract Site getSite(Long id);
    public abstract List<Site> getAllSites();
    public abstract List<Site> searchAllSites(List<String> siteTypes, String country, String company);
    public abstract List<? extends Site> searchHeadquarters(String country, String company);
    public abstract List<? extends Site> searchManufacturing(String country, String company);
    public abstract List<? extends Site> searchStores(String country, String company);
    public abstract List<? extends Site> searchWarehouses(String country, String company);
    public abstract Site updateSite(Site site);
    public abstract void deleteSite(Long id);
    public abstract Boolean siteNameAvail(String name);

    public abstract StoreSite storeLogin(Long id, String password);

    public abstract Site getSiteFromStockLevel(Long stockLevelId);
    public abstract List<Site> searchStockLevels(List<String> storeTypes, String country, String company);
    public abstract List<StockLevelLI> getStockLevelOfSite(Long siteId) throws NoStockLevelException;
    public abstract List<StockLevelLI> getStockLevelByProduct(String SKUCode);
    public abstract StockLevelLI getStockLevelLI(Long siteId, String SKUCode);

    public abstract StockLevel addProducts(Long siteId, String SKUCode, int qty) throws NoStockLevelException;
    public abstract StockLevel removeProducts(Long siteId, String SKUCode, int qty)
            throws NoStockLevelException, IllegalTransferException;
    public abstract String editStockLevel(Long siteId, String SKUCode, int qty)
            throws NoStockLevelException, IllegalTransferException;
    public abstract List<Notification> getNotifications(Long siteId);
    public abstract List<Notification> updateNotifications(List<Notification> notifications, Long siteId);
}
