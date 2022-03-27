package com.iora.erp.service;

import com.iora.erp.exception.CustomerOrderException;
import com.iora.erp.model.customerOrder.Delivery;
import com.iora.erp.model.customerOrder.OnlineOrder;

public interface EasyPostService {

    public abstract OnlineOrder createParcel(Long orderId, Long siteId, Delivery parcelInfo)
            throws CustomerOrderException;
}
