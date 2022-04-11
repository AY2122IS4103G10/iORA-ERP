package com.iora.erp.service;

import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.NoResultException;
import javax.persistence.NonUniqueResultException;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.CountryEnum;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevel;
import com.iora.erp.model.site.StockLevelLI;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("siteServiceImpl")
@Transactional
public class SiteServiceImpl implements SiteService {

    @PersistenceContext
    private EntityManager em;
    @Autowired
    private ProductService productService;

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
                if (siteNameAvail(site.getName())) {
                    em.persist(store);
                    return store;
                } else {
                    throw new IllegalArgumentException("Site name has already been used");
                }

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
    public Boolean siteNameAvail(String name) {
        Query q = em.createQuery("SELECT s from Site s WHERE s.name =:name");
        q.setParameter("name", name);

        try {
            q.getSingleResult();
        } catch (NoResultException | NonUniqueResultException ex) {
            return true;
        }
        return false;
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
        TypedQuery<StoreSite> query = em
                .createQuery(siteQuery("SELECT s FROM StoreSite s", country, company),
                        StoreSite.class);

        if (!country.equals("")) {
            query.setParameter("country", CountryEnum.Singapore);
        }
        return query.getResultList();
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
            return mainQuery + " WHERE s.address.country = :country";
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
            StockLevelLI lineItem = new StockLevelLI(product, stockLevel, 0);
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
            Site site = em.find(Site.class, siteId);
            if (site == null) {
                throw new Exception("Site cannot be found");
            }

            StockLevelLI lineItem = getStockLevelLI(siteId, SKUCode);
            if (lineItem.getQty() < qty) {
                throw new IllegalTransferException("Quantity to remove more than expected.");
            }

            lineItem.setQty(lineItem.getQty() - qty);
            Product product = productService.getProduct(SKUCode);
            if (lineItem.getQty() < product.getBaselineQty()) {
                site.addNotification(new Notification("Low Quantity!",
                        "The quantity of product " + product.getSku()
                                + " is below the baseline! Click here to request for stocks."));
            }

            return site.getStockLevel();
        } catch (ProductException ex) {
            throw new IllegalTransferException(ex.getMessage());
        } catch (Exception ex) {
            throw new NoStockLevelException(ex.getMessage());
        }
    }

    @Override
    public String editStockLevel(Long siteId, String SKUCode, int qty)
            throws NoStockLevelException, IllegalTransferException {
        StockLevelLI product = getStockLevelLI(siteId, SKUCode);

        if (product.getQty() < qty) {
            int difference = qty - product.getQty();
            addProducts(siteId, SKUCode, difference);
            return difference + " quantity of " + SKUCode + " has been added successfully.";
        } else if (product.getQty() > qty) {
            int difference = product.getQty() - qty;
            removeProducts(siteId, SKUCode, difference);
            return difference + " quantity of " + SKUCode + " has been removed successfully.";
        } else {
            return "Stock level is accurate and no changes are made.";
        }
    }

    @Override
    public List<Notification> getNotifications(Long siteId) {
        Site site = em.find(Site.class, siteId);

        if (site != null) {
            return site.getNotifications();
        }
        return null;
    }

    @Override
    public List<Notification> updateNotifications(List<Notification> notifications, Long siteId) {
        Site old = em.find(Site.class, siteId);
        if (old != null) {
            old.setNotifications(notifications);
            return old.getNotifications();
        }
        return null;
    }
}