package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.naming.directory.InvalidAttributesException;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.StockTransferStatusEnum;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.stockTransfer.STOStatus;
import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.model.stockTransfer.StockTransferOrderLI;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("stockTransferServiceImpl")
@Transactional
public class StockTransferServiceImpl implements StockTransferService {

    @Autowired
    private ProductService productService;
    @Autowired
    private SiteService siteService;
    @PersistenceContext
    private EntityManager em;

    @Override
    public StockTransferOrder getStockTransferOrder(Long id) throws StockTransferException {
        StockTransferOrder sto = em.find(StockTransferOrder.class, id);

        if (sto == null) {
            throw new StockTransferException("Stock Transfer Order with id " + id + " cannot be found.");
        } else {
            return sto;
        }
    }

    @Override
    public List<StockTransferOrder> getStockTransferOrders() {
        TypedQuery<StockTransferOrder> q = em.createQuery("SELECT sto FROM StockTransferOrder sto",
                StockTransferOrder.class);
        return q.getResultList();
    }

    @Override
    public List<StockTransferOrder> getStockTransferOrderOfSite(Site site) {
        TypedQuery<StockTransferOrder> q = em.createQuery(
                "SELECT sto FROM StockTransferOrder sto WHERE sto.fromSite = :site OR sto.toSite = :site",
                StockTransferOrder.class);
        q.setParameter("site", site);
        return q.getResultList();
    }

    @Override
    public List<StockTransferOrder> getStockTransferOrdersByStatus(String status) {
        List<StockTransferOrder> stOrders = new ArrayList<>();

        for (StockTransferOrder sto : getStockTransferOrders()) {
            if (sto.getLastStatus() == StockTransferStatusEnum.valueOf(status.toUpperCase())) {
                stOrders.add(sto);
            }
        }
        return stOrders;
    }

    @Override
    public List<StockTransferOrder> getSTOBySiteStatus(Long siteId, String status) throws StockTransferException {
        Site site = em.find(Site.class, siteId);
        if (site == null) {
            throw new StockTransferException("Site cannot be found.");
        }

        List<StockTransferOrder> deliveryOrders = new ArrayList<>();

        for (StockTransferOrder sto : getStockTransferOrderOfSite(site)) {
            if (sto.getLastStatus() == StockTransferStatusEnum.valueOf(status.toUpperCase())) {
                deliveryOrders.add(sto);
            }
        }
        return deliveryOrders;
    }

    private StockTransferOrder updateStockTransferOrder(StockTransferOrder stockTransferOrder) {
        Notification noti = new Notification("Stock Transfer Order # " + stockTransferOrder.getId(),
                "Status has been updated to " + stockTransferOrder.getLastStatus().name() + ": "
                        + stockTransferOrder.getLastStatus().getDescription());

        // If HQ is creator, need to include HQ in the loop too
        Site firstActor = stockTransferOrder.getStatusHistory().get(0).getActionBy();
        if (!firstActor.equals(stockTransferOrder.getFromSite())
                && !firstActor.equals(stockTransferOrder.getToSite())) {
            firstActor.addNotification(noti);
        }

        stockTransferOrder.getFromSite().addNotification(noti);
        stockTransferOrder.getToSite().addNotification(noti);
        return em.merge(stockTransferOrder);
    }

    @Override
    public StockTransferOrder createStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException, InvalidAttributesException {
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else if (actionBy.equals(stockTransferOrder.getFromSite())) {
            stockTransferOrder
                    .addStatusHistory(new STOStatus(actionBy, new Date(), StockTransferStatusEnum.ACCEPTED));
        } else {
            stockTransferOrder
                    .addStatusHistory(new STOStatus(actionBy, new Date(), StockTransferStatusEnum.PENDING));
        }

        em.persist(stockTransferOrder);

        Notification noti = new Notification("Stock Transfer Order (NEW) # " + stockTransferOrder.getId(),
                "Status is " + stockTransferOrder.getLastStatus().name() + ": "
                        + stockTransferOrder.getLastStatus().getDescription());

        stockTransferOrder.getFromSite().addNotification(noti);
        stockTransferOrder.getToSite().addNotification(noti);
        if (!actionBy.equals(stockTransferOrder.getFromSite()) && !actionBy.equals(stockTransferOrder.getToSite())) {
            actionBy.addNotification(noti);
        }

        em.merge(actionBy);

        return stockTransferOrder;
    }

