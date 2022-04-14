package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.TimeUnit;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.persistence.Query;
import javax.transaction.Transactional;

import com.iora.erp.enumeration.OnlineOrderStatusEnum;
import com.iora.erp.enumeration.ParcelSizeEnum;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.OnlineOrderDeliveryException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OOStatus;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.site.Site;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service("shippItServiceImpl")
@Transactional
public class ShippItServiceImpl implements ShippItService {

    @Value("${SHIPPEDIT_API}")
    private String apiKey;

    @Value("${WEBHOOKS_SHIPPIT}")
    private String webhook;

    @PostConstruct
    public void init() {
    }

    @Autowired
    private CustomerOrderService customerOrderService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private SiteService siteService;

    @Autowired
    private RestTemplate restTemplate;

    @PersistenceContext
    private EntityManager em;

    @Override
    public OnlineOrder createDelivery(Long orderId, Long siteId, List<Delivery> deliveries)
            throws CustomerOrderException, CustomerException {
        OnlineOrder onlineOrder = (OnlineOrder) customerOrderService.getCustomerOrder(orderId);
        for (Delivery d : deliveries) {
            em.persist(d);
            onlineOrder.getParcelDelivery().add(d);
        }
        Customer cust = customerService.getCustomerById(onlineOrder.getCustomerId());
        Site site = siteService.getSite(siteId);

        return onlineOrder;
    }

    @Override
    public String tokenBearer() {
        return apiKey;
    }

