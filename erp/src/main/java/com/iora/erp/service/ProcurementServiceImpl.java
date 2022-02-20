package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.enumeration.ProcurementOrderFulfilmentStatus;
import com.iora.erp.enumeration.ProcurementOrderStatus;
import com.iora.erp.exception.IllegalPOModificationException;
import com.iora.erp.exception.ProcurementOrderException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.model.procurementOrder.POFStatus;
import com.iora.erp.model.procurementOrder.POStatus;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrderFulfilment;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.WarehouseSite;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("procurementServiceImpl")
@Transactional
public class ProcurementServiceImpl implements ProcurementService {

    @PersistenceContext
    private EntityManager em;

    @Override
    public ProcurementOrder getProcurementOrder(Long id) {
        return em.find(ProcurementOrder.class, id);
    }

    @Override
    public List<ProcurementOrder> getProcurementOrders() {
        return em.createQuery("SELECT po FROM ProcurementOrder po", ProcurementOrder.class).getResultList();
    }

    @Override
    public List<ProcurementOrder> getProcurementOrdersOfSite(Site site) {
        if (site instanceof WarehouseSite) {
            return em.createQuery("SELECT po FROM ProcurementOrder po WHERE po.warehouse.id = :warehouse",
                    ProcurementOrder.class).setParameter("warehouse", site.getId()).getResultList();
        } else if (site instanceof HeadquartersSite) {
            return em.createQuery("SELECT po FROM ProcurementOrder po WHERE po.headquarters.id = :hq",
                    ProcurementOrder.class).setParameter("hq", site.getId()).getResultList();
        } else if (site instanceof ManufacturingSite) {
            return em.createQuery("SELECT po FROM ProcurementOrder po WHERE po.manufacturing.id = :factory",
                    ProcurementOrder.class).setParameter("factory", site.getId()).getResultList();
        }
        return new ArrayList<>();
    }

