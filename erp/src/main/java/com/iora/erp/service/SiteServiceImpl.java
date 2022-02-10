package com.iora.erp.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;

import com.iora.erp.enumeration.Country;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.OnlineStoreSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;

public class SiteServiceImpl implements SiteService {

    @PersistenceContext
    private EntityManager em;

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

    public List<Site> getSitesByCountry(Country country) {
        List<Site> resultList = em.createQuery("SELECT s FROM Site s WHERE s.country = :country", Site.class)
                .setParameter("country", country.name()).getResultList();
        return resultList;
    };

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
    public StockLevel getAllStockLevels(List<Site> sites) {
        List<ProductItem> temp = new ArrayList<>();
        for (Site s : sites) {
            temp.addAll(s.getStockLevel().getProductItems());
        }
        return new StockLevel(temp);
    }

    @Override
    public StockLevel getStockLevelOfSite(Long siteId) throws NoStockLevelException {
        Site site = em.find(Site.class, siteId);
        if (site instanceof ManufacturingSite) {
            throw new NoStockLevelException("Manufacturing site has no stock levels");
        }
        return site.getStockLevel();
    }

    @Override
    public void addProductItemToSite(Long siteId, Long productItemId) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        ProductItem item = em.find(ProductItem.class, productItemId);
        try {
            removeFromStockLevel(stockLevel, item);
            addToStockLevel(stockLevel, item);
        } catch (IllegalTransferException ex) {
            System.err.println(ex.getMessage());
        }
    }

    @Override
    public void removeProductItemFromSite(Long siteId, Long productItemId) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        ProductItem item = em.find(ProductItem.class, productItemId);
        try {
            removeFromStockLevel(stockLevel, item);
        } catch (IllegalTransferException ex) {
            System.err.println(ex.getMessage());
        }
    }

    @Override
    public void addStockLevelToSite(Long siteId, List<Long> productItemIds) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        for (Long productItemId : productItemIds) {
            try {
                ProductItem item = em.find(ProductItem.class, productItemId);
                removeFromStockLevel(stockLevel, item);
                addToStockLevel(stockLevel, item);
            } catch (IllegalTransferException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    @Override
    public void removeStockLevelFromSite(Long siteId, List<Long> productItemIds) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        for (Long productItemId : productItemIds) {
            try {
                ProductItem item = em.find(ProductItem.class, productItemId);
                removeFromStockLevel(stockLevel, item);
            } catch (IllegalTransferException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    @Override
    public StockLevel getStockLevelByProduct(String SKUCode) {
        // TODO Auto-generated method stub
        return null;
    }

    // Helper methods
    private void addToStockLevel(StockLevel stockLevel, ProductItem productItem) throws IllegalTransferException {
        if (stockLevel.getProductItems().contains(productItem)) {
            throw new IllegalTransferException("Product Item already added");
        }
        productItem.setStockLevel(stockLevel);
        String SKUCode = productItem.getProduct().getsku();
        String modelCode = SKUCode.split("-")[0];
        stockLevel.getProductItems().add(productItem);
        stockLevel.getProducts().merge(SKUCode, 1L, (x, y) -> x + y);
        stockLevel.getModels().merge(modelCode, 1L, (x, y) -> x + y);
    }

    private void removeFromStockLevel(StockLevel stockLevel, ProductItem productItem) throws IllegalTransferException {
        if (!stockLevel.getProductItems().contains(productItem)) {
            throw new IllegalTransferException("Product Item already removed");
        }
        String SKUCode = productItem.getProduct().getsku();
        String modelCode = SKUCode.split("-")[0];
        stockLevel.getProducts().merge(SKUCode, -1L, (x, y) -> x + y);
        stockLevel.getModels().merge(modelCode, -1L, (x, y) -> x + y);
        productItem.setStockLevel(null);
    }

}
