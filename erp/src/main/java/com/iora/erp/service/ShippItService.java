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

        public abstract String tokenBearer();

        public abstract OnlineOrder deliveryOrder(Long orderId, Long siteId, OnlineOrder parcelSizes)
                        throws CustomerOrderException, CustomerException;

        public abstract String retreiveLabel(Long parcelId);

        public abstract String trackingDelivery(Long parcelId);

        public abstract void fetchStatus();
}
