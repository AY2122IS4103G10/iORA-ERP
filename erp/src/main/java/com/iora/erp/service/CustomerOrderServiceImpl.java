package com.iora.erp.service;

import java.math.BigInteger;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.temporal.TemporalAdjusters;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.GregorianCalendar;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.persistence.TemporalType;
import javax.persistence.TypedQuery;

import com.iora.erp.enumeration.CountryEnum;
import com.iora.erp.enumeration.OnlineOrderStatusEnum;
import com.iora.erp.enumeration.ParcelSizeEnum;
import com.iora.erp.enumeration.PaymentTypeEnum;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.IllegalTransferException;
import com.iora.erp.exception.InsufficientPaymentException;
import com.iora.erp.exception.ModelException;
import com.iora.erp.exception.NoStockLevelException;
import com.iora.erp.exception.ProductException;
import com.iora.erp.model.company.Address;
import com.iora.erp.model.company.Notification;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customer.MembershipTier;
import com.iora.erp.model.customer.Voucher;
import com.iora.erp.model.customerOrder.CustomerOrder;
import com.iora.erp.model.customerOrder.CustomerOrderLI;
import com.iora.erp.model.customerOrder.Delivery;
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
    @Autowired
    private EmailService emailService;
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
    public List<OnlineOrder> getOnlineOrdersOfSite(Site site) {
        return em
                .createQuery("SELECT oo FROM OnlineOrder oo WHERE oo.site = :site OR oo.pickupSite = :site",
                        OnlineOrder.class)
                .setParameter("site", site)
                .getResultList();
    }

    @Override
    public List<OnlineOrder> getOnlineOrdersByStatus(String status) {
        List<OnlineOrder> oOrders = new ArrayList<>();
        for (OnlineOrder oo : searchOnlineOrders(0L, null)) {
            if (oo.getLastStatus() == OnlineOrderStatusEnum.valueOf(status.toUpperCase())) {
                oOrders.add(oo);
            }
        }
        return oOrders;
    }

    @Override
    public List<OnlineOrder> getOOBySiteStatus(Long siteId, String status) throws CustomerOrderException {
        Site site = em.find(Site.class, siteId);
        if (site == null) {
            throw new CustomerOrderException("Site cannot be found.");
        }

        List<OnlineOrder> deliveries = new ArrayList<>();

        for (OnlineOrder oo : getOnlineOrdersOfSite(site)) {
            if (oo.getLastStatus() == OnlineOrderStatusEnum.valueOf(status.toUpperCase())) {
                deliveries.add(oo);
            }
        }

        return deliveries;
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
        // Customer is not a member
        if (customerOrder.getCustomerId() == null) {

            if (customerOrder.getVoucher() != null) {
                Voucher v = customerService.getVoucher(customerOrder.getVoucher().getVoucherCode());
                if (v.getCustomerId() != null) {
                    throw new CustomerException("Voucher belongs to an existing member.");
                } else {
                    customerService.redeemVoucher(v.getVoucherCode());
                }
            }

            if (clientSecret != null && clientSecret != "") {
                stripeService.capturePayment(clientSecret);
            }
        } else {

            // Customer is a member
            Customer c = customerService.getCustomerById(customerOrder.getCustomerId());
            if (customerOrder.getVoucher() != null) {
                Voucher v;
                try {
                    v = customerService.getVoucher(customerOrder.getVoucher().getVoucherCode());
                    if (v.getCustomerId() != c.getId()) {
                        throw new CustomerException("Customer is not entitled to this voucher.");
                    }
                    customerService.redeemVoucher(v.getVoucherCode());
                } catch (CustomerException ex) {
                    v = customerOrder.getVoucher();
                    if (v.getAmount() > c.getMembershipPoints()) {
                        throw new CustomerException(
                                "Customer does not have enough points for the membership points redemption.");
                    }
                    v = new Voucher(v.getCampaign(), v.getAmount(), new Date(System.currentTimeMillis() + 86400000));
                    v.setCustomerOrder(customerOrder);
                    v.setIssued(true);
                    v.setRedeemed(true);
                    em.persist(v);
                    customerOrder.setVoucher(v);
                }
            }
            if (clientSecret != null && clientSecret != "") {
                stripeService.capturePayment(clientSecret);
            }
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

        if (customerOrder.getCustomerId() != null) {
            addMembershipPoints(customerOrder);
        }

        // Remove stocks from site
        if (!(customerOrder instanceof OnlineOrder)) {
            for (CustomerOrderLI coli : customerOrder.getLineItems()) {
                try {
                    siteService.removeProducts(customerOrder.getSite().getId(), coli.getProduct().getSku(),
                            coli.getQty());
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
    public CustomerOrderLI createCustomerOrderLI(CustomerOrderLI customerOrderLI) throws ModelException {
        customerOrderLI.setSubTotal(customerOrderLI.getQty()
                * productService.getModelByProduct(customerOrderLI.getProduct()).getDiscountPrice());
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
        Product product = em.find(Product.class, rfidsku);
        ProductItem productItem = em.find(ProductItem.class, rfidsku);

        if (product == null && productItem == null) {
            throw new CustomerOrderException("Item scanned cannot be found.");
        } else if (product == null) {
            product = productItem.getProduct();
        }

        String sku = product.getSku();
        String model = sku.substring(0, sku.lastIndexOf("-"));
        Model mdl = em.find(Model.class, model.trim());
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
        Product product = em.find(Product.class, rfidsku);
        ProductItem productItem = em.find(ProductItem.class, rfidsku);

        if (product == null && productItem == null) {
            throw new CustomerOrderException("Item scanned cannot be found.");
        } else if (product == null) {
            product = productItem.getProduct();
        }

        String sku = product.getSku();
        String model = sku.substring(0, sku.lastIndexOf("-"));
        Model mdl = em.find(Model.class, model.trim());
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
            String sku = coli.getProduct().getSku();
            String model = sku.substring(0, sku.lastIndexOf("-"));
            Model m = em.find(Model.class, model.trim());
            modelMap.put(coli, m);
            bestPrices.put(coli, m.getDiscountPrice());
        }

        // Get all possible promotions
        Set<PromotionField> promotions = new HashSet<>(
                em.createQuery("SELECT pf FROM PromotionField pf WHERE pf.global = TRUE AND pf.available = true",
                        PromotionField.class)
                        .getResultList());
        for (CustomerOrderLI coli : lineItems) {
            Model m = modelMap.get(coli);
            // Get best possible single promotion
            Set<PromotionField> singlePromotionsSet = new HashSet<>(promotions);
            for (ProductField pf : m.getProductFields()) {
                if (pf instanceof PromotionField && ((PromotionField) pf).getAvailable()
                        && ((PromotionField) pf).getQuota() == 1) {
                    singlePromotionsSet.add((PromotionField) pf);
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
                    bestDiscount = newPrice - m.getDiscountPrice();
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
                Integer qtyToAdd = bestSinglePromosUsed.get(coli);
                PromotionLI pli = new PromotionLI(entry.getValue());
                pli.setQty(bestSinglePromosUsed.get(coli));
                pli.setSubTotal(qtyToAdd * (bestPrices.get(coli) - modelMap.get(coli).getDiscountPrice()));
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

        List<CustomerOrderLI> colis = co.getLineItems();
        for (CustomerOrderLI coli : colis) {
            if (coli.getProduct().equals(exchangeLI.getOldItem()) && coli.getQty() > 0) {
                exchangeable = true;
                coli.setQty(coli.getQty() - 1);
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
    public RefundLI createRefundLI(Long orderId, RefundLI refundLI, Double refundAmount) throws CustomerOrderException {
        try {
            CustomerOrder co = getCustomerOrder(orderId);
            Customer c = customerService.getCustomerById(co.getCustomerId());
            Boolean refundable = false;

            List<CustomerOrderLI> colis = co.getLineItems();
            for (CustomerOrderLI coli : colis) {
                if (coli.getProduct().equals(refundLI.getProduct()) && coli.getQty() >= refundLI.getQty()) {
                    refundable = true;
                    coli.setQty(coli.getQty() - refundLI.getQty());
                    revertMembershipPoints(c, refundAmount);
                    em.merge(c);
                    break;
                }
            }

            if (!refundable) {
                throw new CustomerOrderException("Item to be refunded is not in the customer order.");
            }

            for (Payment p : co.getPayments()) {
                if (p.getPaymentType() == PaymentTypeEnum.MASTERCARD || p.getPaymentType() == PaymentTypeEnum.VISA
                        || p.getPaymentType() == PaymentTypeEnum.NETS) {
                    stripeService.refundPayment(p.getCcTransactionId(), Math.min(refundAmount, p.getAmount()));

                    if (refundAmount > p.getAmount()) {
                        c.setMembershipPoints(c.getMembershipPoints() + (refundAmount - p.getAmount()));
                        p.setAmount(0);
                    } else {
                        p.setAmount(p.getAmount() - refundAmount);
                    }
                }
            }

            em.persist(refundLI);
            co.addRefundedLI(refundLI);
            em.merge(co);
            return refundLI;
        } catch (Exception ex) {
            ex.printStackTrace();
            throw new CustomerOrderException(ex.getMessage());
        }
    }

    @Override
    public RefundLI updateRefundLI(RefundLI refundLI) throws CustomerOrderException {
        RefundLI old = getRefundLI(refundLI.getId());
        old.setProduct(refundLI.getProduct());
        return em.merge(old);
    }

    // Helper methods
    public void addMembershipPoints(CustomerOrder order) throws CustomerException {
        Customer customer = customerService.getCustomerById(order.getCustomerId());

        double spending = getCurrentSpending(customer.getId());

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
        cal.setTime(customer.getDob());
        if (currentMonth == cal.get(Calendar.MONTH)) {
            Integer ordersThisMonth = em
                    .createQuery("SELECT o FROM CustomerOrder o WHERE o.customerId = :id AND o.dateTime >= :date",
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

        Double membershipPoints = customer.getMembershipPoints()
                + order.getTotalAmount() * bdayMultiplier * membershipTier.getMultiplier();
        customer.setMembershipPoints(membershipPoints);
        em.merge(customer);
    }

    private void revertMembershipPoints(Customer customer, Double refundAmount) {
        MembershipTier mt = customer.getMembershipTier();

        double bdayMultiplier = 1;
        int currentMonth = Calendar.getInstance().get(Calendar.MONTH);
        Calendar cal = Calendar.getInstance();
        cal.setTime(customer.getDob());
        if (currentMonth == cal.get(Calendar.MONTH)) {
            Integer ordersThisMonth = em
                    .createQuery("SELECT o FROM CustomerOrder o WHERE o.customerId = :id AND o.dateTime >= :date",
                            CustomerOrder.class)
                    .setParameter("id", customer.getId())
                    .setParameter("date",
                            Timestamp.valueOf(LocalDateTime.now().with(TemporalAdjusters.firstDayOfMonth())),
                            TemporalType.TIMESTAMP)
                    .getResultList()
                    .size();
            if (ordersThisMonth == 0) {
                bdayMultiplier = mt.getBirthday().getMultiplier();
            }
        }

        Double pointsToDeduct = refundAmount * bdayMultiplier * mt.getMultiplier();
        customer.setMembershipPoints(customer.getMembershipPoints() - pointsToDeduct);
    }

    public double getCurrentSpending(Long customerId) {
        TypedQuery<CustomerOrder> q = em.createQuery(
                "SELECT o FROM CustomerOrder o WHERE o.customerId = :id AND o.dateTime >= :date", CustomerOrder.class);
        q.setParameter("id", customerId);
        q.setParameter("date", Timestamp.valueOf(LocalDateTime.now().minusYears(2)), TemporalType.TIMESTAMP);

        return q.getResultList()
                .stream()
                .map(x -> x.getPayments())
                .map(x -> x.stream().mapToDouble(y -> y.getAmount()).sum())
                .collect(Collectors.summingDouble(Double::doubleValue));
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

        onlineOrder.setStatus(onlineOrder.getLastStatus());
        return em.merge(onlineOrder);
    }

    @Override
    public OnlineOrder createOnlineOrder(OnlineOrder onlineOrder, String clientSecret)
            throws StripeException, InsufficientPaymentException, CustomerException {
        if (onlineOrder.getVoucher() != null) {
            if (onlineOrder.getVoucher().getCustomerId() != onlineOrder.getCustomerId()) {
                throw new CustomerException("Customer is not entitled to this voucher.");
            }
            customerService.redeemVoucher(onlineOrder.getVoucher().getVoucherCode());
        }
        if (onlineOrder.isDelivery()) {
            // update customer delivery address
            Customer c = customerService.getCustomerById(onlineOrder.getCustomerId());
            c.setAddress(onlineOrder.getDeliveryAddress());

            em.merge(c);
            onlineOrder.setSite(siteService.getSite(3L));
            onlineOrder
                    .addStatusHistory(new OOStatus(siteService.getSite(3L), new Date(), OnlineOrderStatusEnum.PENDING));
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
                onlineOrder.addStatusHistory(
                        new OOStatus(onlineOrder.getPickupSite(), new Date(), OnlineOrderStatusEnum.PENDING));
            } else {
                onlineOrder.setSite(siteService.getSite(3L));
                Site store = onlineOrder.getPickupSite();
                Address add = store.getAddress();
                onlineOrder.setDeliveryAddress(
                        new DeliveryAddress(store.getName(), add.getRoad(), add.getUnit() + ", " + add.getBuilding(),
                                add.getCity(), add.getPostalCode(), add.getState(), CountryEnum.Singapore,
                                store.getPhoneNumber()));
                onlineOrder.addStatusHistory(
                        new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.PENDING));
            }

        }

        if (clientSecret != null && clientSecret != "") {
            stripeService.capturePayment(clientSecret);
        }

        em.persist(onlineOrder);
        finaliseCustomerOrder(onlineOrder);

        if (onlineOrder.getId() > 7L) {
            emailService.sendOnlineOrderConfirmation(customerService.getCustomerById(onlineOrder.getCustomerId()), onlineOrder);
        }

        onlineOrder.getSite().addNotification(new Notification("Online Order (NEW) # " + onlineOrder.getId(),
                "Status is " + onlineOrder.getLastStatus().name() + ": "
                        + onlineOrder.getLastStatus().getDescription()));

        return onlineOrder;
    }

    @Override
    public OnlineOrder customerCancelOnlineOrder(Long orderId, Long customerId)
            throws CustomerOrderException, CustomerException, StripeException {

        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        if (onlineOrder.getCustomerId() != customerId) {
            throw new CustomerOrderException("Order does not belong to you and cannot be cancelled.");
        }
        if (onlineOrder.getLastStatus() != OnlineOrderStatusEnum.PENDING) {
            throw new CustomerOrderException("Order has already began processing and cannot be cancelled.");
        }

        Customer c = customerService.getCustomerById(customerId);
        revertMembershipPoints(c, onlineOrder.getTotalAmount());
        for (Payment p : onlineOrder.getPayments()) {
            c.setMembershipPoints(c.getMembershipPoints() + p.getAmount());
            em.merge(c);
            p.setAmount(0);
        }

        onlineOrder.addStatusHistory(new OOStatus(null, new Date(), OnlineOrderStatusEnum.CANCELLED));

        return updateOnlineOrder(onlineOrder);

    }

    @Override
    public OnlineOrder cancelOnlineOrder(Long orderId, Long siteId)
            throws CustomerOrderException, CustomerException, StripeException {
        Site actionBy = em.find(Site.class, siteId);
        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        if (actionBy == null) {
            throw new CustomerOrderException("Site is not authorised to cancel the order.");
        } else if (actionBy instanceof WarehouseSite) {
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.CANCELLED));
        } else {
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.CANCELLED));
        }

        Customer c = customerService.getCustomerById(onlineOrder.getCustomerId());
        revertMembershipPoints(c, onlineOrder.getTotalAmount());
        for (Payment p : onlineOrder.getPayments()) {
            if (p.getPaymentType() != PaymentTypeEnum.CASH) {
                stripeService.refundPayment(p.getCcTransactionId(), p.getAmount());
            }
            p.setAmount(0);
        }

        emailService.sendOnlineOrderCancellation(c, onlineOrder);
        return updateOnlineOrder(onlineOrder);
    }

    @Override
    public Map<String, Integer> getPickingList(Long siteId) throws ProductException {
        Query q = em
                .createNativeQuery(
                        "SELECT li.product_sku, sum(li.qty) FROM CUSTOMER_ORDER co, CUSTOMER_ORDERLI li, CUSTOMER_ORDER_LINE_ITEMS WHERE co.id = customer_order_id AND li.id = line_items_id AND co.status = :status AND site_id = "
                                + siteId + " GROUP BY li.product_sku")
                .setParameter("status", "PENDING");

        Map<String, Integer> pickingList = new HashMap<>();

        for (Object object : q.getResultList()) {
            Object[] array = (Object[]) object;

            BigInteger qty = (BigInteger) array[1];
            pickingList.put((String) array[0], qty.intValue());
        }

        return pickingList;
    }

    @Override
    public void startPick(List<Long> orderIds) throws CustomerOrderException {
        for (int i = 0; i < orderIds.size(); i++) {
            OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderIds.get(i));
            Site actionBy = onlineOrder.getLastActor();
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.PICKING));
            updateOnlineOrder(onlineOrder);
        }
    }

    @Override
    public void finishPick(List<Long> orderIds) throws CustomerOrderException {
        for (int i = 0; i < orderIds.size(); i++) {
            OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderIds.get(i));
            Site actionBy = onlineOrder.getLastActor();
            onlineOrder.addStatusHistory(new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.PICKED));
            updateOnlineOrder(onlineOrder);
        }
    }

    @Override
    public OnlineOrder pickPackOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException, CustomerException {
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
                emailService.sendOrderReadyToCollect(customerService.getCustomerById(onlineOrder.getCustomerId()),
                        onlineOrder);
            } else {
                onlineOrder.addStatusHistory(
                        new OOStatus(actionBy, new Date(), OnlineOrderStatusEnum.READY_FOR_DELIVERY));
                if (onlineOrder.getPickupSite() == null) {

                    emailService.sendOrderReadyToDeliver(customerService.getCustomerById(onlineOrder.getCustomerId()),
                            onlineOrder);

                    // Remove Stock Level
                    for (CustomerOrderLI ooli : onlineOrder.getLineItems()) {
                        try {
                            siteService.removeProducts(onlineOrder.getSite().getId(), ooli.getProduct().getSku(),
                                    ooli.getPackedQty());
                        } catch (NoStockLevelException | IllegalTransferException e) {
                            e.printStackTrace();
                        }
                    }
                }
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
                    if (coli.getPickedQty() + qty > coli.getQty()) {
                        throw new CustomerOrderException("The qty of this product has exceeded the required qty.");
                    }
                    coli.setPickedQty(coli.getPickedQty() + qty);
                    boolean picked = true;
                    for (CustomerOrderLI coli2 : lineItems) {
                        if (coli2.getPickedQty() < coli2.getQty()) {
                            picked = false;
                        }
                    }
                    if (picked) {
                        onlineOrder.addStatusHistory(
                                new OOStatus(onlineOrder.getSite(), new Date(),
                                        OnlineOrderStatusEnum.PICKED));
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
                                    new OOStatus(onlineOrder.getSite(), new Date(),
                                            OnlineOrderStatusEnum.PACKED));
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
    public OnlineOrder adjustProduct(Long orderId, String rfidsku, int qty)
            throws CustomerOrderException, NoStockLevelException, IllegalTransferException, ProductException {

        OnlineOrder onlineOrder = (OnlineOrder) getCustomerOrder(orderId);

        Product product = productService.getProduct(rfidsku);
        List<CustomerOrderLI> lineItems = onlineOrder.getLineItems();

        if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PICKING) {
            for (CustomerOrderLI coli : lineItems) {
                if (coli.getProduct().equals(product)) {
                    if (qty > coli.getQty()) {
                        throw new CustomerOrderException("The qty of this product has exceeded the required qty.");
                    }
                    coli.setPickedQty(qty);
                    boolean picked = true;
                    for (CustomerOrderLI coli2 : lineItems) {
                        if (coli2.getPickedQty() < coli2.getQty()) {
                            picked = false;
                        }
                    }
                    if (picked) {
                        onlineOrder.addStatusHistory(
                                new OOStatus(onlineOrder.getSite(), new Date(),
                                        OnlineOrderStatusEnum.PICKED));
                    }
                    return em.merge(onlineOrder);
                }
            }
            throw new CustomerOrderException("The product scanned is not required in the order that you are picking");

        } else if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PACKING) {
            for (CustomerOrderLI coli : lineItems) {
                if (coli.getProduct().equals(product)) {
                    if (qty > coli.getPickedQty()) {
                        throw new CustomerOrderException("You are packing items that are not meant for this order.");
                    } else {
                        coli.setPackedQty(qty);

                        boolean packed = true;
                        for (CustomerOrderLI coli2 : lineItems) {
                            if (coli2.getPackedQty() < coli2.getPickedQty()) {
                                packed = false;
                            }
                        }
                        if (packed) {
                            onlineOrder.addStatusHistory(
                                    new OOStatus(onlineOrder.getSite(), new Date(),
                                            OnlineOrderStatusEnum.PACKED));
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
    public OnlineOrder deliverOnlineOrder(Long orderId)
            throws CustomerOrderException {
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
    public OnlineOrder receiveOnlineOrder(Long orderId, Long siteId) throws CustomerOrderException, CustomerException {
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
        emailService.sendOrderReadyToCollect(customerService.getCustomerById(onlineOrder.getCustomerId()), onlineOrder);
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

    @Override
    public Map<Long, Map<String, Long>> getCustomerOrdersInDateRange(Date start, Date end) {
        Map<Long, Map<String, Long>> map = new HashMap<Long, Map<String, Long>>();
        List<Site> sites = siteService.getAllSites();

        Calendar cal = new GregorianCalendar();
        cal.setTime(start);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        start = cal.getTime();

        cal.setTime(end);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        end = cal.getTime();

        for (Site site : sites) {
            Map<String, Long> valueMap = new HashMap<String, Long>();

            Query productCountQuery = em
                    .createNativeQuery(
                            "SELECT sum(qty) FROM customer_order co, CUSTOMER_ORDER_LINE_ITEMS coli, customer_Orderli li WHERE coli.line_items_id = li.id AND coli.customer_order_id = co.id AND co.site_id = :siteId AND co.date_Time BETWEEN :start AND :end")
                    .setParameter("siteId", site.getId())
                    .setParameter("start", start)
                    .setParameter("end", end);
            BigInteger productCount = productCountQuery.getSingleResult() == null ? BigInteger.valueOf(0)
                    : (BigInteger) productCountQuery.getSingleResult();
            valueMap.put("products", productCount.longValue());

            Query revenueQuery = em.createNativeQuery(
                    "SELECT SUM(total_amount) FROM CUSTOMER_ORDER WHERE site_id = :siteId AND date_time BETWEEN :start AND :end")
                    .setParameter("siteId", site.getId())
                    .setParameter("start", start)
                    .setParameter("end", end);

            Double revenue = revenueQuery.getSingleResult() == null ? 0d
                    : (Double) revenueQuery.getSingleResult() * 100;
            valueMap.put("revenue", revenue.longValue());

            TypedQuery<Long> orderCountQuery = em
                    .createQuery(
                            "SELECT COUNT(co) FROM CustomerOrder co WHERE co.site.id = :siteId AND co.dateTime BETWEEN :start AND :end",
                            Long.class)
                    .setParameter("siteId", site.getId())
                    .setParameter("start", start)
                    .setParameter("end", end);
            valueMap.put("orders", orderCountQuery.getSingleResult());

            map.put(site.getId(), valueMap);
        }
        return map;
    }

    @Override
    public Map<Long, Long> getStoreOrdersInDateRange(Date start, Date end) {
        Map<Long, Long> map = new HashMap<Long, Long>();
        List<Site> sites = siteService.getAllSites();

        Calendar cal = new GregorianCalendar();
        cal.setTime(start);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        start = cal.getTime();

        cal.setTime(end);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        end = cal.getTime();

        for (Site site : sites) {
            TypedQuery<Long> q1 = em
                    .createQuery(
                            "SELECT co.id FROM CustomerOrder co WHERE co.site.id = :siteId AND co.dateTime BETWEEN :start AND :end",
                            Long.class)
                    .setParameter("siteId", site.getId())
                    .setParameter("start", start)
                    .setParameter("end", end);

            TypedQuery<Long> q2 = em
                    .createQuery(
                            "SELECT oo.id FROM OnlineOrder oo WHERE oo.site.id = :siteId AND oo.dateTime BETWEEN :start AND :end",
                            Long.class)
                    .setParameter("siteId", site.getId())
                    .setParameter("start", start)
                    .setParameter("end", end);

            List<Long> resultList = q1.getResultList();
            resultList.removeAll(q2.getResultList());

            map.put(site.getId(), Long.valueOf(resultList.size()));
        }
        return map;
    }

    @Override
    public Map<Long, Long> getOnlineOrdersInDateRange(Date start, Date end) {
        Map<Long, Long> map = new HashMap<Long, Long>();
        List<Site> sites = siteService.getAllSites();

        Calendar cal = new GregorianCalendar();
        cal.setTime(start);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        start = cal.getTime();

        cal.setTime(end);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        end = cal.getTime();

        for (Site site : sites) {
            TypedQuery<Long> q = em
                    .createQuery(
                            "SELECT COUNT(oo) FROM OnlineOrder oo WHERE oo.site.id = :siteId AND oo.dateTime BETWEEN :start AND :end",
                            Long.class)
                    .setParameter("siteId", site.getId())
                    .setParameter("start", start)
                    .setParameter("end", end);

            map.put(site.getId(), q.getSingleResult());
        }
        return map;
    }

    @Override
    public List<CustomerOrder> getDailyCustomerOrders(Long siteId, Date date) {
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

        TypedQuery<CustomerOrder> q = em
                .createQuery(
                        "SELECT co FROM CustomerOrder co WHERE co.site.id = :siteId AND co.dateTime BETWEEN :start AND :end",
                        CustomerOrder.class)
                .setParameter("siteId", siteId)
                .setParameter("start", dateStart)
                .setParameter("end", dateEnd);

        return q.getResultList();
    }

    @Override
    public List<CustomerOrder> getCustomerOrdersInRange(Long siteId, Date start, Date end) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(start);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Date dateStart = cal.getTime();

        cal.setTime(end);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date dateEnd = cal.getTime();

        TypedQuery<CustomerOrder> q = em
                .createQuery(
                        "SELECT co FROM CustomerOrder co WHERE co.site.id = :siteId AND co.dateTime BETWEEN :start AND :end",
                        CustomerOrder.class)
                .setParameter("siteId", siteId)
                .setParameter("start", dateStart)
                .setParameter("end", dateEnd);

        return q.getResultList();
    }

    @Override
    public List<CustomerOrder> getAllCustomerOrderInRange(Date start, Date end) {
        Calendar cal = new GregorianCalendar();
        cal.setTime(start);
        cal.set(Calendar.HOUR_OF_DAY, 0);
        cal.set(Calendar.MINUTE, 0);
        cal.set(Calendar.SECOND, 0);
        Date dateStart = cal.getTime();

        cal.setTime(end);
        cal.set(Calendar.HOUR_OF_DAY, 23);
        cal.set(Calendar.MINUTE, 59);
        cal.set(Calendar.SECOND, 59);
        Date dateEnd = cal.getTime();

        TypedQuery<CustomerOrder> q = em
                .createQuery(
                        "SELECT co FROM CustomerOrder co WHERE co.dateTime BETWEEN :start AND :end",
                        CustomerOrder.class)
                .setParameter("start", dateStart)
                .setParameter("end", dateEnd);

        return q.getResultList();
    }

    public List<ParcelSizeEnum> getParcelSizes() {
        return Arrays.asList(ParcelSizeEnum.values());
    }

    @Override
    public Delivery getDeliveryInfoById(Long deliveryId) {
        return em.find(Delivery.class, deliveryId);
    }
}