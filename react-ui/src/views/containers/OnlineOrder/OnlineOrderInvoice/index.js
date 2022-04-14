import { forwardRef } from "react";
import QRCode from "qrcode.react";
import Barcode from "react-barcode";
import moment from "moment";

export const OnlineInvoiceBody = ({
  title,
  orderId,
  orderStatus,
  dateTime,
  delivery,
  customer,
  deliveryAddress,
  site,
  pickupSite,
  qrValue,
  children,
  qrHelper,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div>
        <div className="space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
          <h1 className="font-extrabold tracking-tight text-5xl">{title}</h1>
        </div>

        <h4 className="sr-only">Order Information</h4>
        <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
          <div>
            <dd className="mt-2 text-gray-700">
              <div className="my-10">
                <QRCode
                  id={orderId}
                  value={qrValue}
                  size={150}
                  level={"H"}
                  includeMargin={false}
                />
                <p className="mt-2 text-gray-700">{qrHelper && qrHelper}</p>
              </div>
            </dd>
          </div>
          <div>
            <dd>
              <Barcode
                value={orderId.toString()}
                width={1}
                height={40}
                displayValue={false}
                margin={0}
              />
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">No.</dt>
                <dd className="text-cyan-600 mt-2">{orderId}</dd>
              </dl>
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">Date</dt>
                <dd className="text-cyan-600 mt-2">
                  {moment.unix(dateTime / 1000).format("DD/MM/YYYY, hh:mm:ss")}
                </dd>
              </dl>
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">Status</dt>
                <dd className="text-cyan-600 mt-2">{orderStatus.status}</dd>
              </dl>
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">Delivery Type</dt>
                <dd className="text-cyan-600 mt-2">
                  {delivery ? "DELIVERY" : "SELF-COLLECT"}
                </dd>
              </dl>
              {/* <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">Tracking number</dt>
                <dd className="text-cyan-600 mt-2">51547878755545848512</dd>
              </dl> */}
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-gray-200">
        <h2 className="sr-only">Your order</h2>
        {site?.id !== pickupSite?.id && (
          <div>
            <h4 className="sr-only">Addresses</h4>
            <dl className="border-b border-gray-200 grid grid-cols-2 gap-x-6 text-sm py-10">
              <div>
                <dt className="font-medium text-gray-900">Shipping From</dt>
                <dd className="mt-2 text-gray-700">
                  <address className="not-italic">
                    <span className="block">{site?.name}</span>
                    <span className="block">{site?.address.road}</span>
                    <span className="block">
                      {site?.address.city}, {site?.address.postalCode}
                    </span>
                    <span className="block">{site?.phoneNumber}</span>
                  </address>
                </dd>
              </div>
              <div>
                <dt className="font-medium text-gray-900">Shipping To</dt>
                <dd className="mt-2 text-gray-700">
                  {pickupSite ? (
                    <address className="not-italic">
                      <span className="block">{pickupSite.name}</span>
                      <span className="block">{pickupSite.address.road}</span>
                      <span className="block">
                        {pickupSite.address.city},{" "}
                        {pickupSite.address.postalCode}
                      </span>
                      <span className="block">{pickupSite.phoneNumber}</span>
                    </address>
                  ) : (
                    <address className="not-italic">
                      <span className="block">
                        {customer.firstName} {customer.lastName}
                      </span>
                      <span className="block">
                        {deliveryAddress?.street1}, {deliveryAddress?.street2}
                      </span>
                      <span className="block">
                        {deliveryAddress?.city}, {deliveryAddress?.zip}
                      </span>
                      <span className="block">{customer.contactNumber}</span>
                    </address>
                  )}
                </dd>
              </div>
            </dl>
          </div>
        )}
        <h3 className="sr-only">Items</h3>
        {children}
      </div>
    </div>
  );
};

export const OnlineOrderInvoice = forwardRef(
  (
    {
      title,
      orderId,
      orderStatus,
      dateTime,
      delivery,
      customer,
      deliveryAddress,
      site,
      pickupSite,
      data,
      qrValue,
      qrHelper,
      children,
    },
    ref
  ) => {
    return (
      <div ref={ref}>
        <OnlineInvoiceBody
          title={title}
          orderId={orderId}
          orderStatus={orderStatus}
          dateTime={dateTime}
          delivery={delivery}
          customer={customer}
          deliveryAddress={deliveryAddress}
          site={site}
          pickupSite={pickupSite}
          data={data}
          qrValue={qrValue}
          qrHelper={qrHelper}
        >
          {children}
        </OnlineInvoiceBody>
      </div>
    );
  }
);
