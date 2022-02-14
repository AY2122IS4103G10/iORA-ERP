package com.iora.erp.service;

import java.util.List;

import com.iora.erp.enumeration.Country;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;

public interface SiteService {
    public abstract void createSite(Site site, String storeType);
    public abstract Site getSite(Long id);
    public abstract List<Site> getAllSites();
    public abstract List<Site> getSitesByCountry(Country country);
    public abstract List<? extends Site> getAllHeadquarters();
    public abstract List<? extends Site> getHeadquartersByCountry(Country country);
    public abstract List<? extends Site> getAllManufacturing();
    public abstract List<? extends Site> getManufacturingByCountry(Country country);
    public abstract List<? extends Site> getAllStores();
    public abstract List<? extends Site> getStoresByCountry(Country country);
    public abstract List<? extends Site> getAllOnlineStores();
    public abstract List<? extends Site> getOnlineStoresByCountry(Country country);
    public abstract List<? extends Site> getAllWarehouses();
    public abstract List<? extends Site> getWarehousesByCountry(Country country);
    // getSitesByCompany(Company company);
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
