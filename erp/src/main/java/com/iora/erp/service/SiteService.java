package com.iora.erp.service;

import java.util.List;

import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;

public interface SiteService {
    public abstract void createSite(Site site, String storeType);
    public abstract Site getSite(Long id);
    public abstract List<Site> searchAllSites(List<String> storeTypes, String country, String company);
    public abstract List<? extends Site> searchHeadquarters(String country, String company);
    public abstract List<? extends Site> searchManufacturing(String country, String company);
    public abstract List<? extends Site> searchOnlineStores(String country, String company);
    public abstract List<? extends Site> searchStores(String country, String company);
    public abstract List<? extends Site> searchWarehouses(String country, String company);
    public abstract void updateSite(Site site);
    public abstract void deleteSite(Long id);

    public abstract StockLevel getAllStockLevels(List<Site> sites);
    public abstract StockLevel getStockLevelOfSite(Long siteId) throws NoStockLevelException;
    public abstract StockLevel getStockLevelByProduct(String SKUCode);
    public abstract void addProductItemToSite(Long siteId, Long productItemId) throws NoStockLevelException;
    public abstract void removeProductItemFromSite(Long siteId, Long productItemId) throws NoStockLevelException;
    public abstract void addStockLevelToSite(Long siteId, List<Long> productItemIds) throws NoStockLevelException;
    public abstract void removeStockLevelFromSite(Long siteId, List<Long> productItemIds) throws NoStockLevelException;
}
