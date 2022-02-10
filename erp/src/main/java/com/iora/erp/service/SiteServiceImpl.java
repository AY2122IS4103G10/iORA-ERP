package com.iora.erp.service;

import java.util.List;

import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;

public class SiteServiceImpl implements SiteService {

    @Override
    public void createSite(Site site, String storeType) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public Site getSite(Long id) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Site> getAllSites() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void updateSite(Site site) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void deleteSite(Long id) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public StockLevel getAllStockLevels() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public StockLevel getStockLevelOfSite(Long siteId) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public void addStockLevelToSite(Long siteId, StockLevel stockLevel) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void removeStockLevelFromSite(Long siteId, StockLevel stockLevel) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void moveStockLevel(Long fromSiteId, Long toSiteId, StockLevel stockLevel) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void addProductItemToSite(Long siteId, ProductItem productItem) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void removeProductItemFromSite(Long siteId, Long productItemId) {
        // TODO Auto-generated method stub
        
    }

    @Override
    public void moveProductItem(Long fromSiteId, Long toSiteId, ProductItem productItem) {
        // TODO Auto-generated method stub
        
    }
    
}