    @Override
    public void createProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException {
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof HeadquartersSite) {
            List<POStatus> statusHistory = new ArrayList<>();
            statusHistory.add(new POStatus(actionBy, new Date(), ProcurementOrderStatus.PENDING));
            procurementOrder.setStatusHistory(statusHistory);
            procurementOrder.setHeadquarters((HeadquartersSite) actionBy);

            procurementOrder.setProcurementOrderFulfilment(new ProcurementOrderFulfilment());
            em.persist(procurementOrder);
        } else {
            throw new SiteConfirmationException("Site is not authorised to creat Procurement Order.");
        }
    }

    @Override
    public void updateProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException {
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof HeadquartersSite) {
            List<POStatus> statusHistory = procurementOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != ProcurementOrderStatus.PENDING) {
                throw new IllegalPOModificationException(
                        "Procurement Order has already been confirmed and cannot be updated.");
            }
            statusHistory.add(new POStatus(actionBy, new Date(), ProcurementOrderStatus.PENDING));
            procurementOrder.setStatusHistory(statusHistory);
            em.merge(procurementOrder);
        } else {
            throw new SiteConfirmationException("Site is not authorised to update Procurement Order.");
        }
    }

    @Override
    public void rejectProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {
        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        }
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof ManufacturingSite) {
            List<POStatus> statusHistory = procurementOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != ProcurementOrderStatus.PENDING) {
                throw new IllegalPOModificationException(
                        "Procurement Order has already been confirmed and cannot be rejected.");
            }
            statusHistory.add(new POStatus(actionBy, new Date(), ProcurementOrderStatus.CANCELLED));
            procurementOrder.setStatusHistory(statusHistory);
            procurementOrder.setManufacturing((ManufacturingSite) actionBy);

            ProcurementOrderFulfilment pof = procurementOrder.getProcurementOrderFulfilment();
            List<POFStatus> fulfilmentStatusHistory = new ArrayList<>();
            fulfilmentStatusHistory
                    .add(new POFStatus(actionBy, new Date(), ProcurementOrderFulfilmentStatus.CANCELLED));
            pof.setStatusHistory(fulfilmentStatusHistory);

            em.merge(procurementOrder);
            em.merge(pof);
        } else {
            throw new SiteConfirmationException("Site is not authorised to reject Procurement Order.");
        }
    }

    @Override
    public void deleteProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {
        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        }
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof HeadquartersSite) {
            List<POStatus> statusHistory = procurementOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != ProcurementOrderStatus.PENDING) {
                throw new IllegalPOModificationException(
                        "Procurement Order has already been confirmed and cannot be deleted.");
            }
            statusHistory.add(new POStatus(actionBy, new Date(), ProcurementOrderStatus.CANCELLED));
            procurementOrder.setStatusHistory(statusHistory);

            ProcurementOrderFulfilment pof = procurementOrder.getProcurementOrderFulfilment();
            List<POFStatus> fulfilmentStatusHistory = new ArrayList<>();
            fulfilmentStatusHistory
                    .add(new POFStatus(actionBy, new Date(), ProcurementOrderFulfilmentStatus.CANCELLED));
            pof.setStatusHistory(fulfilmentStatusHistory);

            em.merge(procurementOrder);
            em.merge(pof);
        } else {
            throw new SiteConfirmationException("Site is not authorised to delete Procurement Order.");
        }
    }

    @Override
    public void confirmProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {
        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        }
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof ManufacturingSite) {
            List<POStatus> statusHistory = procurementOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != ProcurementOrderStatus.PENDING) {
                throw new IllegalPOModificationException("Procurement Order is not pending.");
            }
            statusHistory.add(new POStatus(actionBy, new Date(), ProcurementOrderStatus.CONFIRMED));
            procurementOrder.setStatusHistory(statusHistory);
            procurementOrder.setManufacturing((ManufacturingSite) actionBy);

            ProcurementOrderFulfilment pof = procurementOrder.getProcurementOrderFulfilment();
            List<POFStatus> fulfilmentStatusHistory = new ArrayList<>();
            fulfilmentStatusHistory.add(new POFStatus(actionBy, new Date(), ProcurementOrderFulfilmentStatus.PENDING));
            pof.setStatusHistory(fulfilmentStatusHistory);

            em.merge(procurementOrder);
            em.merge(pof);
        } else {
            throw new SiteConfirmationException("Site is not authorised to confirm Procurement Order.");
        }
    }

    @Override
    public void fulfilProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException {
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof ManufacturingSite) {
            List<POStatus> statusHistory = procurementOrder.getStatusHistory();
            if (statusHistory.get(statusHistory.size() - 1).getStatus() != ProcurementOrderStatus.CONFIRMED) {
                throw new IllegalPOModificationException("Procurement Order is not confirmed.");
            }
            statusHistory.add(new POStatus(actionBy, new Date(), ProcurementOrderStatus.READY));
            procurementOrder.setStatusHistory(statusHistory);

            ProcurementOrderFulfilment pof = procurementOrder.getProcurementOrderFulfilment();
            List<POFStatus> fulfilmentStatusHistory = pof.getStatusHistory();
            if (fulfilmentStatusHistory.get(fulfilmentStatusHistory.size() - 1)
                    .getStatus() != ProcurementOrderFulfilmentStatus.PENDING) {
                throw new IllegalPOModificationException("Procurement Order Fulfilment is not pending.");
            }
            fulfilmentStatusHistory
                    .add(new POFStatus(actionBy, new Date(), ProcurementOrderFulfilmentStatus.CONFIRMED));
            pof.setStatusHistory(fulfilmentStatusHistory);

            em.merge(procurementOrder);
            em.merge(pof);
        } else {
            throw new SiteConfirmationException("Site is not authorised to fulfil Procurement Order.");
        }
    }

    @Override
    public void shipProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException {
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof ManufacturingSite) {
            ProcurementOrderFulfilment pof = procurementOrder.getProcurementOrderFulfilment();
            List<POFStatus> fulfilmentStatusHistory = pof.getStatusHistory();
            if (fulfilmentStatusHistory.get(fulfilmentStatusHistory.size() - 1)
                    .getStatus() != ProcurementOrderFulfilmentStatus.CONFIRMED) {
                throw new IllegalPOModificationException("Procurement Order Fulfilment is not confirmed.");
            }
            fulfilmentStatusHistory
                    .add(new POFStatus(actionBy, new Date(), ProcurementOrderFulfilmentStatus.SHIPPED));
            pof.setStatusHistory(fulfilmentStatusHistory);

            em.merge(pof);
        } else {
            throw new SiteConfirmationException("Site is not authorised to ship Procurement Order.");
        }
    }

    @Override
    public void verifyProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException {
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof WarehouseSite) {
            ProcurementOrderFulfilment pof = procurementOrder.getProcurementOrderFulfilment();
            List<POFStatus> fulfilmentStatusHistory = pof.getStatusHistory();
            if (fulfilmentStatusHistory.get(fulfilmentStatusHistory.size() - 1)
                    .getStatus() != ProcurementOrderFulfilmentStatus.SHIPPED) {
                throw new IllegalPOModificationException("Procurement Order Fulfilment is not shipped.");
            }
            fulfilmentStatusHistory.add(new POFStatus(actionBy, new Date(), ProcurementOrderFulfilmentStatus.VERIFIED));
            pof.setStatusHistory(fulfilmentStatusHistory);

            em.merge(pof);
        } else {
            throw new SiteConfirmationException("Site is not authorised to verify Procurement Order.");
        }
    }

    @Override
    public void completeProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {
        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        }
        Site actionBy = em.find(Site.class, siteId);
        if (actionBy != null && actionBy instanceof HeadquartersSite) {
            ProcurementOrderFulfilment pof = procurementOrder.getProcurementOrderFulfilment();
            List<POFStatus> fulfilmentStatusHistory = pof.getStatusHistory();
            if (fulfilmentStatusHistory.get(fulfilmentStatusHistory.size() - 1)
                    .getStatus() != ProcurementOrderFulfilmentStatus.VERIFIED) {
                throw new IllegalPOModificationException("Procurement Order Fulfilment is not verified.");
            }
            fulfilmentStatusHistory
                    .add(new POFStatus(actionBy, new Date(), ProcurementOrderFulfilmentStatus.COMPLETED));
            pof.setStatusHistory(fulfilmentStatusHistory);

            em.merge(pof);
        } else {
            throw new SiteConfirmationException("Site is not authorised to complete Procurement Order.");
        }
    }

}
