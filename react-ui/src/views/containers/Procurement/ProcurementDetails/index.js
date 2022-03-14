import { useLocation } from "react-router-dom";
import { useMemo } from "react";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { useOutletContext } from "react-router-dom";
import { CheckIcon, ThumbUpIcon, UserIcon } from "@heroicons/react/outline";
import { classNames } from "../../../../utilities/Util";
import moment from "moment";

const eventTypes = {
  created: { icon: UserIcon, bgColorClass: "bg-gray-400" },
  action: { icon: ThumbUpIcon, bgColorClass: "bg-blue-500" },
  completed: { icon: CheckIcon, bgColorClass: "bg-green-500" },
};

const ItemsSummary = ({
  data,
  status,
  setData,
  pathname,
  onVerifyReceivedClicked,
}) => {
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
        Header: "Requested",
        accessor: "requestedQty",
      },
      {
        Header: "Fulfilled",
        accessor: "fulfilledQty",
        disableSortBy: true,
      },
      // {
      //   Header: "Shipped",
      //   accessor: "",
      //   Cell: (row) => {
      //     return status === "SHIPPED" ||
      //       status === "VERIFIED" ||
      //       status === "COMPLETED"
      //       ? row.row.original.fulfilledProductItems.length
      //       : "-";
      //   },
      // },
      // {
      //   Header: "Received",
      //   accessor: "actualQty",
      //   Cell: (row) => {
      //     return status === "SHIPPED" && pathname.includes("wh") ? (
      //       <EditableCell
      //         value={0}
      //         row={row.row}
      //         column={row.column}
      //         updateMyData={updateMyData}
      //       />
      //     ) : (
      //       "-"
      //     );
      //   },
      // },
    ];
  }, []);
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Summary</h3>
        <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
          {status === "SHIPPED" && pathname.includes("wh") ? (
            <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
              onClick={onVerifyReceivedClicked}
            >
              Verify items
            </button>
          ) : (
            <div></div>
          )}
        </div>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <SimpleTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
};

const ProcurementDetailsBody = ({
  pathname,
  history,
  status,
  lineItems,
  manufacturing,
  headquarters,
  warehouse,
  setLineItems,
  onFulfilClicked,
  onVerifyReceivedClicked,
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-3">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Site Information*/}
      <section aria-labelledby="order-information-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Order Information
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">{status}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Created by
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <address className="not-italic">
                    <span className="block">{headquarters.name}</span>
                    <span className="block">{headquarters.address.road}</span>
                    <span className="block">
                      {headquarters.address.city},{" "}
                      {headquarters.address.postalCode}
                    </span>
                    <span className="block">{headquarters.phoneNumber}</span>
                  </address>
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">From</dt>
                <dd className="mt-1 text-sm text-gray-900">
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
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">To</dt>
                <dd className="mt-1 text-sm text-gray-900">
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
        </div>
      </section>
      <section aria-labelledby="order-summary">
        <ItemsSummary
          data={lineItems}
          status={status}
          setData={setLineItems}
          pathname={pathname}
          onFulfilClicked={onFulfilClicked}
          onVerifyReceivedClicked={onVerifyReceivedClicked}
        />
      </section>
    </div>
    <section
      aria-labelledby="timeline-title"
      className="lg:col-start-3 lg:col-span-1"
    >
      <div className="bg-white px-4 py-5 shadow sm:rounded-lg sm:px-6">
        <h2 id="timeline-title" className="text-lg font-medium text-gray-900">
          Activity
        </h2>

        {/* Activity Feed */}
        <div className="mt-6 flow-root">
          <ul className="-mb-8">
            {history.map((item, itemIdx) => (
              <li key={item.id}>
                <div className="relative pb-8">
                  {itemIdx !== history.length - 1 ? (
                    <span
                      className="absolute top-4 left-4 -ml-px h-full w-0.5 bg-gray-200"
                      aria-hidden="true"
                    />
                  ) : null}
                  <div className="relative flex space-x-3">
                    <div>
                      <span
                        className={classNames(
                          item.type.bgColorClass,
                          "h-8 w-8 rounded-full flex items-center justify-center ring-8 ring-white"
                        )}
                      >
                        <item.type.icon
                          className="w-5 h-5 text-white"
                          aria-hidden="true"
                        />
                      </span>
                    </div>
                    <div className="min-w-0 flex-1 pt-1.5 flex justify-between space-x-4">
                      <div>
                        <p className="text-sm text-gray-500">
                          {item.content}{" "}
                          <span className="font-medium text-gray-900">
                            {item.target}
                          </span>
                        </p>
                      </div>
                      <div className="text-right text-sm whitespace-nowrap text-gray-500">
                       {item.date}
                      </div>
                    </div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  </div>
);

export const ProcurementDetails = () => {
  const {
    procurementId,
    subsys,
    status,
    statusHistory,
    headquarters,
    manufacturing,
    warehouse,
    lineItems,
    setLineItems,
  } = useOutletContext();
  const { pathname } = useLocation();
  console.log(lineItems);
  console.log(statusHistory)
  const history = statusHistory.map(
    ({ status, actionBy, timeStamp }, index) => {
      return {
        id: index,
        type:
          status === "PENDING"
            ? eventTypes.created
            : ["MANUFACTURING", "PICKING", "PACKING", "SHIPPING"].some(
                (s) => s === status
              )
            ? eventTypes.action
            : eventTypes.completed,
        content:
          status === "PENDING"
            ? "Created by"
            : status === "READY_FOR_SHIPPING"
            ? "Ready for shipping by"
            : `${status.charAt(0) + status.slice(1)} by`,
        target: actionBy.name,
        date: moment.unix(timeStamp / 1000).format("DD/MM, H:mm"),
      };
    }
  );
  return (
    [
      procurementId,
      headquarters,
      manufacturing,
      warehouse,
      history.length,
    ].every(Boolean) && (
      <ProcurementDetailsBody
        subsys={subsys}
        procurementId={procurementId}
        status={status.status}
        statusHistory={statusHistory}
        manufacturing={manufacturing}
        headquarters={headquarters}
        warehouse={warehouse}
        lineItems={lineItems}
        setLineItems={setLineItems}
        pathname={pathname}
        history={history}
        // onFulfilClicked={onFulfilClicked}
      />
    )
  );
};
