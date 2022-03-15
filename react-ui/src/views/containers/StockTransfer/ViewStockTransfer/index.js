import { PrinterIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useState } from "react";
import { useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { eventTypes } from "../../../../constants/eventTypes";
import { sitesApi } from "../../../../environments/Api";
import { ActivitySection } from "../../Procurement/ProcurementDetails";
import { fetchAllModelsBySkus } from "../StockTransferForm";
import { LineItems } from "../StockTransferWrapper";

export const StockTransferBody = ({
  order,
  lineItems,
  userSiteId,
  history,
}) => {
  let status = order.statusHistory[order.statusHistory.length - 1].status;
  let orderMadeBy = order.statusHistory[0].actionBy.name;

  return (
    <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        <section aria-labelledby="stocktransfer-view">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6 grid grid-cols-2">
              <h2
                id="applicant-information-title"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Order Information
              </h2>
              <button
                className=" text-sm flex justify-end"
                onClick={() => window.print()}
              >
                Print
                <PrinterIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>

            <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
              <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Status</dt>
                  <dd className="mt-1 text-sm text-gray-900">{status}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">
                    Created By
                  </dt>
                  <dd className="mt-1 text-sm text-gray-900">{orderMadeBy}</dd>
                </div>

                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">From</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      <span className="block">{order.fromSite.name}</span>
                      <span className="block">
                        {order.fromSite.address.road}
                      </span>
                      <span className="block">
                        {order.fromSite.address.city},{" "}
                        {order.fromSite.address.postalCode}
                      </span>
                      <span className="block">
                        {order.fromSite.phoneNumber}
                      </span>
                    </address>
                  </dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">To</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    <address className="not-italic">
                      <span className="block">{order.toSite.name}</span>
                      <span className="block">{order.toSite.address.road}</span>
                      <span className="block">
                        {order.toSite.address.city},{" "}
                        {order.toSite.address.postalCode}
                      </span>
                      <span className="block">{order.toSite.phoneNumber}</span>
                    </address>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </section>
      </div>
      {history && <ActivitySection history={history} />}
      <div className="lg:col-start-1 lg:col-span-3">
        {lineItems !== undefined &&
        lineItems !== undefined &&
        Object.keys(lineItems).length !== 0 ? (
          <LineItems
            lineItems={lineItems}
            status={status}
            userSiteId={userSiteId}
            fromSiteId={order.fromSite.id}
            toSiteId={order.toSite.id}
            editable={false}
          />
        ) : (
          <p>loading</p>
        )}
      </div>
    </div>
  );
};

export const ViewStockTransfer = () => {
  const { order, lineItems, userSiteId } = useOutletContext();
  const [history, setHistory] = useState([]);
  const [lItems, setLItems] = useState([]);

  const fetchActionBy = async (actionBy) => {
    const { data } = await sitesApi.getSiteSAM(
      Boolean(actionBy.id) ? actionBy.id : actionBy
    );
    return data;
  };

  useEffect(() => {
    const fetchAllActionBy = async () => {
      return Promise.all(
        order.statusHistory.map(({ actionBy }) => fetchActionBy(actionBy))
      );
    };
    fetchAllActionBy().then((data) => {
      setHistory(
        order.statusHistory.map(({ status, timeStamp }, index) => {
          return {
            id: index,
            type:
              status === "PENDING"
                ? index === 0
                  ? eventTypes.created
                  : eventTypes.action
                : ["PICKING", "PACKING", "SHIPPING"].some((s) => s === status)
                ? eventTypes.action
                : status === "CANCELLED"
                ? eventTypes.cancelled
                : eventTypes.completed,
            content:
              status === "PENDING"
                ? `${index === 0 ? "Created" : "Updated"} by`
                : status === "READY_FOR_SHIPPING"
                ? "Ready for shipping by"
                : `${status.charAt(0) + status.slice(1).toLowerCase()} by`,
            target: data[index].name,
            date: moment(timeStamp).format("DD/MM, H:mm"),
          };
        })
      );
    });
  }, [order]);
  useEffect(() => {
    fetchAllModelsBySkus(lineItems).then((data) => {
      setLItems(
        lineItems.map((item, index) => ({
          ...item,
          product: {
            ...item.product,
            modelCode: data[index].modelCode,
            name: data[index].name,
          },
        }))
      );
    });
  }, [lineItems]);
  // console.log(history)
  return (
    <StockTransferBody
      order={order}
      lineItems={lItems}
      userSiteId={userSiteId}
      history={history}
    />
  );
};