    @Override
    public StockTransferOrder updateOrderDetails(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || !actionBy.equals(stockTransferOrder.getLastActor())) {
            throw new SiteConfirmationException(
                    "Site is not the creator of this order and is not permitted to update it.");
        } else if (stockTransferOrder.getLastStatus() != StockTransferStatusEnum.PENDING) {
            throw new StockTransferException(
                    "Stock Transfer Order has been accepted and cannot be amended.");
        } else {
            stockTransferOrder
                    .addStatusHistory(new STOStatus(actionBy, new Date(), StockTransferStatusEnum.PENDING));
            return updateStockTransferOrder(stockTransferOrder);
        }
    }

    @Override
    public StockTransferOrder cancelStockTransferOrder(Long id, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else if (stOrder.getLastStatus() != StockTransferStatusEnum.PENDING
                && stOrder.getLastStatus() != StockTransferStatusEnum.ACCEPTED) {
            throw new StockTransferException(
                    "Stock Transfer Order has been accepted and cannot be deleted.");
        } else if (!actionBy.equals(stOrder.getLastActor())) {
            throw new SiteConfirmationException(
                    "Site is not the creator of this order and is not permitted to update it.");
        }

        stOrder.addStatusHistory(new STOStatus(actionBy, new Date(), StockTransferStatusEnum.CANCELLED));
        return updateStockTransferOrder(stOrder);
    }

    @Override
    public StockTransferOrder rejectStockTransferOrder(Long id, Long siteId)
            throws StockTransferException, SiteConfirmationException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || !actionBy.equals(stOrder.getFromSite())) {
            throw new SiteConfirmationException("Site is not allowed to reject the order.");
        } else if (stOrder.getLastStatus() != StockTransferStatusEnum.PENDING) {
            throw new StockTransferException(
                    "Stock Transfer Order has already been accepted.");
        }

        stOrder.addStatusHistory(new STOStatus(actionBy, new Date(), StockTransferStatusEnum.CANCELLED));
        return updateStockTransferOrder(stOrder);
    }

    @Override
    public StockTransferOrder confirmStockTransferOrder(Long id, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || !actionBy.equals(stOrder.getFromSite())) {
            throw new SiteConfirmationException("Site is not allowed to confirm the order.");
        } else if (stOrder.getLastStatus() != StockTransferStatusEnum.PENDING) {
            throw new StockTransferException("Stock Transfer Order is not pending for approval.");
        }
        stOrder.addStatusHistory(new STOStatus(actionBy, new Date(), StockTransferStatusEnum.ACCEPTED));
        return updateStockTransferOrder(stOrder);
    }

    @Override
    public StockTransferOrder pickPackTransferOrder(Long id, Long siteId)
            throws StockTransferException, SiteConfirmationException {

        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else if (stOrder.getLastStatus() == StockTransferStatusEnum.ACCEPTED) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.PICKING));
        } else if (stOrder.getLastStatus() == StockTransferStatusEnum.PICKING) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.PICKED));
        } else if (stOrder.getLastStatus() == StockTransferStatusEnum.PICKED) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.PACKING));
        } else if (stOrder.getLastStatus() == StockTransferStatusEnum.PACKING) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.PACKED));
        } else if (stOrder.getLastStatus() == StockTransferStatusEnum.PACKED) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.READY_FOR_DELIVERY));
        } else {
            throw new StockTransferException("Order is not due to pick or pack.");
        }

        return updateStockTransferOrder(stOrder);
    }

    @Override
    public StockTransferOrder scanProductAtFromSite(Long id, String rfidsku, int qty)
            throws StockTransferException, ProductException {
        StockTransferOrder stOrder = getStockTransferOrder(id);

        Product product = productService.getProduct(rfidsku);
        List<StockTransferOrderLI> lineItems = stOrder.getLineItems();

        if (stOrder.getLastStatus() == StockTransferStatusEnum.PICKING) {
            for (StockTransferOrderLI stoli : lineItems) {
                if (stoli.getProduct().equals(product)) {
                    if (stoli.getPickedQty() + qty > stoli.getRequestedQty()) {
                        throw new StockTransferException(
                                "The quantity of this product has exceeded the requested quantity by "
                                        + (stoli.getPickedQty() + qty - stoli.getRequestedQty())
                                        + " and cannot be picked.");
                    }
                    stoli.setPickedQty(stoli.getPickedQty() + qty);

                    boolean picked = true;
                    for (StockTransferOrderLI stoli2 : lineItems) {
                        if (stoli2.getPickedQty() < stoli2.getRequestedQty()) {
                            picked = false;
                        }
                    }
                    if (picked) {
                        stOrder.addStatusHistory(new STOStatus(stOrder.getLastActor(), new Date(),
                                StockTransferStatusEnum.PICKED));
                    }

                    return em.merge(stOrder);

                }
            }
            throw new StockTransferException("The product scanned is not required in the order that you are picking");
        } else if (stOrder.getLastStatus() == StockTransferStatusEnum.PACKING) {
            for (StockTransferOrderLI stoli : lineItems) {
                if (stoli.getProduct().equals(product)) {
                    if (stoli.getPackedQty() + qty > stoli.getPickedQty()) {
                        throw new StockTransferException("You are packing items that are not meant for this order.");
                    } else {
                        stoli.setPackedQty(stoli.getPackedQty() + qty);
                        boolean packed = true;
                        for (StockTransferOrderLI stoli2 : lineItems) {
                            if (stoli2.getPackedQty() < stoli2.getPickedQty()) {
                                packed = false;
                            }
                        }
                        if (packed) {
                            stOrder.addStatusHistory(new STOStatus(stOrder.getLastActor(), new Date(),
                                    StockTransferStatusEnum.PACKED));
                        }
                        return em.merge(stOrder);
                    }
                }
            }
            throw new StockTransferException("The product scanned is not required in the order that you are packing");
        } else {
            throw new StockTransferException("The order is not due for picking / packing.");
        }
    }

    @Override
    public StockTransferOrder deliverStockTransferOrder(Long id) throws StockTransferException {

        StockTransferOrder stOrder = getStockTransferOrder(id);

        if (stOrder.getLastStatus() != StockTransferStatusEnum.READY_FOR_DELIVERY) {
            throw new StockTransferException("Stock Transfer Order is ready for delivery.");
        }

        stOrder.addStatusHistory(
                new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.DELIVERING));

        // Remove stocks from site
        for (StockTransferOrderLI stoli : stOrder.getLineItems()) {
            try {
                siteService.removeProducts(stOrder.getFromSite().getId(), stoli.getProduct().getSku(),
                        stoli.getPackedQty());
            } catch (NoStockLevelException | IllegalTransferException e) {
                e.printStackTrace();
            }
        }

        return updateStockTransferOrder(stOrder);
    }

    @Override
    public StockTransferOrder deliverMultipleStockTransferOrder(Long id) throws StockTransferException {

        StockTransferOrder stOrder = getStockTransferOrder(id);

        if (stOrder.getLastStatus() != StockTransferStatusEnum.READY_FOR_DELIVERY) {
            throw new StockTransferException("Stock Transfer Order is ready for delivery.");
        }

        stOrder.addStatusHistory(
                new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.DELIVERING_MULTIPLE));

        // Remove stocks from site
        for (StockTransferOrderLI stoli : stOrder.getLineItems()) {
            try {
                siteService.removeProducts(stOrder.getFromSite().getId(), stoli.getProduct().getSku(),
                        stoli.getPackedQty());
            } catch (NoStockLevelException | IllegalTransferException e) {
                e.printStackTrace();
            }
        }

        return updateStockTransferOrder(stOrder);
    }

    @Override
    public StockTransferOrder scanProductAtToSite(Long id, String rfidsku, int qty)
            throws StockTransferException, ProductException {
        StockTransferOrder stOrder = getStockTransferOrder(id);

        if (stOrder.getLastStatus() != StockTransferStatusEnum.DELIVERING_MULTIPLE
                && stOrder.getLastStatus() != StockTransferStatusEnum.DELIVERING) {
            throw new StockTransferException("Order cannot be verified yet.");
        }

        Product product = productService.getProduct(rfidsku);
        List<StockTransferOrderLI> lineItems = stOrder.getLineItems();

        for (StockTransferOrderLI stoli : lineItems) {
            if (stoli.getProduct().equals(product)) {
                stoli.setReceivedQty(stoli.getReceivedQty() + qty);
                boolean picked = true;
                for (StockTransferOrderLI stoli2 : lineItems) {
                    if (stoli2.getReceivedQty() < stoli2.getPickedQty()) {
                        picked = false;
                    }
                }
                if (picked) {
                    stOrder.addStatusHistory(new STOStatus(stOrder.getLastActor(), new Date(),
                            StockTransferStatusEnum.COMPLETED));
                }
                try {
                    siteService.addProducts(stOrder.getToSite().getId(), product.getSku(), qty);
                } catch (NoStockLevelException e) {
                    e.printStackTrace();
                }
                return em.merge(stOrder);
            }
        }
        throw new StockTransferException("The product scanned is not related to the Stock Transfer Order");
    }

    @Override
    public StockTransferOrder completeStockTransferOrder(Long orderId)
            throws StockTransferException, SiteConfirmationException {

        StockTransferOrder stOrder = getStockTransferOrder(orderId);

        if (stOrder.getLastStatus() != StockTransferStatusEnum.DELIVERING
                && stOrder.getLastStatus() != StockTransferStatusEnum.DELIVERING_MULTIPLE) {
            throw new StockTransferException("Stock Transfer Order is not due to be confirmed.");
        }

        stOrder.addStatusHistory(
                new STOStatus(stOrder.getLastActor(), new Date(), StockTransferStatusEnum.COMPLETED));
        return updateStockTransferOrder(stOrder);
    }
}
