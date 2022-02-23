package com.iora.erp.service;

import java.util.List;
import java.util.Map;

import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;

public interface SiteService {
    public abstract Site createSite(Site site, String siteType);
    public abstract Site getSite(Long id);
    public abstract List<Site> getAllSites();
    public abstract List<Site> searchAllSites(List<String> siteTypes, String country, String company);
    public abstract List<? extends Site> searchHeadquarters(String country, String company);
    public abstract List<? extends Site> searchManufacturing(String country, String company);
    public abstract List<? extends Site> searchOnlineStores(String country, String company);
    public abstract List<? extends Site> searchStores(String country, String company);
    public abstract List<? extends Site> searchWarehouses(String country, String company);
    public abstract Site updateSite(Site site);
    public abstract void deleteSite(Long id);

    public abstract Site getSiteFromStockLevel(Long stockLevelId);

    public abstract List<Site> searchStockLevels(List<String> storeTypes, String country, String company);
    public abstract StockLevel getStockLevelOfSite(Long siteId) throws NoStockLevelException;
    public abstract Map<Long,Long> getStockLevelByProduct(String SKUCode);
    public abstract void addProductItemToSite(Long siteId, String productItemId) throws NoStockLevelException;
    public abstract void removeProductItemFromSite(String productItemId) throws NoStockLevelException;
    public abstract void addStockLevelToSite(Long siteId, List<String> productItemIds) throws NoStockLevelException;
    public abstract void removeStockLevelFromSite(List<String> productItemIds) throws NoStockLevelException;

    public abstract void addToStockLevel(StockLevel stockLevel, ProductItem productItem) throws IllegalTransferException;
    public abstract void removeFromStockLevel(ProductItem productItem) throws IllegalTransferException;
    public abstract void addManyToStockLevel(StockLevel stockLevel, List<ProductItem> productItems) throws IllegalTransferException;
    public abstract void removeManyFromStockLevel(List<ProductItem> productItems) throws IllegalTransferException;
}
