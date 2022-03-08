package com.iora.erp.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.InsufficientPaymentException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.PromotionLI;
import com.iora.erp.model.customerOrder.RefundLI;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.PromotionField;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("customerOrderServiceImpl")
@Transactional
public class CustomerOrderServiceImpl implements CustomerOrderService {
    @Autowired
    CustomerService customerService;
    @PersistenceContext
    private EntityManager em;

    @Override
    public CustomerOrder getCustomerOrder(Long id) throws CustomerOrderException {
        CustomerOrder customerOrder = em.find(CustomerOrder.class, id);

        if (customerOrder == null) {
            throw new CustomerOrderException("CustomerOrder with id " + id + " cannot be found.");
        } else {
            return customerOrder;
        }
    }

    @Override
    public List<CustomerOrder> searchCustomerOrders(String id) {
        TypedQuery<CustomerOrder> q;
        if (id != null) {
            q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.id LIKE :id", CustomerOrder.class);
            q.setParameter("id", "%" + Long.parseLong(id) + "%");
        } else {
            q = em.createQuery("SELECT co FROM CustomerOrder co", CustomerOrder.class);
        }

        return q.getResultList();
    }

    @Override
    public List<OnlineOrder> getAllOnlineOrders() {
        TypedQuery<OnlineOrder> q = em.createQuery("SELECT oo FROM OnlineOrder oo", OnlineOrder.class);
        return q.getResultList();
    }

    @Override
    public List<OnlineOrder> getOnlineOrdersBySite(Long siteId) {
        TypedQuery<OnlineOrder> q = em.createQuery("SELECT oo FROM OnlineOrder oo WHERE oo.onlineStoreSiteId = :siteId",
                OnlineOrder.class);
        q.setParameter("siteId", siteId);
        return q.getResultList();
    }

    // Not working yet
    @Override
    public List<OnlineOrder> getOnlineOrdersBySiteDate(Long siteId, String date) {
        TypedQuery<OnlineOrder> q = em.createQuery(
                "SELECT oo FROM OnlineOrder oo WHERE oo.storeSiteId = :siteId AND SUBSTRING(oo.dateTime, 0, 10) = :date",
                OnlineOrder.class);
        q.setParameter("siteId", siteId);
        q.setParameter("date", date);
        return q.getResultList();
    }

    @Override
    public List<CustomerOrder> getAllInStoreOrders() {
        TypedQuery<CustomerOrder> q = em.createQuery("SELECT co FROM CustomerOrder co", CustomerOrder.class);
        List<CustomerOrder> customerOrders = q.getResultList();

        customerOrders.removeAll(getAllOnlineOrders());

        return customerOrders;
    }

