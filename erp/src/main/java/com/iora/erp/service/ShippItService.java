package com.iora.erp.service;

import java.util.List;

import com.iora.erp.enumeration.ParcelSizeEnum;
import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.exception.OnlineOrderDeliveryException;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OnlineOrder;

import org.springframework.http.ResponseEntity;

public interface ShippItService {

    public abstract OnlineOrder createDelivery(Long orderId, Long siteId, List<Delivery> deliveries)
            throws CustomerOrderException, CustomerException;

    public abstract String tokenBearer();

    public abstract OnlineOrder deliveryOrder(Long orderId, Long siteId, OnlineOrder parcelSizes)
            throws CustomerOrderException, CustomerException;

    public abstract OnlineOrder moreToDelivery(Long orderId) throws CustomerOrderException;

    public abstract String confirmDeliveryOrders();

    public abstract OnlineOrder cancelDeliverOrder(Long trackingId);

    public abstract String retreiveLabel(Long parcelId);

    public abstract OnlineOrder fetchStatus();

    public abstract List<Delivery> getAllUncomfirmedDelivery() throws OnlineOrderDeliveryException;

}
