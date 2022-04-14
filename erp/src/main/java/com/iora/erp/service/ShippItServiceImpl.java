package com.iora.erp.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.site.Site;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.web.client.RestTemplateBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
    public ResponseEntity<String> deliveryOrder() {
        String url = "https://app.staging.shippit.com/api/3/orders";
        JSONObject[] myArray = new JSONObject[1];
        JSONObject pa = new JSONObject();
        pa.put("qty", "1");
        pa.put("weight", "2.1");
        myArray[0] = pa;

        JSONObject user = new JSONObject();
        user.put("email", "adelinetanjiaying@hotmail.com");
        user.put("first_name", "Adeline");
        user.put("last_name", "beau");

        JSONObject mainObj = new JSONObject();
        mainObj.put("courier_type", "standard");
        mainObj.put("delivery_address", "1 Union Street");
        mainObj.put("delivery_postcode", "2009");
        mainObj.put("delivery_state", "NSW");
        mainObj.put("delivery_suburb", "Pyrmount");
        mainObj.put("authority_to_leave", "Yes");
        mainObj.put("parcel_attributes", myArray);
        mainObj.put("user_attributes", user);

        JSONObject order = new JSONObject();
        order.put("order", mainObj);

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.setBearerAuth(tokenBearer());
        HttpEntity<String> entity = new HttpEntity<>(order.toString(), headers);
        System.out.println(order);
        ResponseEntity<String> response = restTemplate.postForEntity(url, entity, String.class);
        return response;
    }

}