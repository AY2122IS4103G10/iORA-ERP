package com.iora.erp.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.OnlineStoreSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;

public class SiteServiceImpl implements SiteService {

    @PersistenceContext private EntityManager em;

    @Override
    public void createSite(Site site, String storeType) {
        switch (storeType) {
            case "Headquarters":
                HeadquartersSite headquarters = new HeadquartersSite(site);
                em.persist(headquarters);
                break;

            case "Manufacturing":
                ManufacturingSite manufacturing = new ManufacturingSite(site);
                em.persist(manufacturing);
                break;

            case "OnlineStore":
                OnlineStoreSite onlineStore = new OnlineStoreSite(site);
                em.persist(onlineStore);
                break;
            
            case "Store":
                StoreSite store = new StoreSite(site);
                em.persist(store);
                break;

            case "Warehouse":
                WarehouseSite warehouse = new WarehouseSite(site);
                em.persist(warehouse);
                break;

            default:
                throw new IllegalArgumentException("Site arguments are invalid");
        }
        
    }

    @Override
    public Site getSite(Long id) {
        return em.find(Site.class, id);
    }

    @Override
    public List<Site> getAllSites() {
        List<Site> resultList = em.createQuery("SELECT s FROM Site s", Site.class).getResultList();
        return resultList;
    }

    @Override
    public void updateSite(Site site) {
        Site old = em.find(Site.class, site.getId());
        old.setName(site.getName());
        old.setCountry(site.getCountry());
        old.setAddress(site.getAddress());
        old.setLatitude(site.getLatitude());
        old.setLongitude(site.getLongitude());
        old.setSiteCode(site.getSiteCode());
        old.setActive(site.isActive());
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

    @Override
    public StockLevel getStockLevelByProduct(String SKUCode) {
        // TODO Auto-generated method stub
        return null;
    }
    
}
