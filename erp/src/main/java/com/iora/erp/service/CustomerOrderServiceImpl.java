package com.iora.erp.service;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Comparator;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.function.Consumer;
import java.util.stream.Collectors;
import java.util.stream.Stream;

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
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
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
        old.setProductItems(customerOrderLI.getProductItems());
        return em.merge(old);
    }

    @Override
    public List<List<CustomerOrderLI>> addToCustomerOrderLIs(List<CustomerOrderLI> lineItems, String rfid) {
        // Get Product Item
        ProductItem item = em.find(ProductItem.class, rfid);
        if (item == null) {
            return List.of(lineItems, new ArrayList<>());
        }
        // Check if Item is already inside
        if (lineItems.stream().flatMap(x -> x.getProductItems().stream())
                .anyMatch(x -> x.getRfid().equals(item.getRfid()))) {
            return List.of(lineItems, new ArrayList<>());
        }

        // Add ProductItem to Line Items and Get Set of Promotions
        Model mdl = em.find(Model.class, item.getProductSKU().split("-")[0]);
        boolean added = false;
        for (int i = 0; i < lineItems.size(); i++) {
            if (lineItems.get(i).getProductItems().get(0).getProductSKU().equals(item.getProductSKU())) {
                lineItems.get(i).addProductItem(item);
                lineItems.get(i).setSubTotal(lineItems.get(i).getSubTotal() + mdl.getDiscountPrice());
                added = true;
            }
        }
        if (!added) {
            CustomerOrderLI li = new CustomerOrderLI();
            li.setProductItems(List.of(item));
            li.setSubTotal(mdl.getDiscountPrice());
            lineItems.add(li);
        }

        List<Model> models = lineItems.stream().parallel()
                .map(x -> x.getProductItems().get(0).getProductSKU().split("-")[0])
                .map(x -> em.find(Model.class, x))
                .collect(Collectors.toList());
        List<ProductItem> items = lineItems.stream().parallel().flatMap(x -> x.getProductItems().stream())
                .collect(Collectors.toList());
        Set<PromotionField> promotions = new HashSet<>(
                em.createQuery("SELECT pf FROM PromotionField pf WHERE pf.global = TRUE", PromotionField.class)
                        .getResultList());
        for (Model m : models) {
            for (ProductField pf : m.getProductFields()) {
                if (pf instanceof PromotionField && ((PromotionField) pf).getAvailable()) {
                    promotions.add((PromotionField) pf);
                }
            }
        }
        Map<PromotionField, List<Model>> promotionsMap = new HashMap<>();
        promotions.forEach(x -> promotionsMap.put(x, new ArrayList<Model>()));
        models.forEach(m -> m.getProductFields().stream().parallel().filter(x -> (x instanceof PromotionField))
                .map(x -> (PromotionField) x).forEach(x -> promotionsMap.get(x).add(m)));

        List<CustomerOrderLI> newLineItems = new ArrayList<>(lineItems);
        List<CustomerOrderLI> promotionLIs = new ArrayList<>();

        // Useful Maps
        Map<ProductItem, Model> modelMap = new HashMap<>();
        Map<ProductItem, Double> prices = new HashMap<>();
        items.forEach(new Consumer<ProductItem>() {
            public void accept(ProductItem p) {
                Model m = models.stream().filter(mod -> mod.getModelCode().equals(p.getProductSKU().split("-")[0]))
                        .findFirst()
                        .get();
                modelMap.put(p, m);
                prices.put(p, m.getDiscountPrice());
            }
        });

        // Find best promotions of quota 1
        Map<ProductItem, PromotionLI> bestOnes = new HashMap<>();
        for (Map.Entry<PromotionField, List<Model>> entry : promotionsMap.entrySet()) {
            PromotionField pf = entry.getKey();
            if (pf.getQuota() != 1) {
                continue;
            }
            for (ProductItem p : items) {
                Model m = modelMap.get(p);
                Double newPrice = pf.getCoefficients().get(0) * m.getDiscountPrice() + pf.getConstants().get(0);
                Double discount = m.getDiscountPrice() - newPrice;
                if (!bestOnes.containsKey(p) || bestOnes.get(p).getSubTotal() > discount) {
                    PromotionLI pli = new PromotionLI(pf);
                    pli.setProductItems(List.of(p));
                    pli.setSubTotal(discount);
                    bestOnes.put(p, pli);
                    promotionLIs.add(pli);
                    prices.put(p, newPrice);
                }
            }
        }

        items.sort(new Comparator<ProductItem>() {
            public int compare(ProductItem p1, ProductItem p2) {
                double price1 = prices.get(p1);
                double price2 = prices.get(p2);
                return price2 > price1 ? -1 : 1;
            }
        });

        // Find best promotions with quota > 1
        for (Map.Entry<PromotionField, List<Model>> entry : promotionsMap.entrySet()) {
            PromotionField pf = entry.getKey();
            if (pf.getQuota() <= 1) {
                continue;
            }
            List<Model> promotionModels = entry.getValue();
            promotionModels.sort((x, y) -> (int) (100 * (y.getDiscountPrice() - x.getDiscountPrice())));

            // Sort Product Item by Curr Price
            List<ProductItem> applicableItems = items.stream().filter(p -> promotionModels.contains(modelMap.get(p)))
                    .collect(Collectors.toList());

            int pointer = 0;
            while (applicableItems.size() >= pointer + pf.getQuota()) {
                double origPrices = 0;
                double currPrices = 0;
                double newPrices = 0;
                List<ProductItem> usedOn = new ArrayList<>();
                for (int j = 0; j < pf.getQuota(); j++) {
                    ProductItem p = applicableItems.get(pointer + j);
                    Model m = modelMap.get(p);
                    origPrices += m.getDiscountPrice();
                    currPrices += prices.get(p);
                    newPrices += pf.getCoefficients().get(0) * m.getDiscountPrice() + pf.getConstants().get(0);
                    usedOn.add(p);
                }
                if (newPrices < currPrices) {
                    PromotionLI pli = new PromotionLI(pf);
                    pli.setProductItems(usedOn);
                    pli.setSubTotal(newPrices - origPrices);
                    for (int j = 0; j < pf.getQuota(); j++) {
                        ProductItem p = applicableItems.get(pointer + j);
                        promotionLIs.remove(bestOnes.get(p));
                        bestOnes.put(p, pli);
                    }
                    promotionLIs.add(pli);
                    pointer += pf.getQuota();
                } else {
                    pointer++;
                }
            }

        }

        return List.of(newLineItems, promotionLIs);
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
        old.setRefundedItem(refundLI.getRefundedItem());
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
