package com.iora.erp.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("siteServiceImpl")
@Transactional
public class SiteServiceImpl implements SiteService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public Site createSite(Site site, String siteType) {
        switch (siteType) {
            case "Headquarters":
                HeadquartersSite headquarters = new HeadquartersSite(site);
                em.persist(headquarters);
                return headquarters;

            case "Manufacturing":
                ManufacturingSite manufacturing = new ManufacturingSite(site);
                em.persist(manufacturing);
                return manufacturing;

            case "OnlineStore":
                OnlineStoreSite onlineStore = new OnlineStoreSite(site);
                em.persist(onlineStore);
                return onlineStore;

            case "Store":
                StoreSite store = new StoreSite(site);
                em.persist(store);
                return store;

            case "Warehouse":
                WarehouseSite warehouse = new WarehouseSite(site);
                em.persist(warehouse);
                return warehouse;

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
        return em.createQuery("SELECT s FROM Site s", Site.class).getResultList();
    }

    @Override
    public List<Site> searchAllSites(List<String> siteTypes, String country, String company) {
        List<Site> resultList = em.createQuery(siteQuery("SELECT s FROM Site s", country.toUpperCase(), company),
                Site.class)
                .getResultList();
        return resultList;
    };

    @Override
    public List<? extends Site> searchHeadquarters(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM HeadquartersSite s", country.toUpperCase(), company),
                        HeadquartersSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchManufacturing(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM ManufacturingSite s", country.toUpperCase(), company),
                        ManufacturingSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchOnlineStores(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM OnlineStoreSite s", country.toUpperCase(), company),
                        OnlineStoreSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchStores(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM StoreSite s", country.toUpperCase(), company),
                        StoreSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchWarehouses(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM WarehouseSite s", country.toUpperCase(), company),
                        WarehouseSite.class)
                .getResultList();
        return resultList;
    }

    String siteQuery(String mainQuery, String country, String company) {
        if (!country.equals("") && !company.equals("")) {
            return mainQuery + String.format(
                    " WHERE UPPER(s.address.country) = '%s' AND s.company.name = '%s Fashion Pte. Ltd.'", country,
                    company);
        } else if (!country.equals("")) {
            return mainQuery + String.format(" WHERE UPPER(s.address.country) = '%s'", country);
        } else if (!company.equals("")) {
            return mainQuery + String.format(" WHERE s.company.name = '%s Fashion Pte. Ltd.'", company);
        } else {
            return mainQuery;
        }
    }

    @Override
    public Site updateSite(Site site) {
        Site old = em.find(Site.class, site.getId());
        old.setName(site.getName());
        old.setAddress(site.getAddress());
        old.setSiteCode(site.getSiteCode());
        old.setActive(site.isActive());
        return old;
    }

    @Override
    public void deleteSite(Long id) {
        Site site = getSite(id);
        if (site.getStockLevel().getProductItems().size() == 0) {
            em.remove(site);
        } else {
            site.setActive(false);
        }
    }

    @Override
    public Site getSiteFromStockLevel(Long stockLevelId) {
        return em.createQuery("SELECT s from Site s WHERE s.stockLevel.id = :id", Site.class)
                .setParameter("id", stockLevelId).getSingleResult();
    };

    @Override
    public List<Site> searchStockLevels(List<String> storeTypes, String country, String company) {
        List<Site> resultList = em.createQuery(siteQuery("SELECT s FROM Site s", country.toUpperCase(), company),
                Site.class)
                .getResultList();
        for (Site s : resultList) {
            s.getStockLevel();
        }
        return resultList;
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
    public void addProductItemToSite(Long siteId, String productItemId) throws NoStockLevelException {
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
    public void removeProductItemFromSite(Long siteId, String productItemId) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        ProductItem item = em.find(ProductItem.class, productItemId);
        try {
            removeFromStockLevel(stockLevel, item);
        } catch (IllegalTransferException ex) {
            System.err.println(ex.getMessage());
        }
    }

    @Override
    public void addStockLevelToSite(Long siteId, List<String> productItemIds) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        for (String productItemId : productItemIds) {
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
    public void removeStockLevelFromSite(Long siteId, List<String> productItemIds) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        for (String productItemId : productItemIds) {
            try {
                ProductItem item = em.find(ProductItem.class, productItemId);
                removeFromStockLevel(stockLevel, item);
            } catch (IllegalTransferException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    @Override
    public Map<Long, Long> getStockLevelByProduct(String SKUCode) {
        List<Site> resultList = em
                .createQuery("SELECT s FROM Site s", Site.class)
                .getResultList();
        Map<Long, Long> resultMap = new HashMap<Long, Long>();
        for (Site s : resultList) {
            Long siteId = s.getId();
            StockLevel stockLevel = s.getStockLevel();
            resultMap.put(siteId, stockLevel.getProducts().getOrDefault(SKUCode, 0L));
        }
        return resultMap;
    }

    @Override
    public void addToStockLevel(StockLevel stockLevel, ProductItem productItem) throws IllegalTransferException {
        if (stockLevel.getProductItems().contains(productItem)) {
            throw new IllegalTransferException("Product Item already added");
        }
        productItem.setStockLevel(stockLevel);
        String SKUCode = productItem.getProductSKU();
        String modelCode = SKUCode.split("-")[0];
        stockLevel.getProductItems().add(productItem);
        stockLevel.getProducts().merge(SKUCode, 1L, (x, y) -> x + y);
        stockLevel.getModels().merge(modelCode, 1L, (x, y) -> x + y);
    }

    @Override
    public void removeFromStockLevel(StockLevel stockLevel, ProductItem productItem) throws IllegalTransferException {
        if (!stockLevel.getProductItems().contains(productItem)) {
            throw new IllegalTransferException("Product Item already removed");
        }
        String SKUCode = productItem.getProductSKU();
        String modelCode = SKUCode.split("-")[0];
        stockLevel.getProducts().merge(SKUCode, -1L, (x, y) -> x + y);
        stockLevel.getModels().merge(modelCode, -1L, (x, y) -> x + y);
        productItem.setStockLevel(null);
    }

}
