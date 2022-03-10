import { useLocation } from "react-router-dom";
import { useMemo, useState } from "react";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { useOutletContext } from "react-router-dom";

const ItemsSummary = ({
  data,
  status,
  setData,
  pathname,
  onVerifyReceivedClicked,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  const columns = useMemo(() => {
    const updateMyData = (rowIndex, columnId, value) => {
      setSkipPageReset(true);
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: value,
            };
          }
          return row;
        })
      );
    };
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
        Cell: (row) =>
          status === "PENDING" ||
          status === "CANCELLED" ||
          status === "ACCEPTED"
            ? "-"
            : row.row.original.fulfilledProductItems.length,
      },
      {
        Header: "Shipped",
        accessor: "",
        Cell: (row) => {
          return status === "SHIPPED" ||
            status === "VERIFIED" ||
            status === "COMPLETED"
            ? row.row.original.fulfilledProductItems.length
            : "-";
        },
      },
      {
        Header: "Received",
        accessor: "actualQty",
        Cell: (row) => {
          return status === "SHIPPED" && pathname.includes("wh") ? (
            <EditableCell
              value={0}
              row={row.row}
              column={row.column}
              updateMyData={updateMyData}
            />
          ) : (
            "-"
          );
        },
      },
    ];
  }, [setData, status, pathname]);
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
          <SimpleTable
            columns={columns}
            data={data}
            skipPageReset={skipPageReset}
          />
        </div>
      )}
    </div>
  );
};

const ProcurementDetailsBody = ({
  pathname,
  status,
  lineItems,
  manufacturing,
  headquarters,
  warehouse,
  setLineItems,
  onFulfilClicked,
  onVerifyReceivedClicked,
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
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
                  {headquarters.name}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">From</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {manufacturing ? manufacturing.name : "-"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">To</dt>
                <dd className="mt-1 text-sm text-gray-900">{warehouse.name}</dd>
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
  </div>
);

export const ProcurementDetails = () => {
  const {
    procurementId,
    subsys,
    status,
    headquarters,
    manufacturing,
    warehouse,
    lineItems,
    setLineItems,
  } = useOutletContext();
  // const { procurementId } = useParams();
  const { pathname } = useLocation();

  return (
    [procurementId, headquarters, manufacturing, warehouse].every(Boolean) && (
      <ProcurementDetailsBody
        subsys={subsys}
        procurementId={procurementId}
        status={status.status}
        manufacturing={manufacturing}
        headquarters={headquarters}
        warehouse={warehouse}
        lineItems={lineItems}
        setLineItems={setLineItems}
        pathname={pathname}
        // onFulfilClicked={onFulfilClicked}
      />
    )
  );
};
