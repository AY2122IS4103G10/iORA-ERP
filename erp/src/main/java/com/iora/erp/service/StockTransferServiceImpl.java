package com.iora.erp.service;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.StockTransferStatus;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.exception.StockTransferException;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.stockTransfer.STOStatus;
import com.iora.erp.model.stockTransfer.StockTransferOrder;
import com.iora.erp.model.stockTransfer.StockTransferOrderLI;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("stockTransferServiceImpl")
@Transactional
public class StockTransferServiceImpl implements StockTransferService {

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
    public StockTransferOrder createStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException {
        Site actionBy = em.find(Site.class, siteId);
        System.out.println(stockTransferOrder.getFromSite());

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else {
            List<STOStatus> statusHistory = new ArrayList<>();
            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.PENDINGALL));
            stockTransferOrder.setStatusHistory(statusHistory);
            em.persist(stockTransferOrder);
            return stockTransferOrder;
        }
    }

    @Override
    public StockTransferOrder updateStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else {
            List<STOStatus> statusHistory = stockTransferOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != StockTransferStatus.PENDINGALL) {
                throw new StockTransferException(
                        "Stock Transfer Order has been received by the other party and cannot be amended.");
            }
            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.PENDINGALL));
            stockTransferOrder.setStatusHistory(statusHistory);
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
        } else {
            List<STOStatus> statusHistory = stOrder.getStatusHistory();
            StockTransferStatus prevStatus = statusHistory.get(statusHistory.size() - 1).getStatus();
            if (prevStatus != StockTransferStatus.PENDINGALL || prevStatus != StockTransferStatus.PENDINGONE) {
                throw new StockTransferException(
                        "Stock Transfer Order has been responded to by the other party and cannot be deleted.");
            }
            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.CANCELLED));
            stOrder.setStatusHistory(statusHistory);
            return em.merge(stOrder);
        }
    }

    @Override
    public StockTransferOrder rejectStockTransferOrder(Long id, Long siteId)
            throws StockTransferException, SiteConfirmationException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else {
            List<STOStatus> statusHistory = stOrder.getStatusHistory();
            StockTransferStatus prevStatus = statusHistory.get(statusHistory.size() - 1).getStatus();
            if (prevStatus != StockTransferStatus.PENDINGALL || prevStatus != StockTransferStatus.PENDINGONE) {
                throw new StockTransferException(
                        "Stock Transfer Order has already been confirmed and cannot be rejected.");
            }

            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.CANCELLED));
            stOrder.setStatusHistory(statusHistory);
            return em.merge(stOrder);
        }
    }

    @Override
    public StockTransferOrder confirmStockTransferOrder(Long id, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        StockTransferOrder stOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        List<STOStatus> statusHistory = stOrder.getStatusHistory();
        StockTransferStatus prevStatus = statusHistory.get(statusHistory.size() - 1).getStatus();

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else if (prevStatus != StockTransferStatus.PENDINGALL || prevStatus != StockTransferStatus.PENDINGONE) {
            throw new StockTransferException(
                    "Stock Transfer Order is not pending for approval.");
        } else if (prevStatus == StockTransferStatus.PENDINGALL) {
            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.PENDINGONE));
            stOrder.setStatusHistory(statusHistory);
        } else {
            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.CONFIRMED));
            stOrder.setStatusHistory(statusHistory);
        }
        return em.merge(stOrder);
    }

    @Override
    public StockTransferOrder fulfilStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else {
            List<STOStatus> statusHistory = stockTransferOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != StockTransferStatus.CONFIRMED) {
                throw new StockTransferException(
                        "Stock Transfer Order is not confirmed.");
            } else if (siteId != stockTransferOrder.getFromSite().getId()) {
                throw new StockTransferException(
                        "Site is not responsible for fulfilling this order.");
            }

            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.READY));
            stockTransferOrder.setStatusHistory(statusHistory);
            return em.merge(stockTransferOrder);
        }
    }

    @Override
    public StockTransferOrder deliverStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws SiteConfirmationException, StockTransferException {
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else {
            List<STOStatus> statusHistory = stockTransferOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != StockTransferStatus.READY) {
                throw new StockTransferException(
                        "Stock Transfer Order is not confirmed.");
            } else if (siteId != stockTransferOrder.getFromSite().getId()) {
                throw new StockTransferException(
                        "Site is not responsible for delivering this order.");
            }

            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.DELIVERING));
            stockTransferOrder.setStatusHistory(statusHistory);
            return em.merge(stockTransferOrder);
        }
    }

    @Override
    public StockTransferOrder completeStockTransferOrder(StockTransferOrder stockTransferOrder, Long siteId)
            throws StockTransferException, SiteConfirmationException {
        // StockTransferOrder stockTransferOrder = getStockTransferOrder(id);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null) {
            throw new SiteConfirmationException("Site with id " + siteId + " does not exist.");
        } else {
            List<STOStatus> statusHistory = stockTransferOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != StockTransferStatus.DELIVERING) {
                throw new StockTransferException(
                        "Stock Transfer Order is not confirmed.");
            } else if (siteId != stockTransferOrder.getToSite().getId()) {
                throw new StockTransferException(
                        "Site is not responsible for receiving this order.");
            }

            // This loop is for simulating that all received qty = shipped qty
            for (StockTransferOrderLI stoli : stockTransferOrder.getLineItems()) {
                stoli.setActualProductItems(stoli.getSentProductItems());
                stoli.setActualQty(stoli.getSentQty());
            }

            statusHistory.add(new STOStatus(actionBy, LocalDateTime.now(), StockTransferStatus.COMPLETED));
            stockTransferOrder.setStatusHistory(statusHistory);
            return em.merge(stockTransferOrder);
        }
    }
}
