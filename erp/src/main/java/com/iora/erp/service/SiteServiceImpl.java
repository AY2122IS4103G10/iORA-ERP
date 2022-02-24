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
        List<Site> resultList = em.createQuery(siteQuery("SELECT s FROM Site s", country, company),
                Site.class)
                .getResultList();
        return resultList;
    };

    @Override
    public List<? extends Site> searchHeadquarters(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM HeadquartersSite s", country, company),
                        HeadquartersSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchManufacturing(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM ManufacturingSite s", country, company),
                        ManufacturingSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchOnlineStores(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM OnlineStoreSite s", country, company),
                        OnlineStoreSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchStores(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM StoreSite s", country, company),
                        StoreSite.class)
                .getResultList();
        return resultList;
    }

    @Override
    public List<? extends Site> searchWarehouses(String country, String company) {
        List<? extends Site> resultList = em
                .createQuery(siteQuery("SELECT s FROM WarehouseSite s", country, company),
                        WarehouseSite.class)
                .getResultList();
        return resultList;
    }

    String siteQuery(String mainQuery, String country, String company) {
        if (!country.equals("") && !company.equals("")) {
            return mainQuery + String.format(
                    " WHERE UPPER(s.address.country) = '%s' AND s.company.name = '%s Fashion Pte. Ltd.'", country.toUpperCase(),
                    company);
        } else if (!country.equals("")) {
            return mainQuery + String.format(" WHERE UPPER(s.address.country) = '%s'", country.toUpperCase());
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
        return site.getStockLevel();
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
    public void addProductItemToSite(Long siteId, String productItemId) throws NoStockLevelException {
        StockLevel stockLevel = getStockLevelOfSite(siteId);
        ProductItem item = em.find(ProductItem.class, productItemId);
        try {
            if (item.getStockLevel() != null) {
                removeFromStockLevel(item);
            }
            addToStockLevel(stockLevel, item);
        } catch (IllegalTransferException ex) {
            System.err.println(ex.getMessage());
        }
    }

    @Override
    public void removeProductItemFromSite(String productItemId) throws NoStockLevelException {
        ProductItem item = em.find(ProductItem.class, productItemId);
        try {
            removeFromStockLevel(item);
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
                if (item.getStockLevel() != null) {
                    removeFromStockLevel(item);
                }
                addToStockLevel(stockLevel, item);
            } catch (IllegalTransferException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    @Override
    public void removeStockLevelFromSite(List<String> productItemIds) throws NoStockLevelException {
        for (String productItemId : productItemIds) {
            try {
                ProductItem item = em.find(ProductItem.class, productItemId);
                removeFromStockLevel(item);
            } catch (IllegalTransferException ex) {
                System.err.println(ex.getMessage());
            }
        }
    }

    @Override
    public void addToStockLevel(StockLevel stockLevel, ProductItem productItem) throws IllegalTransferException {
        stockLevel = em.find(StockLevel.class, stockLevel.getId());
        if (stockLevel.getProductItems().contains(productItem)) {
            throw new IllegalTransferException("Product Item already added");
        }
        productItem.setStockLevel(stockLevel);
        String SKUCode = productItem.getProductSKU();
        String modelCode = SKUCode.split("-")[0];
        stockLevel.getProductItems().add(productItem);
        stockLevel.getProducts().put(SKUCode, stockLevel.getProducts().get(SKUCode) != null ? stockLevel.getProducts().get(SKUCode) + 1 : 1);
        stockLevel.getModels().put(modelCode, stockLevel.getModels().get(modelCode) != null ? stockLevel.getModels().get(modelCode) + 1 : 1);
        em.merge(stockLevel);
        em.merge(productItem);
    }

    @Override
    public void removeFromStockLevel(ProductItem productItem) throws IllegalTransferException {
        if (productItem.getStockLevel() == null) {
            throw new IllegalTransferException("Product Item already detached");
        }
        StockLevel stockLevel = productItem.getStockLevel();
        String SKUCode = productItem.getProductSKU();
        String modelCode = SKUCode.split("-")[0];
        stockLevel.getProducts().merge(SKUCode, -1L, (x, y) -> x + y);
        stockLevel.getModels().merge(modelCode, -1L, (x, y) -> x + y);
        productItem.setStockLevel(null);
        em.merge(stockLevel);
        em.merge(productItem);
    }

    @Override
    public void addManyToStockLevel(StockLevel stockLevel, List<ProductItem> productItems)
            throws IllegalTransferException {
        int fail = 0;
        for (int i = 0; i < productItems.size(); i++) {
            ProductItem productItem = em.find(ProductItem.class, productItems.get(i).getRfid());
            if (stockLevel.getProductItems().contains(productItem)) {
                fail++;
                System.err.println("Error adding: " + productItem.getRfid());
            }
            productItem.setStockLevel(stockLevel);
            String SKUCode = productItem.getProductSKU();
            String modelCode = SKUCode.split("-")[0];
            stockLevel.getProductItems().add(productItem);
            stockLevel.getProducts().merge(SKUCode, 1L, (x, y) -> x + y);
            stockLevel.getModels().merge(modelCode, 1L, (x, y) -> x + y);
        }
        if (fail > 0) {
            throw new IllegalTransferException(String.format("%d transfer(s) failed.", fail));
        }
    }

    @Override
    public void removeManyFromStockLevel(List<ProductItem> productItems) throws IllegalTransferException {
        int fail = 0;
        for (int i = 0; i < productItems.size(); i++) {
            ProductItem productItem = em.find(ProductItem.class, productItems.get(i).getRfid());
            if (productItem.getStockLevel() == null) {
                throw new IllegalTransferException("Product Item already detached");
            }
            StockLevel stockLevel = productItem.getStockLevel();
            String SKUCode = productItem.getProductSKU();
            String modelCode = SKUCode.split("-")[0];
            stockLevel.getProducts().merge(SKUCode, -1L, (x, y) -> x + y);
            stockLevel.getModels().merge(modelCode, -1L, (x, y) -> x + y);
            productItem.setStockLevel(null);
        }
        if (fail > 0) {
            throw new IllegalTransferException(String.format("%d transfer(s) failed.", fail));
        }
    }

}
