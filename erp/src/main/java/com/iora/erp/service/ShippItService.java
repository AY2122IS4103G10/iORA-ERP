package com.iora.erp.service;

import com.iora.erp.exception.CustomerException;
import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.OnlineOrder;

public interface ShippItService {

        public abstract String tokenBearer();

        public abstract OnlineOrder deliveryOrder(Long orderId, Long siteId, OnlineOrder parcelSizes)
                        throws CustomerOrderException, CustomerException;

        public abstract String retreiveLabel(Long parcelId);

        public abstract String trackingDelivery(Long parcelId);

        public abstract OnlineOrder simulateDeliveryComplete(Long onlineOrderId);

        public abstract void fetchStatus();
}
