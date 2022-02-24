package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.enumeration.ProcurementOrderStatus;
import com.iora.erp.exception.IllegalPOModificationException;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.ProcurementOrderException;
import com.iora.erp.exception.ProductItemException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.model.procurementOrder.POStatus;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrderLI;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.site.HeadquartersSite;
import com.iora.erp.model.site.ManufacturingSite;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.WarehouseSite;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("procurementServiceImpl")
@Transactional
public class ProcurementServiceImpl implements ProcurementService {

    @Autowired
    private ProductService productService;
    @Autowired
    private SiteService siteService;
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
    public ProcurementOrder createProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException {
        HeadquartersSite actionBy = em.find(HeadquartersSite.class, siteId);
        if (actionBy != null) {
            procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.PENDING));
            procurementOrder.setHeadquarters(actionBy);

            em.persist(procurementOrder);
            return procurementOrder;
        } else {
            throw new SiteConfirmationException("Site is not authorised to create Procurement Order.");
        }
    }

    @Override
    public ProcurementOrder updateProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder oldOrder = em.find(ProcurementOrder.class, procurementOrder.getId());
        HeadquartersSite actionBy = em.find(HeadquartersSite.class, siteId);

        if (oldOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (oldOrder.getLastStatus() != ProcurementOrderStatus.PENDING) {
            throw new IllegalPOModificationException(
                    "Procurement Order is not pending and cannot be updated.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to update Procurement Order.");
        }

        procurementOrder.setStatusHistory(oldOrder.getStatusHistory());
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.PENDING));
        procurementOrder.setHeadquarters(actionBy);

        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder rejectProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        ManufacturingSite actionBy = em.find(ManufacturingSite.class, siteId);

        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (procurementOrder.getLastStatus() != ProcurementOrderStatus.PENDING) {
            throw new IllegalPOModificationException(
                    "Procurement Order is not pending and cannot be rejected.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to reject Procurement Order.");
        }

        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.CANCELLED));
        procurementOrder.setManufacturing(actionBy);

        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder deleteProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        HeadquartersSite actionBy = em.find(HeadquartersSite.class, siteId);

        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (procurementOrder.getLastStatus() != ProcurementOrderStatus.PENDING) {
            throw new IllegalPOModificationException(
                    "Procurement Order is not pending and cannot be deleted.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to delete Procurement Order.");
        }

        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.CANCELLED));
        procurementOrder.setHeadquarters(actionBy);

        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder confirmProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        ManufacturingSite actionBy = em.find(ManufacturingSite.class, siteId);

        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (procurementOrder.getLastStatus() != ProcurementOrderStatus.PENDING) {
            throw new IllegalPOModificationException("Procurement Order is not pending.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to confirm Procurement Order.");
        }

        procurementOrder.setManufacturing(actionBy);
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.ACCEPTED));

        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder fulfilProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException,
            IllegalTransferException {

        ProcurementOrder oldOrder = em.find(ProcurementOrder.class, procurementOrder.getId());
        ManufacturingSite actionBy = em.find(ManufacturingSite.class, siteId);

        if (oldOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (oldOrder.getLastStatus() != ProcurementOrderStatus.ACCEPTED) {
            throw new IllegalPOModificationException("Procurement Order is not confirmed.");
        } else if (actionBy == null || actionBy.getId() != siteId) {
            throw new SiteConfirmationException("Site is not authorised to fulfil Procurement Order.");
        }

        List<ProductItem> productItems = procurementOrder.getLineItems().stream().map(x -> x.getFulfilledProductItems())
                .flatMap(Collection::stream).collect(Collectors.toList());
        for (int i = 0; i < productItems.size(); i++) {
            try {
                productService.createProductItem(productItems.get(i).getRfid(), productItems.get(i).getProductSKU());
            } catch (ProductItemException e) {
                System.err.println(e.getMessage());
            }
        }
        siteService.addManyToStockLevel(actionBy.getStockLevel(), productItems);
        procurementOrder.setStatusHistory(oldOrder.getStatusHistory());
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.READY));

        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder shipProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException,
            IllegalTransferException {

        ProcurementOrder oldOrder = em.find(ProcurementOrder.class, procurementOrder.getId());
        ManufacturingSite actionBy = em.find(ManufacturingSite.class, siteId);

        if (oldOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (oldOrder.getLastStatus() != ProcurementOrderStatus.READY) {
            throw new IllegalPOModificationException("Procurement Order is not ready.");
        } else if (actionBy == null || actionBy.getId() != siteId) {
            throw new SiteConfirmationException("Site is not authorised to ship Procurement Order.");
        }

        List<ProductItem> productItems = procurementOrder.getLineItems().stream().map(x -> x.getFulfilledProductItems())
                .flatMap(Collection::stream).collect(Collectors.toList());
        siteService.removeManyFromStockLevel(productItems);
        procurementOrder.setStatusHistory(oldOrder.getStatusHistory());
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.SHIPPED));

        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder verifyProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException,
            IllegalTransferException {

        ProcurementOrder oldOrder = em.find(ProcurementOrder.class, procurementOrder.getId());
        WarehouseSite actionBy = em.find(WarehouseSite.class, siteId);

        if (oldOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (oldOrder.getLastStatus() != ProcurementOrderStatus.SHIPPED) {
            throw new IllegalPOModificationException("Procurement Order is not shipped.");
        } else if (actionBy == null || actionBy.getId() != siteId) {
            throw new SiteConfirmationException("Site is not authorised to verify Procurement Order.");
        }

        List<ProductItem> productItems = procurementOrder.getLineItems().stream().map(x -> x.getFulfilledProductItems())
                .flatMap(Collection::stream).collect(Collectors.toList());
        siteService.addManyToStockLevel(actionBy.getStockLevel(), productItems);
        procurementOrder.setStatusHistory(oldOrder.getStatusHistory());
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.VERIFIED));

        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder completeProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);
        HeadquartersSite actionBy = em.find(HeadquartersSite.class, siteId);

        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (procurementOrder.getLastStatus() != ProcurementOrderStatus.VERIFIED) {
            throw new IllegalPOModificationException("Procurement Order is not verified.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to complete Procurement Order.");
        }

        procurementOrder.setStatusHistory(procurementOrder.getStatusHistory());
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatus.COMPLETED));

        return em.merge(procurementOrder);
    }

}
