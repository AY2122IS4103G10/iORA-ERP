package com.iora.erp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.StockTransferStatus;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.site.HeadquartersSite;
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
    public List<StockTransferOrder> getStockTransferOrdersForDelivery() {
        /* TypedQuery<StockTransferOrder> q = em.createQuery(
                "SELECT DISTINCT(sto) FROM StockTransferOrder sto RIGHT JOIN .statusHistory st WHERE st.status = 'READY_FOR_DELIVERY' OR st.status = 'DELIVERING' ORDER BY st.timeStamp DESC", StockTransferOrder.class);
                q.setParameter("status", StockTransferStatus.READY_FOR_DELIVERY); */

        List<StockTransferOrder> deliveryOrders = new ArrayList<>();
        
        for (StockTransferOrder sto : getStockTransferOrders()) {
            if (sto.getLastStatus() == StockTransferStatus.READY_FOR_DELIVERY || sto.getLastStatus() == StockTransferStatus.DELIVERING) {
                deliveryOrders.add(sto);
            }
        }
        return deliveryOrders;
    }

    @Override
    public StockTransferOrder createStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException {
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else {
            stockTransferOrder
                    .addStatusHistory(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.PENDINGALL));
            em.persist(stockTransferOrder);
            return stockTransferOrder;
        }
    }

    @Override
    public StockTransferOrder updateStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || actionBy.equals(stockTransferOrder.getLastActor())) {
            throw new SiteConfirmationException(
                    "Site is not the creator of this order and is not permitted to update it.");
        } else if (stockTransferOrder.getLastStatus() != StockTransferStatus.PENDINGALL) {
            throw new StockTransferException(
                    "Stock Transfer Order has been received by the other party and cannot be amended.");
        } else {
            stockTransferOrder
                    .addStatusHistory(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.PENDINGALL));
            return em.merge(stockTransferOrder);
        }
    }

    @Override
    public StockTransferOrder cancelStockTransferOrder(Long id, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else if (stOrder.getLastStatus() != StockTransferStatus.PENDINGALL
                || stOrder.getLastStatus() != StockTransferStatus.PENDINGONE) {
            throw new StockTransferException(
                    "Stock Transfer Order has been responded to by all other parties and cannot be deleted.");
        } else if (!actionBy.equals(stOrder.getLastActor())) {
            throw new SiteConfirmationException(
                    "Site is not the creator of this order and is not permitted to update it.");
        }

        stOrder.addStatusHistory(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.CANCELLED));
        return em.merge(stOrder);
    }

    @Override
    public StockTransferOrder rejectStockTransferOrder(Long id, Long siteId)
            throws StockTransferException, SiteConfirmationException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || !actionBy.equals(stOrder.getFromSite()) || !actionBy.equals(stOrder.getToSite())
                || !(actionBy instanceof HeadquartersSite)) {
            throw new SiteConfirmationException("Site is not allowed to reject the order.");
        } else if (stOrder.getLastStatus() != StockTransferStatus.PENDINGALL
                || stOrder.getLastStatus() != StockTransferStatus.PENDINGONE) {
            throw new StockTransferException(
                    "Stock Transfer Order cannot be rejected.");
        }

        stOrder.addStatusHistory(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.CANCELLED));
        return em.merge(stOrder);
    }

    @Override
    public StockTransferOrder confirmStockTransferOrder(Long id, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || !actionBy.equals(stOrder.getFromSite()) || !actionBy.equals(stOrder.getToSite())
                || !(actionBy instanceof HeadquartersSite)) {
            throw new SiteConfirmationException("Site is not allowed to confirm the order.");
        } else if (stOrder.getLastStatus() != StockTransferStatus.PENDINGALL
                || stOrder.getLastStatus() != StockTransferStatus.PENDINGONE) {
            throw new StockTransferException("Stock Transfer Order is not pending for approval.");
        } else if (stOrder.getLastStatus() == StockTransferStatus.PENDINGALL) {
            if (actionBy instanceof HeadquartersSite) {
                stOrder.setHqAccepted(true);
            } else {
                stOrder.setOpAccepeted(true);
            }
            stOrder.addStatusHistory(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.PENDINGONE));
        } else {
            if (actionBy instanceof HeadquartersSite) {
                stOrder.setHqAccepted(true);
            } else {
                stOrder.setOpAccepeted(true);
            }
            stOrder.addStatusHistory(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.ACCEPTED));
        }

        return em.merge(stOrder);
    }

    @Override
    public StockTransferOrder pickPackTransferOrder(Long id, Long siteId)
            throws StockTransferException, SiteConfirmationException {

        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else if (stOrder.getLastStatus() == StockTransferStatus.ACCEPTED) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.PICKING));
        } else if (stOrder.getLastStatus() == StockTransferStatus.PICKING) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.PICKED));
        } else if (stOrder.getLastStatus() == StockTransferStatus.PICKED) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.PACKING));
        } else if (stOrder.getLastStatus() == StockTransferStatus.PACKING) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.PACKED));
        } else if (stOrder.getLastStatus() == StockTransferStatus.PACKED) {
            stOrder.addStatusHistory(
                    new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.READY_FOR_DELIVERY));
        } else {
            throw new StockTransferException("Order is not due to pick or pack.");
        }

        return em.merge(stOrder);
    }

    @Override
    public StockTransferOrder scanProductAtFromSite(Long id, String rfidsku, int qty)
            throws StockTransferException, ProductException {
        StockTransferOrder stOrder = getStockTransferOrder(id);

        if (stOrder.getLastStatus() != StockTransferStatus.PICKING) {
            throw new StockTransferException("Order does not need picking.");
        }

        Product product = productService.getProduct(rfidsku);
        List<StockTransferOrderLI> lineItems = stOrder.getLineItems();

        for (StockTransferOrderLI stoli : lineItems) {
            if (stoli.getProduct().equals(product)) {
                if (stoli.getSentQty() + qty > stoli.getSentQty()) {
                    throw new StockTransferException("There will be too many quantity of this product.");
                } else {
                    stoli.setSentQty(stoli.getSentQty() + qty);
                    boolean picked = true;
                    for (StockTransferOrderLI stoli2 : lineItems) {
                        if (stoli2.getSentQty() < stoli2.getRequestedQty()) {
                            picked = false;
                        }
                    }
                    if (picked) {
                        stOrder.addStatusHistory(new STOStatus(stOrder.getLastActor(), LocalDateTime.now(),
                                StockTransferStatus.PICKED));
                    }
                    return em.merge(stOrder);
                }
            }
        }
        throw new StockTransferException("The product scanned is not required in the order that you are picking");
    }

    @Override
    public StockTransferOrder deliverStockTransferOrder(Long id)
            throws SiteConfirmationException, StockTransferException {

        StockTransferOrder stOrder = getStockTransferOrder(id);

        if (stOrder.getLastStatus() != StockTransferStatus.READY_FOR_DELIVERY) {
            throw new StockTransferException("Stock Transfer Order is ready for delivery.");
        }

        stOrder.addStatusHistory(
                new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.DELIVERING));
        return em.merge(stOrder);
    }

    @Override
    public StockTransferOrder receiveStockTransferOrder(Long id, Long siteId) throws StockTransferException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || !actionBy.equals(stOrder.getToSite())) {
            throw new StockTransferException("Site is not supposed to receive this order.");
        } else if (stOrder.getLastStatus() != StockTransferStatus.DELIVERING) {
            throw new StockTransferException("Stock Transfer Order cannot be received.");
        }

        stOrder.addStatusHistory(
                new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.DELIVERED));
        return em.merge(stOrder);
    }

    @Override
    public StockTransferOrder scanProductAtToSite(Long id, String rfidsku, int qty)
            throws StockTransferException, ProductException {
        StockTransferOrder stOrder = getStockTransferOrder(id);

        if (stOrder.getLastStatus() != StockTransferStatus.DELIVERED) {
            throw new StockTransferException("Order cannot be verified yet.");
        }

        Product product = productService.getProduct(rfidsku);
        List<StockTransferOrderLI> lineItems = stOrder.getLineItems();

        for (StockTransferOrderLI stoli : lineItems) {
            if (stoli.getProduct().equals(product)) {
                stoli.setActualQty(stoli.getActualQty() + qty);
                boolean picked = true;
                for (StockTransferOrderLI stoli2 : lineItems) {
                    if (stoli2.getActualQty() < stoli2.getSentQty()) {
                        picked = false;
                    }
                }
                if (picked) {
                    stOrder.addStatusHistory(new STOStatus(stOrder.getLastActor(), LocalDateTime.now(),
                            StockTransferStatus.COMPLETED));
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

        if (stOrder.getLastStatus() != StockTransferStatus.DELIVERED) {
            throw new StockTransferException("Stock Transfer Order is not due to be confirmed.");
        }

        stOrder.addStatusHistory(
                new STOStatus(stOrder.getLastActor(), LocalDateTime.now(), StockTransferStatus.COMPLETED));
        return em.merge(stOrder);
    }
}
