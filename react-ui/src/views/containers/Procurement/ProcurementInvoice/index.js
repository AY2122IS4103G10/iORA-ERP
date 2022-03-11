import { forwardRef } from "react";
import QRCode from "qrcode.react";
import { useMemo } from "react";
import Barcode from "react-barcode";
import moment from "moment";
import { BasicTable } from "../../../components/Tables/BasicTable";

const ItemsSummary = ({ data, status }) => {
  const columns = useMemo(() => {
    return [
      {
        Header: "SKU",
        accessor: (row) => row.product.sku,
      },
      {
        Header: "Color",
        accessor: (row) =>
          row.product.productFields.find(
            (field) => field.fieldName === "COLOUR"
          ).fieldValue,
      },
      {
        Header: "Size",
        accessor: (row) =>
          row.product.productFields.find((field) => field.fieldName === "SIZE")
            .fieldValue,
      },
      {
        Header: "Quantity",
        accessor: "requestedQty",
      },
    ];
  }, []);
  return (
    <div className="py-8 border-b border-gray-200">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <BasicTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
};

export const ProcurementInvoiceBody = ({
  orderId,
  orderStatus,
  company,
  headquarters,
  manufacturing,
  warehouse,
  data,
  qrValue,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
      <div>
        <div className="space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
          <h1 className="font-extrabold tracking-tight text-5xl">Invoice</h1>
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
                    <span className="block">{headquarters.name}</span>
                    <span className="block">{headquarters.phoneNumber}</span>
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
                  <span className="block">{manufacturing.name}</span>
                  <span className="block">{manufacturing.address.road}</span>
                  <span className="block">
                    {manufacturing.address.city},{" "}
                    {manufacturing.address.postalCode}
                  </span>
                  <span className="block">{manufacturing.phoneNumber}</span>
                </address>
              </dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Shipping To</dt>
              <dd className="mt-2 text-gray-700">
                <address className="not-italic">
                  <span className="block">{warehouse.name}</span>
                  <span className="block">{warehouse.address.road}</span>
                  <span className="block">
                    {warehouse.address.city}, {warehouse.address.postalCode}
                  </span>
                  <span className="block">{warehouse.phoneNumber}</span>
                </address>
              </dd>
            </div>
          </dl>
        </div>
        <h3 className="sr-only">Items</h3>
        <ItemsSummary data={data} status={orderStatus.status} />
        <QRCode
          id="qr-gen"
          value={qrValue}
          size={290}
          level={"H"}
          includeMargin={true}
        />
      </div>
    </div>
  );
};

export const ProcurementInvoice = forwardRef(
  (
    {
      orderId,
      orderStatus,
      company,
      headquarters,
      manufacturing,
      warehouse,
      data,
      qrValue,
    },
    ref
  ) => {
    return (
      [company, headquarters, manufacturing, warehouse].every(Boolean) && (
        <div ref={ref}>
          <ProcurementInvoiceBody
            orderId={orderId}
            orderStatus={orderStatus}
            company={company}
            headquarters={headquarters}
            manufacturing={manufacturing}
            warehouse={warehouse}
            data={data}
            qrValue={qrValue}
          />
        </div>
      )
    );
  }
);
