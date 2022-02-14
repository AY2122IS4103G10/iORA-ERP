package com.iora.erp.service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Stream;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

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

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("siteServiceImpl")
@Transactional
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
        List<Site> sites = new ArrayList<>();
        Stream.of(getAllHeadquarters(), getAllManufacturing(), getAllStores(), getAllOnlineStores(), getAllWarehouses())
                .forEach(sites::addAll);
        return sites;
    }

    public List<Site> getSitesByCountry(Country country) {
        List<Site> sites = new ArrayList<>();
        Stream.of(getHeadquartersByCountry(country), getManufacturingByCountry(country), getStoresByCountry(country),
                getOnlineStoresByCountry(country), getWarehousesByCountry(country))
                .forEach(sites::addAll);
        return sites;
    }

    public List<? extends Site> getAllHeadquarters() {
        List<? extends Site> resultList = em.createQuery("SELECT s FROM HeadquartersSite s", HeadquartersSite.class)
                .getResultList();
        return resultList;
    }

    public List<? extends Site> getHeadquartersByCountry(Country country) {
        List<? extends Site> resultList = em
                .createQuery("SELECT s FROM HeadquartersSite s WHERE s.country = :country", HeadquartersSite.class)
                .setParameter("country", country.name()).getResultList();
        return resultList;
    }

    public List<? extends Site> getAllManufacturing() {
        List<? extends Site> resultList = em.createQuery("SELECT s FROM ManufacturingSite s", ManufacturingSite.class)
                .getResultList();
        return resultList;
    }

    public List<? extends Site> getManufacturingByCountry(Country country) {
        List<? extends Site> resultList = em
                .createQuery("SELECT s FROM ManufacturingSite s WHERE s.country = :country", ManufacturingSite.class)
                .setParameter("country", country.name()).getResultList();
        return resultList;
    }

    public List<? extends Site> getAllStores() {
        List<? extends Site> resultList = em.createQuery("SELECT s FROM StoreSite s", StoreSite.class).getResultList();
        return resultList;
    }

    public List<? extends Site> getStoresByCountry(Country country) {
        List<? extends Site> resultList = em
                .createQuery("SELECT s FROM StoreSite s WHERE s.country = :country", StoreSite.class)
                .setParameter("country", country.name()).getResultList();
        return resultList;
    }

    public List<? extends Site> getAllOnlineStores() {
        List<? extends Site> resultList = em.createQuery("SELECT s FROM OnlineStoreSite s", OnlineStoreSite.class)
                .getResultList();
        return resultList;
    }

    public List<? extends Site> getOnlineStoresByCountry(Country country) {
        List<? extends Site> resultList = em
                .createQuery("SELECT s FROM OnlineStoreSite s WHERE s.country = :country", OnlineStoreSite.class)
                .setParameter("country", country.name()).getResultList();
        return resultList;
    }

    public List<? extends Site> getAllWarehouses() {
        List<? extends Site> resultList = em.createQuery("SELECT s FROM WarehouseSite s", WarehouseSite.class)
                .getResultList();
        return resultList;
    }

    public List<? extends Site> getWarehousesByCountry(Country country) {
        List<? extends Site> resultList = em
                .createQuery("SELECT s FROM WarehouseSite s WHERE s.country = :country", WarehouseSite.class)
                .setParameter("country", country.name()).getResultList();
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
        Site site = getSite(id);
        if (site.getStockLevel().getProductItems().size() == 0) {
            em.remove(site);
        } else {
            site.setActive(false);
        }
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
