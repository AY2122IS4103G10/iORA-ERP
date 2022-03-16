import { forwardRef } from "react";
import QRCode from "qrcode.react";
import Barcode from "react-barcode";
import moment from "moment";

export const ProcurementInvoiceBody = ({
  title,
  orderId,
  orderStatus,
  company,
  createdBy,
  fromSite,
  toSite,
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
            <dt className="font-medium text-gray-900">{company.name}</dt>
            <dd className="mt-2 text-gray-700">
              <address className="not-italic">
                <span className="block">
                  {company.address.road}
                  {company.address.unit !== "NIL" &&
                    `, #${company.address.unit}`}
                </span>
                <span className="block">
                  {company.address.city}, {company.address.postalCode}
                </span>
                <span className="block">{company.telephone}</span>
              </address>
            </dd>
            <dd className="mt-2 text-gray-700">
              <div className="my-10">
                <QRCode
                  id={orderId}
                  value={qrValue}
                  size={150}
                  level={"H"}
                  includeMargin={false}
                />
                <p className="mt-2 text-gray-700">
                  {qrHelper && qrHelper}
                </p>
              </div>
            </dd>
          </div>
          <div>
            <dd>
              <Barcode
                value="barcode-example"
                width={1}
                height={40}
                displayValue={false}
                margin={0}
              />
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">No.</dt>
                <dd className="text-indigo-600 mt-2">{orderId}</dd>
              </dl>
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">Date</dt>
                <dd className="text-indigo-600 mt-2">
                  {moment
                    .unix(orderStatus.timeStamp / 1000)
                    .format("DD/MM/YYYY, hh:mm:ss")}
                </dd>
              </dl>
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">Status</dt>
                <dd className="text-indigo-600 mt-2">{orderStatus.status}</dd>
              </dl>

              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">Tracking number</dt>
                <dd className="text-indigo-600 mt-2">51547878755545848512</dd>
              </dl>
              <dl className="mt-4 text-sm font-medium">
                <dt className="text-gray-900">For enquiries, call</dt>
                <dd className="text-gray-700 mt-2">
                  <address className="not-italic">
                    <span className="block">{createdBy.name}</span>
                    <span className="block">{createdBy.phoneNumber}</span>
                  </address>
                </dd>
              </dl>
            </dd>
          </div>
        </dl>
      </div>

      <div className="border-t border-gray-200">
        <h2 className="sr-only">Your order</h2>
        <div>
          <h4 className="sr-only">Addresses</h4>
          <dl className="border-b border-gray-200 grid grid-cols-2 gap-x-6 text-sm py-10">
            <div>
              <dt className="font-medium text-gray-900">Shipping From</dt>
              <dd className="mt-2 text-gray-700">
                <address className="not-italic">
                  <span className="block">{fromSite.name}</span>
                  <span className="block">{fromSite.address.road}</span>
                  <span className="block">
                    {fromSite.address.city}, {fromSite.address.postalCode}
                  </span>
                  <span className="block">{fromSite.phoneNumber}</span>
                </address>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Shipping To</dt>
              <dd className="mt-2 text-gray-700">
                <address className="not-italic">
                  <span className="block">{toSite.name}</span>
                  <span className="block">{toSite.address.road}</span>
                  <span className="block">
                    {toSite.address.city}, {toSite.address.postalCode}
                  </span>
                  <span className="block">{toSite.phoneNumber}</span>
                </address>
              </dd>
            </div>
          </dl>
        </div>
        <h3 className="sr-only">Items</h3>
        {children}
      </div>
    </div>
  );
};

export const ProcurementInvoice = forwardRef(
  (
    {
      title,
      orderId,
      orderStatus,
      company,
      createdBy,
      fromSite,
      toSite,
      data,
      qrValue,
      qrHelper,
      children,
    },
    ref
  ) => {
    return (
      [company, createdBy, fromSite, toSite].every(Boolean) && (
        <div ref={ref}>
          <ProcurementInvoiceBody
            title={title}
            orderId={orderId}
            orderStatus={orderStatus}
            company={company}
            createdBy={createdBy}
            fromSite={fromSite}
            toSite={toSite}
            data={data}
            qrValue={qrValue}
            qrHelper={qrHelper}
          >
            {children}
          </ProcurementInvoiceBody>
        </div>
      )
    );
  }
);
