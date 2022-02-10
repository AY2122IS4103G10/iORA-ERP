package com.iora.erp.service;

import java.util.List;

import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;

public interface SiteService {
    public abstract void createSite(Site site, String storeType);
    public abstract Site getSite(Long id);
    public abstract List<Site> getAllSites();
    public abstract void updateSite(Site site);
    public abstract void deleteSite(Long id);

    public abstract StockLevel getAllStockLevels();
    public abstract StockLevel getStockLevelOfSite(Long siteId);
    public abstract void addStockLevelToSite(Long siteId, StockLevel stockLevel);
    public abstract void removeStockLevelFromSite(Long siteId, StockLevel stockLevel);
    public abstract void moveStockLevel(Long fromSiteId, Long toSiteId, StockLevel stockLevel);
    public abstract void addProductItemToSite(Long siteId, ProductItem productItem);
    public abstract void removeProductItemFromSite(Long siteId, Long productItemId);
    public abstract void moveProductItem(Long fromSiteId, Long toSiteId, ProductItem productItem);
}
