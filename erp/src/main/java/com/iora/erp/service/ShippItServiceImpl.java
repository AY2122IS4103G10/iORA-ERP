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

import org.json.JSONArray;
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
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service("shippItServiceImpl")
@Transactional
public class ShippItServiceImpl implements ShippItService {

    @Value("${SHIPPEDIT_API}")
    private String apiKey;

    @Value("${WEBHOOKS_SHIPPIT}")
    private String webhook;

    private List<Long> allDelivery;

    @PostConstruct
    public void init() {
        allDelivery = new ArrayList<>();
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
    public String tokenBearer() {
        return apiKey;
    }

    @Override
    public OnlineOrder deliveryOrder(Long orderId, Long siteId, OnlineOrder oOrder)
            throws CustomerOrderException, CustomerException {
        OnlineOrder onlineOrder = (OnlineOrder) customerOrderService.getCustomerOrder(orderId);

        if (onlineOrder.getLastStatus() == OnlineOrderStatusEnum.PACKED) {
            List<Delivery> deliveryParcel = oOrder.getParcelDelivery();

            String url = "https://app.staging.shippit.com/api/3/orders";

            JSONObject order = new JSONObject();
            List<String> urlsTracking = new ArrayList<>();

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
                    delivery.setStatus(OnlineOrderStatusEnum.READY_FOR_DELIVERY);
                    urlsTracking.add(deliveryURL);
                    allDelivery.add(delivery.getId());
                }
            }

            return onlineOrder;

        } else {
            throw new CustomerOrderException("Order is not up for delivery.");
        }
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

    @Override
    public OnlineOrder simulateDeliveryComplete(Long onlineOrderId) {
        OnlineOrder oo = em.find(OnlineOrder.class, onlineOrderId);
        if (oo.getStatus() == OnlineOrderStatusEnum.PACKED || oo.getStatus() == OnlineOrderStatusEnum.READY_FOR_DELIVERY
                || oo.getStatus() == OnlineOrderStatusEnum.DELIVERING) {
            List<Delivery> parcels = oo.getParcelDelivery();
            for (Delivery dd : parcels) {
                Delivery delivered = em.find(Delivery.class, dd.getId());
                delivered.setStatus(OnlineOrderStatusEnum.DELIVERED);
            }

            OnlineOrder ooPersist = em.find(OnlineOrder.class, oo.getId());
            ooPersist.setStatus(OnlineOrderStatusEnum.DELIVERED);
            ooPersist.getStatusHistory().add(new OOStatus(null, new Date(), OnlineOrderStatusEnum.DELIVERED));
        }

        return oo;
    }

    @Scheduled(cron = "*/15 * * * * *")
    @Async
    @Override
    public void fetchStatus() {
        Query q = em.createQuery(
                "SELECT x FROM OnlineOrder x WHERE (x.status =:status OR x.status =:status2) AND x.delivery = TRUE");
        q.setParameter("status", OnlineOrderStatusEnum.READY_FOR_DELIVERY);
        q.setParameter("status2", OnlineOrderStatusEnum.DELIVERING);
        List<OnlineOrder> listOO = q.getResultList();

        String url = "https://app.staging.shippit.com/api/3/orders/{tracking_number}/tracking";
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(tokenBearer());

        for (OnlineOrder oo : listOO) {
            List<Delivery> ddList = oo.getParcelDelivery();
            Boolean completed = true;

            for (Delivery dd : ddList) {
                Delivery xx = em.find(Delivery.class, dd.getId());

                Date nowDate = new Date();
                long differenceInTime = nowDate.getTime() - xx.getDateTime().getTime();

                if (differenceInTime > 30000) {

                    HttpEntity<String> entity = new HttpEntity<>(headers);
                    ResponseEntity<String> response = restTemplate.exchange(url, HttpMethod.GET, entity, String.class,
                            dd.getTrackingID());
                    String jsonB = response.getBody();
                    JSONObject jsonObject = new JSONObject(jsonB);
                    JSONArray listR = jsonObject.getJSONObject("response").getJSONArray("track");
                    JSONObject lastStatusObject = listR.getJSONObject(0);
                    String lastStatus = lastStatusObject.getString("status");
                    System.out.println(lastStatus);

                    if (lastStatus.equals("Completed")) {
                        xx.setStatus(OnlineOrderStatusEnum.DELIVERED);

                    } else if ((lastStatus.equals("with_driver") || lastStatus.equals("in_transit"))
                            && !xx.getStatus().equals(OnlineOrderStatusEnum.DELIVERING)) {
                        xx.setStatus(OnlineOrderStatusEnum.DELIVERING);
                        completed = false;
                    } else {
                        completed = false;
                    }
                } else {
                    completed = false;
                }
            }

            if (completed != false) {
                OnlineOrder ooPersist = em.find(OnlineOrder.class, oo.getId());
                ooPersist.setStatus(OnlineOrderStatusEnum.DELIVERED);
                ooPersist.getStatusHistory().add(new OOStatus(null, new Date(), OnlineOrderStatusEnum.DELIVERED));
            }
        }
    }

}