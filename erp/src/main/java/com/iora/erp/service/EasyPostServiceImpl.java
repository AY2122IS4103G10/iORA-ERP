package com.iora.erp.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.persistence.EntityManager;
import javax.persistence.PersistenceContext;
import javax.transaction.Transactional;

import com.easypost.EasyPost;
import com.easypost.exception.EasyPostException;
import com.easypost.model.Address;
import com.easypost.model.CustomsInfo;
import com.easypost.model.Parcel;
import com.easypost.model.Shipment;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
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
    public OnlineOrder createParcel(Long orderId, Long siteId, Delivery parcelInfo) throws CustomerOrderException {
        OnlineOrder onlineOrder = (OnlineOrder) customerOrderService.getCustomerOrder(orderId);
        em.persist(parcelInfo);

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
            Address fromAddress = Address.create(fromAddressMap);

            Map<String, Object> toAddressMap = new HashMap<String, Object>();
            toAddressMap.put("name", onlineOrder.getDeliveryAddress().getName());
            toAddressMap.put("street1", onlineOrder.getDeliveryAddress().getStreet1());
            toAddressMap.put("street2", onlineOrder.getDeliveryAddress().getStreet2());
            toAddressMap.put("city", onlineOrder.getDeliveryAddress().getState());
            toAddressMap.put("state", onlineOrder.getDeliveryAddress().getState());
            toAddressMap.put("zip", onlineOrder.getDeliveryAddress().getZip());
            toAddressMap.put("phone", onlineOrder.getDeliveryAddress().getPhone());
            toAddressMap.put("country", onlineOrder.getCountry());
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
            onlineOrder.getParcelDelivery().add(parcelInfo);

            /*
             * List<String> buyCarriers = new ArrayList<String>();
             * buyCarriers.add("DHL");
             * List<String> buyServices = new ArrayList<String>();
             * buyServices.add("First");
             * shipment.buy(shipment.lowestRate(buyCarriers, buyServices));
             */

        } catch (EasyPostException e) {
            throw new CustomerOrderException("Fail to create delivery: " + e);
        }
        return onlineOrder;
    }

}