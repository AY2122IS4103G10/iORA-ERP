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
import javax.persistence.Query;
import javax.transaction.Transactional;

import com.easypost.EasyPost;
import com.easypost.exception.EasyPostException;
import com.easypost.model.Address;
import com.easypost.model.Batch;
import com.easypost.model.CustomsInfo;
import com.easypost.model.Parcel;
import com.easypost.model.ScanForm;
import com.easypost.model.Shipment;
import com.easypost.model.ShipmentCollection;
import com.easypost.model.Webhook;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customer.Customer;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OnlineOrder;
import com.iora.erp.model.site.Site;
import com.stripe.model.Mandate.CustomerAcceptance.Online;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service("easyPostServiceImpl")
@Transactional
public class EasyPostServiceImpl implements EasyPostService {

    @Value("${EASYPOST_SECRET_KEY}")
    private String secretKey;

    @Value("${WEBHOOKS_ID}")
    private String webhookID;

    @Value("${WEBHOOKS_URL}")
    private String url;

    @PostConstruct
    public void init() {
        EasyPost.apiKey = secretKey;
    }

    @Autowired
    private CustomerOrderService customerOrderService;

    @Autowired
    private CustomerService customerService;

    @Autowired
    private SiteService siteService;

    @PersistenceContext
    private EntityManager em;

    @Override
    public OnlineOrder createParcel(Long orderId, Long siteId, Delivery parcelInfo)
            throws CustomerOrderException, CustomerException {
        OnlineOrder onlineOrder = (OnlineOrder) customerOrderService.getCustomerOrder(orderId);
        em.persist(parcelInfo);

        Customer cust = customerService.getCustomerById(onlineOrder.getCustomerId());

        Site site = siteService.getSite(siteId);

        try {
            Map<String, Object> fromAddressMap = new HashMap<String, Object>();
            fromAddressMap.put("name", site.getName());
            fromAddressMap.put("street1", site.getAddress().getRoad());
            fromAddressMap.put("street2", site.getAddress().getBuilding());
            fromAddressMap.put("city", site.getAddress().getCity());
            fromAddressMap.put("country", site.getAddress().getCountry());
            fromAddressMap.put("zip", site.getAddress().getPostalCode());
            fromAddressMap.put("phone", site.getPhoneNumber());
            fromAddressMap.put("company", site.getCompany().getName());
            Address fromAddress = Address.create(fromAddressMap);

            Map<String, Object> toAddressMap = new HashMap<String, Object>();
            toAddressMap.put("name", cust.getFirstName() + " " + cust.getLastName());
            toAddressMap.put("street1", onlineOrder.getDeliveryAddress().getStreet1());
            toAddressMap.put("street2", onlineOrder.getDeliveryAddress().getStreet2());
            toAddressMap.put("city", onlineOrder.getDeliveryAddress().getState());
            toAddressMap.put("state", onlineOrder.getDeliveryAddress().getState());
            toAddressMap.put("zip", onlineOrder.getDeliveryAddress().getZip());
            toAddressMap.put("phone", onlineOrder.getDeliveryAddress().getPhone());
            // toAddressMap.put("country", onlineOrder.getCountry());
            toAddressMap.put("email", cust.getEmail());
            Address toAddress = Address.create(toAddressMap);

            Map<String, Object> parcelMap = new HashMap<String, Object>();
            parcelMap.put("object", onlineOrder.getId());
            parcelMap.put("weight", parcelInfo.getPs().getWeight());
            parcelMap.put("height", parcelInfo.getPs().getHeight());
            parcelMap.put("width", parcelInfo.getPs().getWidth());
            parcelMap.put("length", parcelInfo.getPs().getLength());
            parcelMap.put("mode", "test");
            Parcel parcel = Parcel.create(parcelMap);
            parcelInfo.setParcelID(parcel.getId());

            Map<String, Object> shipmentMap = new HashMap<String, Object>();
            shipmentMap.put("to_address", toAddress);
            shipmentMap.put("from_address", fromAddress);
            shipmentMap.put("parcel", parcel);

            Shipment shipment = Shipment.create(shipmentMap);
            parcelInfo.setShipmentID(shipment.getId());
            parcelInfo.setSiteId(siteId);
            parcelInfo.setDateTime(shipment.getCreatedAt());
            onlineOrder.getParcelDelivery().add(parcelInfo);

            Map<String, Object> buyMap = new HashMap<String, Object>();
            buyMap.put("rate", shipment.lowestRate());
            buyMap.put("insurance", 249.99);

            shipment.buy(buyMap);

            /*
             * List<String> buyCarriers = new ArrayList<String>();
             * buyCarriers.add("USPS");
             * List<String> buyServices = new ArrayList<String>();
             * buyServices.add("First");
             * shipment.buy(shipment.lowestRate(buyCarriers, buyServices));
             */

        } catch (EasyPostException e) {
            throw new CustomerOrderException("Fail to create delivery: " + e);
        }
        return onlineOrder;
    }

    @Override
    public Batch createBatchDelivery(Long siteId) throws EasyPostException {
        Calendar calendar = Calendar.getInstance();
        // delivery goods before 2pm
        calendar.set(Calendar.HOUR_OF_DAY, 14);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        Date today = calendar.getTime();
        calendar.set(Calendar.DATE, -1);
        Date previous = calendar.getTime();
        System.out.println(previous);

        List<Map<String, Object>> shipmentsList = new ArrayList<Map<String, Object>>();

        List<Delivery> pdList = onlineParcelAvailDeliveryBySite(siteId, previous);
        List<Shipment> sList = new ArrayList<Shipment>();

        for (Delivery x : pdList) {
            Map<String, Object> shipment1 = new HashMap<String, Object>();
            shipment1.put("id", x.getShipmentID());
            shipmentsList.add(shipment1);
            sList.add(Shipment.retrieve(x.getShipmentID()));
        }

        Map<String, Object> batchMap = new HashMap<String, Object>();
        batchMap.put("shipment", shipmentsList);
        Batch batch = Batch.create(batchMap);

        Map<String, Object> paramMap = new HashMap<String, Object>();
        paramMap.put("shipments", sList);
        ScanForm scanForm = ScanForm.create(paramMap);

        return batch;

    }

    @Override
    public List<Delivery> onlineParcelAvailDeliveryBySite(Long siteId, Date dayBefore) {
        Query q = em.createQuery("SELECT o FROM Delivery o WHERE o.dateTime >= :dayBefore AND o.siteId = :siteId");
        q.setParameter("dayBefore", dayBefore);
        q.setParameter("siteId", siteId);
        return q.getResultList();
    }

    @Override
    public ShipmentCollection retreiveListOfShipments() throws EasyPostException {
        Map<String, Object> list_params = new HashMap<>();
        list_params.put("page_size", 20);
        list_params.put("start_datetime", "2022-03-026T08:50:00Z");

        ShipmentCollection shipments = Shipment.all(list_params);
        return shipments;
    }

}