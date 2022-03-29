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
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.OnlineOrderStatusEnum;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.InsufficientPaymentException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.DeliveryAddress;
import com.iora.erp.model.customerOrder.ExchangeLI;
import com.iora.erp.model.customerOrder.OOStatus;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.customerOrder.Payment;
import com.iora.erp.model.customerOrder.PromotionLI;
import com.iora.erp.model.customerOrder.RefundLI;
import com.iora.erp.model.product.Model;
import com.iora.erp.model.product.Product;
import com.iora.erp.model.product.ProductField;
import com.iora.erp.model.product.ProductItem;
import com.iora.erp.model.product.PromotionField;
import com.iora.erp.model.site.Site;
import com.iora.erp.model.site.StockLevelLI;
import com.iora.erp.model.site.StoreSite;
import com.iora.erp.model.site.WarehouseSite;
import com.stripe.exception.StripeException;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service("customerOrderServiceImpl")
@Transactional
public class CustomerOrderServiceImpl implements CustomerOrderService {
    @Autowired
    private CustomerService customerService;
    @Autowired
    private ProductService productService;
    @Autowired
    private SiteService siteService;
    @Autowired
    private StripeService stripeService;
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
    public List<CustomerOrder> searchCustomerOrders(Long siteId, Long orderId) {
        TypedQuery<CustomerOrder> q;

        if (siteId == 0 && orderId == null) {
            q = em.createQuery("SELECT co FROM CustomerOrder co", CustomerOrder.class);
        } else if (siteId == 0) {
            q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.orderId LIKE :orderId", CustomerOrder.class);
            q.setParameter("orderId", orderId);
        } else if (orderId == null) {
            q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.site.id = :siteId", CustomerOrder.class);
            q.setParameter("siteId", siteId);
        } else {
            q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.site.id = :siteId AND co.id LIKE :orderId",
                    CustomerOrder.class);
            q.setParameter("siteId", siteId);
            q.setParameter("orderId", orderId);
        }

