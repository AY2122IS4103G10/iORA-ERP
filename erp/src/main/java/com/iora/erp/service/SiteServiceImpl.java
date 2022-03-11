package com.iora.erp.service;

import java.util.List;
import java.util.Map;
import java.util.function.Function;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.PersistenceContext;

import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StockLevelLI;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;

import org.springframework.data.util.Pair;
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
                    " WHERE UPPER(s.address.country) = '%s' AND s.company.name = '%s Fashion Pte. Ltd.'",
                    country.toUpperCase(),
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
        if (site.getStockLevel().getProducts().size() == 0) {
            em.remove(site);
        } else {
            site.setActive(false);
        }
    }

    @Override
    public StoreSite storeLogin(Long id, String siteCode) {
        StoreSite store = em
                .createQuery("SELECT s FROM StoreSite s WHERE s.id = :id AND s.siteCode = :siteCode", StoreSite.class)
                .setParameter("id", id).setParameter("siteCode", siteCode).getSingleResult();
        return store;
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
    public List<StockLevelLI> getStockLevelOfSite(Long siteId) throws NoStockLevelException {
        Site site = em.find(Site.class, siteId);
        return site.getStockLevel().getProducts();
    }

    @Override
    public List<StockLevelLI> getStockLevelByProduct(String SKUCode) {
        return em.createQuery("SELECT sl FROM StockLevelLI sl WHERE sl.product.sku = :sku", StockLevelLI.class)
                .setParameter("sku", SKUCode)
                .getResultList();
    }

    @Override
    public StockLevelLI getStockLevelLI(Long siteId, String SKUCode) {
        StockLevel stockLevel = em.find(Site.class, siteId).getStockLevel();
        try {
            StockLevelLI lineItem = em.createQuery(
                    "SELECT sl FROM StockLevelLI sl WHERE sl.product.sku = :sku AND sl.stockLevel.id = :id",
                    StockLevelLI.class)
                    .setParameter("sku", SKUCode)
                    .setParameter("id", stockLevel.getId())
                    .getSingleResult();
            return lineItem;
        } catch (NoResultException ex) {
            Product product = em.find(Product.class, SKUCode);
            StockLevelLI lineItem = new StockLevelLI(product, stockLevel, 0, 0);
            em.persist(lineItem);
            return lineItem;
        }
    }

    @Override
    public StockLevel addProducts(Long siteId, String SKUCode, int qty) throws NoStockLevelException {
        try {
            StockLevelLI lineItem = getStockLevelLI(siteId, SKUCode);
            lineItem.setQty(lineItem.getQty() + qty);
            return em.find(Site.class, siteId).getStockLevel();
        } catch (Exception ex) {
            throw new NoStockLevelException("Products cannot be added to stock level.");
        }

    }

    @Override
    public StockLevel removeProducts(Long siteId, String SKUCode, int qty)
            throws NoStockLevelException, IllegalTransferException {
        try {
            StockLevelLI lineItem = getStockLevelLI(siteId, SKUCode);
            if (lineItem.getQty() < qty) {
                throw new IllegalTransferException("Quantity to remove more than expected.");
            }
            lineItem.setQty(lineItem.getQty() - qty);
            return em.find(Site.class, siteId).getStockLevel();
        } catch (IllegalTransferException ex1) {
            throw new IllegalTransferException(ex1.getMessage());
        } catch (Exception ex2) {
            throw new NoStockLevelException("Products cannot be removed from stock level.");
        }
    }

    @Override
    public Pair<StockLevel, StockLevel> moveProducts(Long fromSiteId, Long toSiteId, String SKUCode, int qty)
            throws NoStockLevelException, IllegalTransferException {
        StockLevel sl1 = removeProducts(fromSiteId, SKUCode, qty);
        StockLevel sl2 = addProducts(toSiteId, SKUCode, qty);
        return Pair.of(sl1, sl2);
    }

    @Override
    public StockLevel addProductsWithRfid(Long siteId, List<String> rfidskus) throws NoStockLevelException {
        Map<String, Long> counter = rfidskus.stream().parallel().map(new Function<String, Product>() {
            public Product apply(String rfidsku) {
                Product product = em.find(Product.class, rfidsku);
                if (product != null) {
                    return product;
                }
                ProductItem productItem = em.find(ProductItem.class, rfidsku);
                if (productItem == null) {
                    return null;
                } else {
                    return productItem.getProduct();
                }
            }
        }).filter(x -> x != null).collect(Collectors.groupingBy(x -> x.getSku(),
                Collectors.counting()));

        for (Map.Entry<String, Long> entry : counter.entrySet()) {
            addProducts(siteId, entry.getKey(), entry.getValue().intValue());
        }
        return em.find(Site.class, siteId).getStockLevel();
    }

    @Override
    public StockLevel removeProductsWithRfid(Long siteId, List<String> rfidskus)
            throws NoStockLevelException, IllegalTransferException {
        Map<String, Long> counter = rfidskus.stream().parallel().map(new Function<String, Product>() {
            public Product apply(String rfidsku) {
                Product product = em.find(Product.class, rfidsku);
                if (product != null) {
                    return product;
                }
                ProductItem productItem = em.find(ProductItem.class, rfidsku);
                if (productItem == null) {
                    return null;
                } else {
                    return productItem.getProduct();
                }
            }
        }).filter(x -> x != null).collect(Collectors.groupingBy(x -> x.getSku(),
                Collectors.counting()));

        for (Map.Entry<String, Long> entry : counter.entrySet()) {
            removeProducts(siteId, entry.getKey(), entry.getValue().intValue());
        }
        return em.find(Site.class, siteId).getStockLevel();
    }

    @Override
    public Pair<StockLevel, StockLevel> moveProductsWithRfid(Long fromSiteId,
            Long toSiteId,
            List<String> rfidskus)
            throws NoStockLevelException, IllegalTransferException {
        Map<String, Long> counter = rfidskus.stream().parallel().map(new Function<String, Product>() {
            public Product apply(String rfidsku) {
                Product product = em.find(Product.class, rfidsku);
                if (product != null) {
                    return product;
                }
                ProductItem productItem = em.find(ProductItem.class, rfidsku);
                if (productItem == null) {
                    return null;
                } else {
                    return productItem.getProduct();
                }
            }
        }).filter(x -> x != null).collect(Collectors.groupingBy(x -> x.getSku(),
                Collectors.counting()));

        for (Map.Entry<String, Long> entry : counter.entrySet()) {
            moveProducts(fromSiteId, toSiteId, entry.getKey(), entry.getValue().intValue());
        }
        return Pair.of(em.find(Site.class, fromSiteId).getStockLevel(),
                em.find(Site.class, toSiteId).getStockLevel());
    }

}
