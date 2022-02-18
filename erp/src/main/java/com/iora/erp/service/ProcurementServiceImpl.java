package com.iora.erp.service;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;

import com.iora.erp.model.procurementOrder.ProcurementOrder;
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
    public void createProcurementOrder(ProcurementOrder procurementOrder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void updateProcurementOrder(ProcurementOrder procurementOrder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void deleteProcurementOrder(Long id) {
        // TODO Auto-generated method stub

    }

    @Override
    public void cancelProcurementOrder(Long id) {
        // TODO Auto-generated method stub

    }

    @Override
    public void fulfilProcurementOrder(ProcurementOrder procurementOrder) {
        // TODO Auto-generated method stub

    }

    @Override
    public void verifyProcurementOrder(ProcurementOrder procurementOrder) {
        // TODO Auto-generated method stub

    }

}
