package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.ProcurementOrderStatusEnum;
import com.iora.erp.exception.IllegalPOModificationException;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProcurementOrderException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.exception.SiteConfirmationException;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.procurementOrder.POStatus;
import com.iora.erp.model.procurementOrder.ProcurementOrder;
import com.iora.erp.model.procurementOrder.ProcurementOrderLI;
import com.iora.erp.model.product.Product;
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
    public ProcurementOrder getProcurementOrder(Long id) throws ProcurementOrderException {
        ProcurementOrder procurementOrder = em.find(ProcurementOrder.class, id);

        if (procurementOrder == null) {
            throw new ProcurementOrderException("Procurement Order cannot be found");
        } else {
            return procurementOrder;
        }
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
    public List<ProcurementOrder> getProcurementOrdersByStatus(String status) {
        List<ProcurementOrder> pOrders = new ArrayList<>();

        for (ProcurementOrder po : getProcurementOrders()) {
            if (po.getLastStatus() == ProcurementOrderStatusEnum.valueOf(status.toUpperCase())) {
                pOrders.add(po);
            }
        }

        return pOrders;
    }

    @Override
    public List<ProcurementOrder> getPOBySiteStatus(Long siteId, String status) throws ProcurementOrderException {
        Site site = em.find(Site.class, siteId);
        if (site == null) {
            throw new ProcurementOrderException("Site cannot be found.");
        }

        List<ProcurementOrder> deliveries = new ArrayList<>();

        for (ProcurementOrder po : getProcurementOrdersOfSite(site)) {
            if (po.getLastStatus() == ProcurementOrderStatusEnum.valueOf(status.toUpperCase())) {
                deliveries.add(po);
            }
        }

        return deliveries;
    }

    private ProcurementOrder updateProcurementOrder(ProcurementOrder procurementOrder) {
        Notification noti = new Notification("Procurement Order # " + procurementOrder.getId(),
                "Status has been updated to " + procurementOrder.getLastStatus().name() + ": "
                        + procurementOrder.getLastStatus().getDescription());

        procurementOrder.getHeadquarters().addNotification(noti);
        procurementOrder.getManufacturing().addNotification(noti);
        procurementOrder.getWarehouse().addNotification(noti);
        return em.merge(procurementOrder);
    }

    @Override
    public ProcurementOrder createProcurementOrder(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException {
        HeadquartersSite actionBy = em.find(HeadquartersSite.class, siteId);
        if (actionBy != null) {
            procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatusEnum.PENDING));
            procurementOrder.setHeadquarters(actionBy);

            em.persist(procurementOrder);

            Notification noti = new Notification("Procurement Order (NEW) # " + procurementOrder.getId(),
                    "Status is " + procurementOrder.getLastStatus().name() + ": "
                            + procurementOrder.getLastStatus().getDescription());

            procurementOrder.getHeadquarters().addNotification(noti);
            procurementOrder.getManufacturing().addNotification(noti);
            procurementOrder.getWarehouse().addNotification(noti);

            return procurementOrder;
        } else {
            throw new SiteConfirmationException("Site is not authorised to create Procurement Order.");
        }
    }

    @Override
    public ProcurementOrder updateProcurementOrderDetails(ProcurementOrder procurementOrder, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder oldOrder = em.find(ProcurementOrder.class, procurementOrder.getId());
        HeadquartersSite actionBy = em.find(HeadquartersSite.class, siteId);

        if (oldOrder == null) {
            throw new ProcurementOrderException("Procurement Order not found");
        } else if (oldOrder.getLastStatus() != ProcurementOrderStatusEnum.PENDING) {
            throw new IllegalPOModificationException(
                    "Procurement Order is not pending and cannot be updated.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to update Procurement Order.");
        }

        procurementOrder.setStatusHistory(oldOrder.getStatusHistory());
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatusEnum.PENDING));
        procurementOrder.setHeadquarters(actionBy);

        return updateProcurementOrder(procurementOrder);
    }

    @Override
    public ProcurementOrder rejectProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder procurementOrder = getProcurementOrder(id);
        ManufacturingSite actionBy = em.find(ManufacturingSite.class, siteId);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.PENDING) {
            throw new IllegalPOModificationException(
                    "Procurement Order is not pending and cannot be rejected.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to reject Procurement Order.");
        }

        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatusEnum.CANCELLED));
        procurementOrder.setManufacturing(actionBy);

        return updateProcurementOrder(procurementOrder);
    }

    @Override
    public ProcurementOrder deleteProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder procurementOrder = getProcurementOrder(id);
        HeadquartersSite actionBy = em.find(HeadquartersSite.class, siteId);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.PENDING) {
            throw new IllegalPOModificationException(
                    "Procurement Order is not pending and cannot be deleted.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to delete Procurement Order.");
        }

        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatusEnum.CANCELLED));
        procurementOrder.setHeadquarters(actionBy);

        return updateProcurementOrder(procurementOrder);
    }

    @Override
    public ProcurementOrder acceptProcurementOrder(Long id, Long siteId)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException {

        ProcurementOrder procurementOrder = getProcurementOrder(id);
        ManufacturingSite actionBy = em.find(ManufacturingSite.class, siteId);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.PENDING) {
            throw new IllegalPOModificationException("Procurement Order is not pending.");
        } else if (actionBy == null) {
            throw new SiteConfirmationException("Site is not authorised to confirm Procurement Order.");
        }

        procurementOrder.setManufacturing(actionBy);
        procurementOrder.addStatus(new POStatus(actionBy, new Date(), ProcurementOrderStatusEnum.ACCEPTED));

        return updateProcurementOrder(procurementOrder);
    }

    @Override
    public ProcurementOrder manufactureProcurementOrder(Long id)
            throws SiteConfirmationException, IllegalPOModificationException, ProcurementOrderException,
            IllegalTransferException {

        ProcurementOrder procurementOrder = getProcurementOrder(id);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.ACCEPTED) {
            throw new IllegalPOModificationException("Procurement Order is not confirmed.");
        }

        procurementOrder.addStatus(
                new POStatus(procurementOrder.getManufacturing(), new Date(), ProcurementOrderStatusEnum.MANUFACTURED));

        return updateProcurementOrder(procurementOrder);

        /*
         * Generate Newly manufactured items, deprecated
         * List<ProductItem> allProductItems = new ArrayList<>();
         * 
         * for (ProcurementOrderLI poli : procurementOrder.getLineItems()) {
         * for (int i = 0; i < poli.getRequestedQty(); i++) {
         * try {
         * ProductItem pi =
         * productService.createProductItem(StringGenerator.generateRFID(poli.getProduct
         * ().getSku()), poli.getProduct().getSku());
         * allProductItems.add(pi);
         * poli.addFulfilledProductItems(pi);
         * } catch (ProductItemException e) {
         * System.err.println(e.getMessage());
         * }
         * }
         * 
         * try {
         * siteService.addProducts(actionBy.getId(), poli.getProduct().getSku(),
         * Long.valueOf(poli.getRequestedQty()));
         * } catch (NoStockLevelException e) {
         * System.err.println(e.getMessage());
         * }
         * }
         * 
         * List<ProductItem> productItems =
         * procurementOrder.getLineItems().stream().map(x ->
         * x.getFulfilledProductItems())
         * .flatMap(Collection::stream).collect(Collectors.toList());
         * for (int i = 0; i < productItems.size(); i++) {
         * try {
         * productService.createProductItem(productItems.get(i).getRfid(),
         * productItems.get(i).getProductSKU());
         * } catch (ProductItemException e) {
         * System.err.println(e.getMessage());
         * }
         * }
         */
    }

    @Override
    public ProcurementOrder pickPackProcurementOrder(Long id) throws ProcurementOrderException {
        ProcurementOrder po = getProcurementOrder(id);

        if (po.getLastStatus() == ProcurementOrderStatusEnum.MANUFACTURED) {
            po.addStatus(new POStatus(po.getLastActor(), new Date(), ProcurementOrderStatusEnum.PICKING));
        } else if (po.getLastStatus() == ProcurementOrderStatusEnum.PICKING) {
            po.addStatus(new POStatus(po.getLastActor(), new Date(), ProcurementOrderStatusEnum.PACKING));
        } else if (po.getLastStatus() == ProcurementOrderStatusEnum.PICKED) {
            po.addStatus(new POStatus(po.getLastActor(), new Date(), ProcurementOrderStatusEnum.PACKING));
        } else if (po.getLastStatus() == ProcurementOrderStatusEnum.PACKING) {
            po.addStatus(new POStatus(po.getLastActor(), new Date(), ProcurementOrderStatusEnum.PACKED));
        } else if (po.getLastStatus() == ProcurementOrderStatusEnum.PACKED) {
            po.addStatus(new POStatus(po.getLastActor(), new Date(), ProcurementOrderStatusEnum.READY_FOR_SHIPPING));
        } else {
            throw new ProcurementOrderException("Order is not due to pick or pack.");
        }

        return updateProcurementOrder(po);
    }

    @Override
    public ProcurementOrder scanProductAtFactory(Long id, String rfidsku, int qty)
            throws ProductException, ProcurementOrderException {
        ProcurementOrder procurementOrder = getProcurementOrder(id);

        Product product = productService.getProduct(rfidsku);
        List<ProcurementOrderLI> lineItems = procurementOrder.getLineItems();

        if (procurementOrder.getLastStatus() == ProcurementOrderStatusEnum.PICKING) {
            for (ProcurementOrderLI poli : lineItems) {
                if (poli.getProduct().equals(product)) {
                    poli.setPickedQty(poli.getPickedQty() + qty);
                    // boolean picked = true;
                    // for (ProcurementOrderLI poli2 : lineItems) {
                    //     if (poli2.getPickedQty() < poli2.getRequestedQty()) {
                    //         picked = false;
                    //     }
                    // }
                    // if (picked) {
                    //     procurementOrder.addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                    //             ProcurementOrderStatusEnum.PICKED));
                    // }
                    return em.merge(procurementOrder);
                }
            }
            throw new ProcurementOrderException(
                    "The product scanned is not required in the order that you are picking");
        } else if (procurementOrder.getLastStatus() == ProcurementOrderStatusEnum.PACKING) {
            for (ProcurementOrderLI poli : lineItems) {
                if (poli.getProduct().equals(product)) {
                    if (poli.getPackedQty() + qty > poli.getPickedQty()) {
                        throw new ProcurementOrderException("You are packing items that are not meant for this order.");
                    } else {
                        poli.setPackedQty(poli.getPackedQty() + qty);
                        boolean packed = true;
                        for (ProcurementOrderLI poli2 : lineItems) {
                            if (poli2.getPackedQty() < poli2.getPickedQty()) {
                                packed = false;
                            }
                        }
                        if (packed) {
                            procurementOrder.addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                                    ProcurementOrderStatusEnum.PACKED));
                        }
                        return em.merge(procurementOrder);
                    }
                }
            }
            throw new ProcurementOrderException(
                    "The product scanned is not required in the order that you are picking");
        } else {
            throw new ProcurementOrderException("The order is not due for picking / packing.");
        }
    }

    @Override
    public ProcurementOrder adjustProductsAtFactory(Long id, String rfidsku, int qty)
            throws ProductException, ProcurementOrderException {
        ProcurementOrder procurementOrder = getProcurementOrder(id);

        Product product = productService.getProduct(rfidsku);
        List<ProcurementOrderLI> lineItems = procurementOrder.getLineItems();

        if (procurementOrder.getLastStatus() == ProcurementOrderStatusEnum.PICKING) {
            for (ProcurementOrderLI poli : lineItems) {
                if (poli.getProduct().equals(product)) {
                    poli.setPickedQty(qty);
                    // boolean picked = true;
                    // for (ProcurementOrderLI poli2 : lineItems) {
                    //     if (poli2.getPickedQty() < poli2.getRequestedQty()) {
                    //         picked = false;
                    //     }
                    // }
                    // if (picked) {
                    //     procurementOrder.addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                    //             ProcurementOrderStatusEnum.PICKED));
                    // }
                    return em.merge(procurementOrder);
                }
            }
            throw new ProcurementOrderException(
                    "The product is not required in the order that you are picking");
        } else if (procurementOrder.getLastStatus() == ProcurementOrderStatusEnum.PACKING) {
            for (ProcurementOrderLI poli : lineItems) {
                if (poli.getProduct().equals(product)) {
                    if (qty > poli.getPickedQty()) {
                        throw new ProcurementOrderException("You are packing items that are not meant for this order.");
                    } else {
                        poli.setPackedQty(qty);
                        boolean packed = true;
                        for (ProcurementOrderLI poli2 : lineItems) {
                            if (poli2.getPackedQty() < poli2.getPickedQty()) {
                                packed = false;
                            }
                        }
                        if (packed) {
                            procurementOrder.addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                                    ProcurementOrderStatusEnum.PACKED));
                        }
                        return em.merge(procurementOrder);
                    }
                }
            }
            throw new ProcurementOrderException(
                    "The product is not required in the order that you are picking");
        } else {
            throw new ProcurementOrderException("The order is not due for picking / packing.");
        }
    }

    @Override
    public ProcurementOrder shipProcurementOrder(Long id)
            throws IllegalPOModificationException, ProcurementOrderException {
        ProcurementOrder procurementOrder = getProcurementOrder(id);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.READY_FOR_SHIPPING) {
            throw new IllegalPOModificationException("Procurement Order is not ready.");
        }

        procurementOrder
                .addStatus(
                        new POStatus(procurementOrder.getLastActor(), new Date(), ProcurementOrderStatusEnum.SHIPPING));
        return updateProcurementOrder(procurementOrder);
    }

    @Override
    public ProcurementOrder shipMultipleProcurementOrder(Long id)
            throws IllegalPOModificationException, ProcurementOrderException {
        ProcurementOrder procurementOrder = getProcurementOrder(id);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.READY_FOR_SHIPPING) {
            throw new IllegalPOModificationException("Procurement Order is not ready.");
        }

        procurementOrder
                .addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                        ProcurementOrderStatusEnum.SHIPPING_MULTIPLE));
        return updateProcurementOrder(procurementOrder);
    }

    @Override
    public ProcurementOrder scanProductAtWarehouse(Long id, String rfidsku, int qty)
            throws ProductException, ProcurementOrderException {

        ProcurementOrder procurementOrder = getProcurementOrder(id);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.SHIPPING
                && procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.SHIPPING_MULTIPLE) {
            throw new ProcurementOrderException("Order does not need scanning.");
        }

        Product product = productService.getProduct(rfidsku);
        List<ProcurementOrderLI> lineItems = procurementOrder.getLineItems();

        for (ProcurementOrderLI poli : lineItems) {
            if (poli.getProduct().equals(product)) {
                poli.setReceivedQty(poli.getReceivedQty() + qty);

                boolean picked = true;
                for (ProcurementOrderLI poli2 : lineItems) {
                    if (poli2.getReceivedQty() != poli2.getPickedQty()) {
                        picked = false;
                    }
                }
                if (picked) {
                    procurementOrder.addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                            ProcurementOrderStatusEnum.COMPLETED));
                }

                try {
                    siteService.addProducts(procurementOrder.getWarehouse().getId(), poli.getProduct().getSku(), qty);
                } catch (NoStockLevelException e) {
                    e.printStackTrace();
                }
                return em.merge(procurementOrder);

            }
        }
        throw new ProcurementOrderException("The product scanned is not relevant to the Procurement Order");
    }

    @Override
    public ProcurementOrder adjustProductsAtWarehouse(Long id, String rfidsku, int qty)
            throws ProductException, ProcurementOrderException {

        ProcurementOrder procurementOrder = getProcurementOrder(id);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.SHIPPING
                && procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.SHIPPING_MULTIPLE) {
            throw new ProcurementOrderException("Order does not need inventory checking.");
        }

        Product product = productService.getProduct(rfidsku);
        List<ProcurementOrderLI> lineItems = procurementOrder.getLineItems();

        for (ProcurementOrderLI poli : lineItems) {
            if (poli.getProduct().equals(product)) {
                poli.setReceivedQty(qty);

                boolean picked = true;
                for (ProcurementOrderLI poli2 : lineItems) {
                    if (poli2.getReceivedQty() != poli2.getPickedQty()) {
                        picked = false;
                    }
                }
                if (picked) {
                    procurementOrder.addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                            ProcurementOrderStatusEnum.COMPLETED));
                }

                try {
                    siteService.addProducts(procurementOrder.getWarehouse().getId(), poli.getProduct().getSku(), qty);
                } catch (NoStockLevelException e) {
                    e.printStackTrace();
                }
                return em.merge(procurementOrder);

            }
        }
        throw new ProcurementOrderException("The product is not relevant to the Procurement Order");
    }

    @Override
    public ProcurementOrder completeProcurementOrder(Long id)
            throws IllegalPOModificationException, ProcurementOrderException {
        ProcurementOrder procurementOrder = getProcurementOrder(id);

        if (procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.SHIPPING
                && procurementOrder.getLastStatus() != ProcurementOrderStatusEnum.SHIPPING_MULTIPLE) {
            throw new IllegalPOModificationException("Procurement Order has not been received.");
        }
        procurementOrder
                .addStatus(new POStatus(procurementOrder.getLastActor(), new Date(),
                        ProcurementOrderStatusEnum.COMPLETED));

        return updateProcurementOrder(procurementOrder);
    }

    @Override
    public List<ProcurementOrder> getDailyProcurementOrders(Long siteId, Date date) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(date);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Date dateStart = cal.getTime();

        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date dateEnd = cal.getTime();

        TypedQuery<ProcurementOrder> q = em
                .createQuery(
                        "SELECT DISTINCT po FROM ProcurementOrder po left join po.statusHistory sh WHERE (po.manufacturing.id = :siteId OR po.headquarters.id = :siteId OR po.warehouse.id = :siteId) AND sh.timeStamp BETWEEN :start AND :end",
                        ProcurementOrder.class)
                .setParameter("siteId", siteId)
                .setParameter("start", dateStart)
                .setParameter("end", dateEnd);

        return q.getResultList();
    }
}