    @Override
    public List<CustomerOrder> getInStoreOrdersBySite(Long siteId) {
        TypedQuery<CustomerOrder> q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.storeSiteId = :siteId",
                CustomerOrder.class);
        q.setParameter("siteId", siteId);
        return q.getResultList();
    }

    // Not working yet
    @Override
    public List<CustomerOrder> getInStoreOrdersBySiteDate(Long siteId, String date) {
        TypedQuery<CustomerOrder> q = em.createQuery(
                "SELECT co FROM CustomerOrder co WHERE co.storeSiteId = :siteId AND SUBSTRING(co.dateTime, 0, 10) = :date",
                CustomerOrder.class);
        q.setParameter("siteId", siteId);
        q.setParameter("date", date);
        return q.getResultList();
    }

    @Override
    public CustomerOrder createCustomerOrder(CustomerOrder customerOrder) {
        customerOrder.setPaid(false);
        em.persist(customerOrder);
        return customerOrder;
    }

    @Override
    public CustomerOrder updateCustomerOrder(CustomerOrder customerOrder) throws CustomerOrderException {
        CustomerOrder old = getCustomerOrder(customerOrder.getId());
        old.setDateTime(customerOrder.getDateTime());
        old.setLineItems(customerOrder.getLineItems());
        old.setExchangedLIs(customerOrder.getExchangedLIs());
        old.setRefundedLIs(customerOrder.getRefundedLIs());
        return em.merge(old);
    }

    @Override
    public CustomerOrder finaliseCustomerOrder(CustomerOrder customerOrder, List<Payment> payments)
            throws CustomerOrderException, InsufficientPaymentException {
        CustomerOrder old = getCustomerOrder(customerOrder.getId());
        if (payments.stream().mapToDouble(x -> x.getAmount()).sum() < old.getTotalAmount()) {
            throw new InsufficientPaymentException("Insufficient Payment");
        }
        old.setPaid(true);
        old.setPayments(payments);
        try {
            updateMembershipPoints(old);
        } catch (CustomerException e) {
            old.setCustomerId(null);
        }
        return em.merge(customerOrder);
    }

    @Override
    public CustomerOrderLI getCustomerOrderLI(Long id) throws CustomerOrderException {
        CustomerOrderLI customerOrderLI = em.find(CustomerOrderLI.class, id);

        if (customerOrderLI == null) {
            throw new CustomerOrderException("CustomerOrder LineItem with id " + id + " cannot be found.");
        } else {
            return customerOrderLI;
        }
    }

    @Override
    public List<CustomerOrderLI> getCustomerOrderLIs(CustomerOrder customerOrder) {
        return customerOrder.getLineItems();
    }

    @Override
    public CustomerOrderLI createCustomerOrderLI(CustomerOrderLI customerOrderLI) {
        em.persist(customerOrderLI);
        return customerOrderLI;
    }

    @Override
    public CustomerOrderLI updateCustomerOrderLI(CustomerOrderLI customerOrderLI) throws CustomerOrderException {
        CustomerOrderLI old = getCustomerOrderLI(customerOrderLI.getId());
        old.setProduct(customerOrderLI.getProduct());
        old.setQty(customerOrderLI.getQty());
        old.setSubTotal(customerOrderLI.getSubTotal());
        return em.merge(old);
    }

    @Override
    public List<List<CustomerOrderLI>> addToCustomerOrderLIs(List<CustomerOrderLI> lineItems, String sku) {
        // Get Product
        Product product = em.find(Product.class, sku);

        if (product == null) {
            return List.of(lineItems, new ArrayList<>());
        }

        // Add ProductItem to Line Items and Get Set of Promotions
        Model mdl = em.find(Model.class, product.getSku().split("-")[0]);
        boolean added = false;
        for (int i = 0; i < lineItems.size(); i++) {
            if (lineItems.get(i).getProduct().equals(product)) {
                lineItems.get(i).setQty(lineItems.get(i).getQty() + 1);
                lineItems.get(i).setSubTotal(lineItems.get(i).getSubTotal() + mdl.getDiscountPrice());
                added = true;
            }
        }
        if (!added) {
            CustomerOrderLI li = new CustomerOrderLI();
            li.setProduct(product);
            li.setQty(1);
            li.setSubTotal(mdl.getDiscountPrice());
            lineItems.add(li);
        }

        List<CustomerOrderLI> newLineItems = new ArrayList<>(lineItems);

        // Map for Line Item to Model
        Map<CustomerOrderLI, Model> modelMap = new HashMap<>();
        Map<CustomerOrderLI, PromotionField> bestSinglePromos = new HashMap<>();
        Map<CustomerOrderLI, Integer> bestSinglePromosUsed = new HashMap<>();
        Map<CustomerOrderLI, Double> bestPrices = new HashMap<>();
        Map<CustomerOrderLI, Double> bestDiscounts = new HashMap<>();
        List<PromotionLI> bestMultiPromosUsed = new ArrayList<>();

        for (CustomerOrderLI coli : lineItems) {
            Model m = em.find(Model.class, coli.getProduct().getSku().split("-")[0]);
            modelMap.put(coli, m);
            bestPrices.put(coli, m.getDiscountPrice());
        }

        // Get all possible promotions
        Set<PromotionField> promotions = new HashSet<>(
                em.createQuery("SELECT pf FROM PromotionField pf WHERE pf.global = TRUE", PromotionField.class)
                        .getResultList());
        for (CustomerOrderLI coli : lineItems) {
            Model m = modelMap.get(coli);
            // Get best possible single promotion
            Set<PromotionField> singlePromotionsSet = new HashSet<>(promotions);
            for (ProductField pf : m.getProductFields()) {
                if (pf instanceof PromotionField && ((PromotionField) pf).getAvailable()
                        && ((PromotionField) pf).getQuota() == 1) {
                    promotions.add((PromotionField) pf);
                }
            }

            // Find best possible single promotion
            PromotionField bestPf = null;
            Double bestPrice = m.getDiscountPrice();
            Double bestDiscount = 0.0;
            List<PromotionField> singlePromotionsList = new ArrayList<>(singlePromotionsSet);
            for (PromotionField pf : singlePromotionsList) {
                Double newPrice = pf.getCoefficients().get(0) * m.getDiscountPrice() + pf.getConstants().get(0);
                if (newPrice < bestPrice) {
                    bestPf = pf;
                    bestPrice = newPrice;
                    bestDiscount = m.getDiscountPrice() - newPrice;
                }
            }

            if (bestPf != null) {
                bestPrices.put(coli, bestPrice);
                bestDiscounts.put(coli, bestDiscount);
                bestSinglePromos.put(coli, bestPf);
                bestSinglePromosUsed.put(coli, coli.getQty());
            }
        }

        // Get all possible multi-item promotions
        Map<PromotionField, List<CustomerOrderLI>> multiPromotionsMap = new HashMap<>();
        for (CustomerOrderLI coli : lineItems) {
            Model m = modelMap.get(coli);
            for (ProductField pf : m.getProductFields()) {
                if (pf instanceof PromotionField && ((PromotionField) pf).getAvailable()
                        && ((PromotionField) pf).getQuota() > 1) {
                    PromotionField prf = (PromotionField) pf;
                    if (!multiPromotionsMap.containsKey(prf)) {
                        multiPromotionsMap.put(prf, new ArrayList<>());
                    }
                    multiPromotionsMap.get(prf).add(coli);
                }
            }
        }

        for (Map.Entry<PromotionField, List<CustomerOrderLI>> entry : multiPromotionsMap.entrySet()) {
            PromotionField pf = entry.getKey();
            List<CustomerOrderLI> priceDesc = entry.getValue();
            priceDesc
                    .sort((x, y) -> (modelMap.get(y).getDiscountPrice() > modelMap.get(x).getDiscountPrice() ? -1 : 1));

            List<CustomerOrderLI> lineItemRef = new ArrayList<>();
            for (CustomerOrderLI coli : priceDesc) {
                for (int i = 0; i < coli.getQty(); i++) {
                    lineItemRef.add(coli);
                }
            }

            int pointer = 0;
            while (lineItemRef.size() >= pf.getQuota() + pointer) {
                double origPrices = 0;
                double currPrices = 0;
                double newPrices = 0;
                for (int j = 0; j < pf.getQuota(); j++) {
                    CustomerOrderLI coli = lineItemRef.get(j + pointer);
                    Model m = modelMap.get(coli);
                    origPrices += m.getDiscountPrice();
                    currPrices += bestPrices.get(coli);
                    newPrices += pf.getCoefficients().get(j) * m.getDiscountPrice() + pf.getConstants().get(j);
                }
                if (newPrices < currPrices) {
                    PromotionLI pli = new PromotionLI(pf);
                    pli.setQty(1);
                    pli.setProduct(lineItemRef.get(pointer).getProduct());
                    pli.setSubTotal(newPrices - origPrices);
                    for (int j = 0; j < pf.getQuota(); j++) {
                        CustomerOrderLI coli = lineItemRef.get(j + pointer);
                        if (bestSinglePromosUsed.containsKey(coli)) {
                            bestSinglePromosUsed.put(coli, bestSinglePromosUsed.get(coli) - 1);
                        }
                    }
                    bestMultiPromosUsed.add(pli);
                    pointer += pf.getQuota();
                } else {
                    pointer++;
                }
            }
        }

        List<CustomerOrderLI> promotionList = new ArrayList<CustomerOrderLI>();
        for(Map.Entry<CustomerOrderLI,PromotionField> entry : bestSinglePromos.entrySet()) {
            CustomerOrderLI coli = entry.getKey();
            if (bestSinglePromosUsed.get(coli) > 0) {
                PromotionLI pli = new PromotionLI(entry.getValue());
                pli.setQty(bestSinglePromosUsed.get(coli));
                pli.setSubTotal(modelMap.get(coli).getDiscountPrice() - bestPrices.get(coli));
                pli.setProduct(coli.getProduct());
                promotionList.add(pli);
            }
        }
        for (PromotionLI multiPromo : bestMultiPromosUsed) {
            promotionList.add(multiPromo);
        }
        return List.of(newLineItems, promotionList);
    }

    @Override
    public Payment getPayment(Long id) throws CustomerOrderException {
        Payment payment = em.find(Payment.class, id);

        if (payment == null) {
            throw new CustomerOrderException("Payment with id " + id + " cannot be found.");
        } else {
            return payment;
        }
    }

    @Override
    public List<Payment> getAllPayments() {
        TypedQuery<Payment> q = em.createQuery("SELECT p FROM Payment p", Payment.class);
        return q.getResultList();
    }

    @Override
    public Payment createPayment(Payment payment) {
        em.persist(payment);
        return payment;
    }

    @Override
    public Payment updatePayment(Payment payment) throws CustomerOrderException {
        Payment old = getPayment(payment.getId());
        old.setAmount(payment.getAmount());
        old.setCcTransactionId(payment.getCcTransactionId());
        old.setDateTime(payment.getDateTime());
        return em.merge(old);
    }

    @Override
    public ExchangeLI getExchangeLI(Long id) throws CustomerOrderException {
        ExchangeLI exchangeLI = em.find(ExchangeLI.class, id);

        if (exchangeLI == null) {
            throw new CustomerOrderException("Echange Line Item with id " + id + " cannot be found.");
        } else {
            return exchangeLI;
        }
    }

    @Override
    public List<ExchangeLI> getAllExchangeLIs() {
        TypedQuery<ExchangeLI> q = em.createQuery("SELECT eLI FROM ExchangeLI eLI", ExchangeLI.class);
        return q.getResultList();
    }

    @Override
    public ExchangeLI createExchangeLI(ExchangeLI exchangeLI) {
        em.persist(exchangeLI);
        return exchangeLI;
    }

    @Override
    public ExchangeLI updateExchangeLI(ExchangeLI exchangeLI) throws CustomerOrderException {
        ExchangeLI old = getExchangeLI(exchangeLI.getId());
        old.setNewItem(exchangeLI.getNewItem());
        old.setOldItem(exchangeLI.getOldItem());
        return em.merge(old);
    }

    @Override
    public RefundLI getRefundLI(Long id) throws CustomerOrderException {
        RefundLI refundLI = em.find(RefundLI.class, id);

        if (refundLI == null) {
            throw new CustomerOrderException("Refund Line Item with id " + id + " cannot be found.");
        } else {
            return refundLI;
        }
    }

    @Override
    public List<RefundLI> getAllRefundLIs() {
        TypedQuery<RefundLI> q = em.createQuery("SELECT rLI FROM RefundLI rLI", RefundLI.class);
        return q.getResultList();
    }

    @Override
    public RefundLI createRefundLI(RefundLI refundLI) {
        em.persist(refundLI);
        return refundLI;
    }

    @Override
    public RefundLI updateRefundLI(RefundLI refundLI) throws CustomerOrderException {
        RefundLI old = getRefundLI(refundLI.getId());
        old.setProduct(refundLI.getProduct());
        return em.merge(old);
    }

    // Helper methods

    // amount added to payments
    public void updateMembershipPoints(CustomerOrder order) throws CustomerException {
        Customer customer = customerService.getCustomerById(order.getCustomerId());

        Double spending = em
                .createQuery("SELECT o.payments FROM CustomerOrder o WHERE o.customer.id = :id AND o.dateTime >= :date",
                        Payment.class)
                .setParameter("id", customer.getId())
                .setParameter("date", Timestamp.valueOf(LocalDateTime.now().minusYears(2)), TemporalType.TIMESTAMP)
                .getResultList()
                .stream()
                .mapToDouble(x -> x.getAmount())
                .sum();
        List<MembershipTier> tiers = em
                .createQuery("SELECT m FROM MembershipTier m ORDER BY m.multiplier ASC", MembershipTier.class)
                .getResultList();
        MembershipTier membershipTier = tiers.get(0);
        for (MembershipTier tier : tiers) {
            if (spending > tier.getMinSpend()) {
                membershipTier = tier;
            }
        }
        customer.setMembershipTier(membershipTier);

        double bdayMultiplier = 1;
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        Calendar cal = Calendar.getInstance();
        cal.setTime(Date.from(customer.getDob().atStartOfDay()
                .atZone(ZoneId.systemDefault())
                .toInstant()));
        if (currentMonth == cal.get(Calendar.MONTH)) {
            Integer ordersThisMonth = em
                    .createQuery("SELECT o FROM CustomerOrder o WHERE o.customer.id = :id AND o.dateTime >= :date",
                            CustomerOrder.class)
                    .setParameter("id", customer.getId())
                    .setParameter("date",
                            Timestamp.valueOf(LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth())),
                            TemporalType.TIMESTAMP)
                    .getResultList()
                    .size();
            if (ordersThisMonth == 0) {
                bdayMultiplier = membershipTier.getBirthday().getMultiplier();
            }
        }
        Integer membershipPoints = customer.getMembershipPoints();
        membershipPoints = Integer.sum(membershipPoints,
                (int) (order.getTotalAmount() * bdayMultiplier * membershipTier.getMultiplier()));
        customer.setMembershipPoints(membershipPoints);
    }

}