        return q.getResultList();
    }

    @Override
    public List<CustomerOrder> searchStoreOrders(Long siteId, Long orderId) {
        List<CustomerOrder> coList;
        TypedQuery<CustomerOrder> q;

        if (siteId == 0 && orderId == null) {
            q = em.createQuery("SELECT co FROM CustomerOrder co", CustomerOrder.class);
            coList = q.getResultList();
            coList.removeAll(searchOnlineOrders(0L, null));
        } else if (siteId == 0) {
            q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.orderId LIKE :orderId", CustomerOrder.class);
            q.setParameter("orderId", orderId);
            coList = q.getResultList();
            coList.removeAll(searchOnlineOrders(0L, orderId));
        } else if (orderId == null) {
            q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.site.id = :siteId", CustomerOrder.class);
            q.setParameter("siteId", siteId);
            coList = q.getResultList();
            coList.removeAll(searchOnlineOrders(siteId, null));
        } else {
            q = em.createQuery("SELECT co FROM CustomerOrder co WHERE co.site.id = :siteId AND co.id LIKE :orderId",
                    CustomerOrder.class);
            q.setParameter("siteId", siteId);
            q.setParameter("orderId", orderId);
            coList = q.getResultList();
            coList.removeAll(searchOnlineOrders(siteId, orderId));
        }

        return coList;
    }

    @Override
    public List<OnlineOrder> searchOnlineOrders(Long siteId, Long orderId) {
        TypedQuery<OnlineOrder> q;

        if (siteId == 0 && orderId == null) {
            q = em.createQuery("SELECT oo FROM OnlineOrder oo", OnlineOrder.class);
        } else if (siteId == 0) {
            q = em.createQuery("SELECT oo FROM OnlineOrder oo WHERE oo.id LIKE :orderId", OnlineOrder.class);
            q.setParameter("orderId", orderId);
        } else if (orderId == null) {
            q = em.createQuery("SELECT oo FROM OnlineOrder oo WHERE oo.site.id = :siteId", OnlineOrder.class);
            q.setParameter("siteId", siteId);
        } else {
            q = em.createQuery("SELECT oo FROM OnlineOrder oo WHERE oo.site.id = :siteId AND oo.id LIKE :orderId",
                    OnlineOrder.class);
            q.setParameter("siteId", siteId);
            q.setParameter("orderId", orderId);
        }

        return q.getResultList();
    }

    @Override
    public List<OnlineOrder> getPickupOrdersBySite(Long siteId) {
        TypedQuery<OnlineOrder> q = em.createQuery(
                "SELECT oo FROM OnlineOrder oo WHERE oo.pickupSite.id = :siteId AND oo.delivery = false",
                OnlineOrder.class);
        q.setParameter("siteId", siteId);

        return q.getResultList();
    }

    @Override
    public CustomerOrder createCustomerOrder(CustomerOrder customerOrder, String clientSecret)
            throws StripeException, InsufficientPaymentException, CustomerException {
        if (clientSecret != null && clientSecret != "") {
            stripeService.capturePayment(clientSecret);
        }
        if (customerOrder.getVoucher() != null) {
            customerService.redeemVoucher(customerOrder.getVoucher().getVoucherCode());
        }

        if (customerOrder instanceof OnlineOrder) {
            OnlineOrder oo = (OnlineOrder) customerOrder;
            DeliveryAddress da = oo.getDeliveryAddress();
            em.persist(da);
            oo.setDeliveryAddress(null);
            customerOrder = oo;
        }

        em.persist(customerOrder);
        return finaliseCustomerOrder(customerOrder);
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
    public CustomerOrder finaliseCustomerOrder(CustomerOrder customerOrder)
            throws InsufficientPaymentException, CustomerException {
        List<Payment> payments = customerOrder.getPayments();
        if (payments.stream().mapToDouble(x -> x.getAmount()).sum() < customerOrder.getTotalAmount()) {
            throw new InsufficientPaymentException("Insufficient Payment");
        }
        customerOrder.setPaid(true);

        if (customerOrder.getCustomerId() != null) {
            updateMembershipPoints(customerOrder);
        }

        // Remove stocks from site
        if (!(customerOrder instanceof OnlineOrder)) {
            for (CustomerOrderLI coli : customerOrder.getLineItems()) {
                try {
                    siteService.removeProducts(customerOrder.getSite().getId(), coli.getProduct().getSku(),
                            coli.getPackedQty());
                } catch (NoStockLevelException | IllegalTransferException e) {
                    e.printStackTrace();
                }
            }
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
    public List<CustomerOrderLI> addToCustomerOrderLIs(List<CustomerOrderLI> lineItems, String rfidsku)
            throws CustomerOrderException {
        // Get Product
        Product product = em.find(Product.class, rfidsku);
        ProductItem productItem = em.find(ProductItem.class, rfidsku);

        if (product == null && productItem == null) {
            throw new CustomerOrderException("Item scanned cannot be found.");
        } else if (product == null) {
            product = productItem.getProduct();
        }

        // Add ProductItem to Line Items
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
        return lineItems;
    }

    @Override
    public List<CustomerOrderLI> removeFromCustomerOrderLIs(List<CustomerOrderLI> lineItems, String rfidsku)
            throws CustomerOrderException {
        // Get Product
        Product product = em.find(Product.class, rfidsku);
        ProductItem productItem = em.find(ProductItem.class, rfidsku);

        if (product == null && productItem == null) {
            throw new CustomerOrderException("Item scanned cannot be found.");
        } else if (product == null) {
            product = productItem.getProduct();
        }

        // Remove ProductItem from Line Items
        Model mdl = em.find(Model.class, product.getSku().split("-")[0]);
        boolean removed = false;
        for (int i = 0; i < lineItems.size(); i++) {
            if (lineItems.get(i).getProduct().equals(product)) {
                if (lineItems.get(i).getQty() > 1) {
                    lineItems.get(i).setQty(lineItems.get(i).getQty() - 1);
                    lineItems.get(i).setSubTotal(lineItems.get(i).getSubTotal() - mdl.getDiscountPrice());
                } else {
                    lineItems.remove(i);
                }
                removed = true;
            }
        }
        if (!removed) {
            throw new CustomerOrderException("Item scanned cannot be removed.");
        }
        return lineItems;
    }

    @Override
    public List<List<CustomerOrderLI>> calculatePromotions(List<CustomerOrderLI> lineItems) {
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
        for (Map.Entry<CustomerOrderLI, PromotionField> entry : bestSinglePromos.entrySet()) {
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
    public ExchangeLI createExchangeLI(Long orderId, ExchangeLI exchangeLI) throws CustomerOrderException {
        CustomerOrder co = getCustomerOrder(orderId);
        Boolean exchangeable = false;

        List <CustomerOrderLI> colis = co.getLineItems();
        for (CustomerOrderLI coli : colis) {
            if (coli.getProduct().equals(exchangeLI.getOldItem())) {
                exchangeable = true;
                coli.setQty(coli.getQty() - 1);
                if (coli.getQty() == 0) {
                    colis.remove(coli);
                }
            }
        }

        if (!exchangeable) {
            throw new CustomerOrderException("Item to be exchanged is not in the customer order.");
        }

        em.persist(exchangeLI);
        co.addExchangedLI(exchangeLI);
        em.merge(co);
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
    public RefundLI createRefundLI(Long orderId, RefundLI refundLI) throws CustomerOrderException {
        CustomerOrder co = getCustomerOrder(orderId);
        Boolean refundable = false;

        List <CustomerOrderLI> colis = co.getLineItems();
        for (CustomerOrderLI coli : colis) {
            if (coli.getProduct().equals(refundLI.getProduct()) && coli.getQty() >= refundLI.getQty()) {
                refundable = true;
                coli.setQty(coli.getQty() - refundLI.getQty());
                if (coli.getQty() == 0) {
                    colis.remove(coli);
                }
            }
        }

        if (!refundable) {
            throw new CustomerOrderException("Item to be exchanged is not in the customer order.");
        }

        em.persist(refundLI);
        co.addRefundedLI(refundLI);
        em.merge(co);
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

        TypedQuery<CustomerOrder> q = em.createQuery(
                "SELECT o FROM CustomerOrder o WHERE o.customerId = :id AND o.dateTime >= :date", CustomerOrder.class);
        q.setParameter("id", customer.getId());
        q.setParameter("date", Timestamp.valueOf(LocalDateTime.now().minusYears(2)), TemporalType.TIMESTAMP);

        double spending = q.getResultList()
                .stream()
                .map(x -> x.getPayments())
                .map(x -> x.stream().mapToDouble(y -> y.getAmount()).sum())
                .collect(Collectors.summingDouble(Double::doubleValue));

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
        membershipPoints = membershipPoints
                + (int) (order.getTotalAmount() * bdayMultiplier * membershipTier.getMultiplier());
        customer.setMembershipPoints(membershipPoints);
    }

    /*
     * ---------------------------------------------------------
     * Online Order Statuses Methods
     * ---------------------------------------------------------
     */

    private OnlineOrder updateOnlineOrder(OnlineOrder onlineOrder) {
        Notification noti = new Notification("Online Order # " + onlineOrder.getId(),
                "Status has been updated to " + onlineOrder.getLastStatus().name() + ": "
                        + onlineOrder.getLastStatus().getDescription());

        onlineOrder.getSite().addNotification(noti);
        if (!onlineOrder.getDelivery() && !onlineOrder.getSite().equals(onlineOrder.getPickupSite())) {
            Site site2 = onlineOrder.getPickupSite();
            site2.addNotification(noti);
        }

        return em.merge(onlineOrder);
    }

    @Override
    public OnlineOrder createOnlineOrder(OnlineOrder onlineOrder, String clientSecret)
            throws StripeException, InsufficientPaymentException, CustomerException {
        if (clientSecret != null && clientSecret != "") {
            stripeService.capturePayment(clientSecret);
        }
        if (onlineOrder.getVoucher() != null) {
            customerService.redeemVoucher(onlineOrder.getVoucher().getVoucherCode());
        }
        if (onlineOrder.isDelivery()) {
            onlineOrder.setSite(siteService.getSite(3L));
        } else {
            boolean pickupSiteHasStock = true;
            Long pickupSiteId = onlineOrder.getPickupSite().getId();

            for (CustomerOrderLI coli : onlineOrder.getLineItems()) {
                StockLevelLI stoli = siteService.getStockLevelLI(pickupSiteId, coli.getProduct().getSku());
                if (stoli.getQty() < coli.getQty()) {
                    pickupSiteHasStock = false;
                }
            }

            if (pickupSiteHasStock) {
                onlineOrder.setSite(onlineOrder.getPickupSite());
            } else {
                onlineOrder.setSite(siteService.getSite(3L));
            }
        }

        onlineOrder.addStatusHistory(new OOStatus(siteService.getSite(3L), new Date(), OnlineOrderStatusEnum.PENDING));
        em.persist(onlineOrder);
        finaliseCustomerOrder(onlineOrder);

        onlineOrder.getSite().addNotification(new Notification("NEW Online Order # " + onlineOrder.getId(),
                "Status is " + onlineOrder.getLastStatus().name() + ": "
                        + onlineOrder.getLastStatus().getDescription()));

        return onlineOrder;
    }

    @Override
    public OnlineOrder cancelOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException {
        Site actionBy = em.find(Site.class, siteId);
        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        if (actionBy == null || !(actionBy instanceof WarehouseSite) || !(actionBy instanceof StoreSite)) {
            throw new CustomerOrderException("Site is not authorised to cancel the order.");
        } else if (actionBy instanceof WarehouseSite) {
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.CANCELLED));
        } else {
            onlineOrder.setSite(siteService.getSite(3L));
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.CANCELLED));
        }

        return updateOnlineOrder(onlineOrder);
    }

    @Override
    public OnlineOrder pickPackOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException {
        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);
        Site actionBy = em.find(Site.class, siteId);

        if (actionBy == null || (!actionBy.equals(onlineOrder.getSite())
                && siteId != onlineOrder.getPickupSite().getId())) {
            throw new CustomerOrderException("Site is unauthorised to pick/pack this order.");
        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PENDING) {
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.PICKING));
        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PICKING) {
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.PICKED));
        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PICKED) {
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.PACKING));
        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PACKING) {
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.PACKED));
        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PACKED) {
            if (onlineOrder.getSite().equals(onlineOrder.getPickupSite())) {
                onlineOrder.addStatusHistory(
                        new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.READY_FOR_COLLECTION));
            } else {

                onlineOrder.addStatusHistory(
                        new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.READY_FOR_DELIVERY));
            }
        }
        return updateOnlineOrder(onlineOrder);
    }

    @Override
    public OnlineOrder scanProduct(Long orderId, String rfidsku, int qty)
            throws CustomerOrderException, ProductException {

        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        Product product = productService.getProduct(rfidsku);
        List<CustomerOrderLI> lineItems = onlineOrder.getLineItems();

        if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PICKING) {
            for (CustomerOrderLI coli : lineItems) {
                if (coli.getProduct().equals(product)) {
                    coli.setPickedQty(coli.getPickedQty() + qty);
                    boolean picked = true;
                    for (CustomerOrderLI coli2 : lineItems) {
                        if (coli2.getPickedQty() < coli2.getQty()) {
                            picked = false;
                        }
                    }
                    if (picked) {
                        onlineOrder.addStatusHistory(
                                new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.PICKED));
                    }
                    return em.merge(onlineOrder);
                }
            }
            throw new CustomerOrderException("The product scanned is not required in the order that you are picking");

        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PACKING) {
            for (CustomerOrderLI coli : lineItems) {
                if (coli.getProduct().equals(product)) {
                    if (coli.getPackedQty() + qty > coli.getPickedQty()) {
                        throw new CustomerOrderException("You are packing items that are not meant for this order.");
                    } else {
                        coli.setPackedQty(coli.getPackedQty() + qty);

                        boolean packed = true;
                        for (CustomerOrderLI coli2 : lineItems) {
                            if (coli2.getPackedQty() < coli2.getPickedQty()) {
                                packed = false;
                            }
                        }
                        if (packed) {
                            onlineOrder.addStatusHistory(
                                    new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.PACKED));
                        }
                        return em.merge(onlineOrder);
                    }
                }
            }
            throw new CustomerOrderException("The product scanned is not required in the order that you are picking");
        } else {
            throw new CustomerOrderException("The order is not due for picking / packing.");
        }
    }

    @Override
    public OnlineOrder deliverOnlineOrder(Long orderId) throws CustomerOrderException {
        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.READY_FOR_DELIVERY) {
            onlineOrder.addStatusHistory(
                    new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.DELIVERING));
        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.DELIVERING) {
            onlineOrder.addStatusHistory(
                    new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.DELIVERED));
        } else {
            throw new CustomerOrderException("Order is not up for delivery.");
        }

        // Remove stocks from site
        for (CustomerOrderLI ooli : onlineOrder.getLineItems()) {
            try {
                siteService.removeProducts(onlineOrder.getSite().getId(), ooli.getProduct().getSku(),
                        ooli.getPackedQty());
            } catch (NoStockLevelException | IllegalTransferException e) {
                e.printStackTrace();
            }
        }

        return updateOnlineOrder(onlineOrder);
    }

    @Override
    public OnlineOrder deliverMultipleOnlineOrder(Long orderId) throws CustomerOrderException {
        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.READY_FOR_DELIVERY) {
            onlineOrder.addStatusHistory(
                    new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.DELIVERING_MULTIPLE));
        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.DELIVERING_MULTIPLE) {
            onlineOrder.addStatusHistory(
                    new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.DELIVERED));
        } else {
            throw new CustomerOrderException("Order is not up for delivery.");
        }

        // Remove stocks from site
        for (CustomerOrderLI ooli : onlineOrder.getLineItems()) {
            try {
                siteService.removeProducts(onlineOrder.getSite().getId(), ooli.getProduct().getSku(),
                        ooli.getPackedQty());
            } catch (NoStockLevelException | IllegalTransferException e) {
                e.printStackTrace();
            }
        }

        return updateOnlineOrder(onlineOrder);
    }

    // Only for self-pickup order
    @Override
    public OnlineOrder receiveOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException {
        Site actionBy = em.find(Site.class, siteId);
        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        if (actionBy == null || !actionBy.equals(onlineOrder.getPickupSite())) {
            throw new CustomerOrderException("Site is not supposed to be receiving this order.");
        } else if (onlineOrder.getLastStatus() != OnlineOrderStatusEnum.DELIVERING
                && onlineOrder.getLastStatus() != OnlineOrderStatusEnum.DELIVERING_MULTIPLE) {
            throw new CustomerOrderException("Order is not ready for delivery.");
        }

        onlineOrder.addStatusHistory(
                new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.READY_FOR_COLLECTION));
        return updateOnlineOrder(onlineOrder);
    }

    @Override
    public OnlineOrder collectOnlineOrder(Long orderId) throws CustomerOrderException {
        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        if (onlineOrder.getLastStatus() != OnlineOrderStatusEnum.READY_FOR_COLLECTION) {
            throw new CustomerOrderException("Order is not ready for collection.");
        }

        onlineOrder.addStatusHistory(
                new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.COLLECTED));

        // Remove stocks from site
        if (onlineOrder.getSite().equals(onlineOrder.getPickupSite())) {
            for (CustomerOrderLI ooli : onlineOrder.getLineItems()) {
                try {
                    siteService.removeProducts(onlineOrder.getSite().getId(), ooli.getProduct().getSku(),
                            ooli.getPackedQty());
                } catch (NoStockLevelException | IllegalTransferException e) {
                    e.printStackTrace();
                }
            }
        }

        return updateOnlineOrder(onlineOrder);
    }
}