    @Override
    public OnlineOrder deliveryOrder(Long orderId, Long siteId, OnlineOrder oOrder)
            throws CustomerOrderException, CustomerException {
        OnlineOrder onlineOrder = (OnlineOrder) customerOrderService.getCustomerOrder(orderId);

        if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PACKED
                || onlineOrder.getStatus() == OnlineOrderStatusEnum.DELIVERING_MULTIPLE) {
            List<Delivery> deliveryParcel = oOrder.getParcelDelivery();

            String url = "https://app.staging.shippit.com/api/3/orders";

            JSONObject order = new JSONObject();

            for (int i = 0; i < deliveryParcel.size(); i++) {
                ParcelSizeEnum parcelInfo = deliveryParcel.get(i).getPs();

                JSONObject[] myArray = new JSONObject[1];
                JSONObject pa = new JSONObject();
                pa.put("qty", "1");
                pa.put("weight", String.valueOf(parcelInfo.getWeight()));
                myArray[0] = pa;
                Customer c = customerService.getCustomerById(onlineOrder.getCustomerId());

                JSONObject user = new JSONObject();
                user.put("email", c.getEmail());
                user.put("first_name", c.getAddress().getName());
                user.put("last_name", "");

                String address = c.getAddress().getStreet1() + ", " + c.getAddress().getStreet2();
                JSONObject mainObj = new JSONObject();
                mainObj.put("courier_type", "standard");
                mainObj.put("delivery_address", address);
                mainObj.put("delivery_postcode", c.getAddress().getZip());
                mainObj.put("delivery_state", c.getAddress().getCountry());
                mainObj.put("delivery_suburb", c.getAddress().getCountry());
                mainObj.put("authority_to_leave", "Yes");
                mainObj.put("parcel_attributes", myArray);
                mainObj.put("user_attributes", user);
                mainObj.put("receiver_contact_number", c.getAddress().getPhone());

                order.put("order", mainObj);

                HttpHeaders headers = new HttpHeaders();
                headers.setContentType(MediaType.APPLICATION_JSON);
                headers.setBearerAuth(tokenBearer());
                HttpEntity<String> entity = new HttpEntity<>(order.toString(), headers);
                ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
                if (response.getStatusCode().is2xxSuccessful()) {
                    onlineOrder.addStatusHistory(
                            new OOStatus(onlineOrder.getSite(), new Date(), OnlineOrderStatusEnum.READY_FOR_DELIVERY));

                    String jsonB = response.getBody();
                    JSONObject jsonObject = new JSONObject(jsonB);

                    Delivery delivery = new Delivery();
                    delivery.setDateTime(new Date());
                    delivery.setPs(parcelInfo);
                    delivery.setDeliveryID(jsonObject.getJSONObject("response").getInt("id"));
                    delivery.setTrackingID(jsonObject.getJSONObject("response").getString("tracking_number"));
                    delivery.setSiteId(siteId);
                    em.persist(delivery);
                    onlineOrder.getParcelDelivery().add(delivery);
                    String deliveryURL = "https://app.staging.shippit.com/track/";
                    deliveryURL = deliveryURL.concat(delivery.getTrackingID().toLowerCase());
                    delivery.setTrackingURL(deliveryURL);
                    System.out.println(deliveryURL);
                    // trackingDelivery(delivery.getId());
                }
            }
            if (onlineOrder.getParcelDelivery().size() == oOrder.getParcelDelivery().size()) {
                onlineOrder.setStatus(OnlineOrderStatusEnum.READY_FOR_DELIVERY);
            }

            // for (Delivery xDelivery : onlineOrder.getParcelDelivery()) {
            // trackingDelivery(xDelivery.getId());
            // retreiveLabel(xDelivery.getId());
            // }

            return onlineOrder;

        } else {
            throw new CustomerOrderException("Order is not up for delivery.");
        }
    }

    @Override
    public OnlineOrder moreToDelivery(Long orderId) throws CustomerOrderException {
        OnlineOrder onlineOrder = (OnlineOrder) customerOrderService.getCustomerOrder(orderId);

        if (onlineOrder.getStatus() == OnlineOrderStatusEnum.READY_FOR_DELIVERY
                || onlineOrder.getStatus() == OnlineOrderStatusEnum.DELIVERING_MULTIPLE) {
            // true = more to deliver
            onlineOrder.setStatus(OnlineOrderStatusEnum.DELIVERING_MULTIPLE);
        }
        return onlineOrder;
    }

    @Override
    public String retreiveLabel(Long parcelId) {
        Delivery parcel = em.find(Delivery.class, parcelId);
        String trackingNum = parcel.getTrackingID();
        String url = "https://app.staging.shippit.com/api/3/orders/{tracking_number}/label";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(tokenBearer());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class,
                trackingNum);
        String jsonB = response.getBody();
        JSONObject jsonObject = new JSONObject(jsonB);
        String link = jsonObject.getJSONObject("response").getString("qualified_url");
        return link;
    }

    @Override
    public OnlineOrder fetchStatus() {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    public List<Delivery> getAllUncomfirmedDelivery() throws OnlineOrderDeliveryException {
        try {
            Query q = em.createQuery("SELECT d FROM Delivery d WHERE d.confirmOrder = :status");
            q.setParameter("status", true);
            return q.getResultList();
        } catch (Exception ex) {
            throw new OnlineOrderDeliveryException();
        }
    }

    @Override
    public String trackingDelivery(Long parcelId) {
        Delivery parcel = em.find(Delivery.class, parcelId);
        String trackingNum = parcel.getTrackingID();
        String url = "https://app.staging.shippit.com/api/3/orders/{tracking_number}/tracking";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(tokenBearer());
        HttpEntity<String> entity = new HttpEntity<>(headers);
        ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class,
                trackingNum);
        String jsonB = response.getBody();
        JSONObject jsonObject = new JSONObject(jsonB);
        String link = jsonObject.getJSONObject("response").getString("tracking_url");
        parcel.setTrackingURL(link);
        return link;
    }

    /*
     * @Override
     * public OnlineOrder fillTrackingURL(Long onlineOrder) throws
     * InterruptedException {
     * TimeUnit.MINUTES.sleep(1);
     * OnlineOrder oo = em.find(OnlineOrder.class, onlineOrder);
     * List<Delivery> parcelList = oo.getParcelDelivery();
     * for (Delivery delivery : parcelList) {
     * String url = trackingDelivery(delivery.getId());
     * Delivery dd = em.find(Delivery.class, delivery.getId());
     * dd.setTrackingURL(url);
     * System.out.println(dd.toString());
     * }
     * System.out.println(oo.toString());
     * oo = em.find(OnlineOrder.class, onlineOrder);
     * return oo;
     * }
     */
}