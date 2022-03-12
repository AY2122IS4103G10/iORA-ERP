import { CheckIcon } from "@heroicons/react/outline";
import { useMemo } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { procurementApi } from "../../../../environments/Api";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const PickPackList = ({ subsys, data, status, setData }) => {
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
        // Cell: (row) =>
        //   status === "PENDING" ||
        //   status === "CANCELLED" ||
        //   status === "ACCEPTED"
        //     ? "-"
        //     : row.row.original.fulfilledProductItems.length,
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
      //     return status === "SHIPPED" && subsys === "wh" ? (
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
  }, [setData, status, subsys]);
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Picking / Packing List
        </h3>
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

export const ScanItemsSection = ({
  search,
  onSearchChanged,
  onScanClicked,
}) => {
  return (
    <div className="pt-8">
      <div>
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Scan Items
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-700">
          <p>
            Scan barcode or enter product SKU. Scan once to "pick", a second
            time to "pack".
          </p>
        </div>
        <form className="mt-5 sm:flex sm:items-center" onSubmit={onScanClicked}>
          <div className="w-full sm:max-w-xs">
            <label htmlFor="sku" className="sr-only">
              SKU
            </label>
            <input
              type="text"
              name="sku"
              id="sku"
              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
              placeholder="XXXXXXXXXX-X"
              value={search}
              onChange={onSearchChanged}
              autoFocus
            />
          </div>
          <button
            type="submit"
            className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
          >
            Scan
          </button>
        </form>
      </div>
    </div>
  );
};

const ConfirmManufacturedSection = ({
  subsys,
  procurementId,
  onConfirmManufacturedClicked,
}) => {
  const navigate = useNavigate();
  return (
    <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-sm transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
      <div>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            Confirm Items Manufactured
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">
              Confirm that all the items in this order have been manufactured?
              This action cannot be undone, and this order well advance to the
              picking and packing stage.
            </p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:col-start-2 sm:text-sm"
          onClick={onConfirmManufacturedClicked}
        >
          Confirm
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() => navigate(`/${subsys}/procurements/${procurementId}`)}
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const ProcurementPickPack = () => {
  const navigate = useNavigate();
  const { procurementId, subsys, status, lineItems, setLineItems } =
    useOutletContext();
  const [search, setSearch] = useState("");

  const onConfirmManufacturedClicked = () => {
    procurementApi
      .manufactureOrder(procurementId)
      .then((response) => {
        const { lineItems } = response.data;
        setLineItems(
          lineItems.map((item) => ({
            ...item,
            product: {
              sku: item.product.sku,
              productFields: item.product.productFields,
            },
          }))
        );
      })
      .then(() => navigate(`/${subsys}/procurements/${procurementId}`));
  };
  const onScanClicked = (evt) => {
    evt.preventDefault();
    procurementApi.scanItem(procurementId, search).then((response) => {
      const { lineItems } = response.data;
      setLineItems(
        lineItems.map((item) => ({
          ...item,
          product: {
            sku: item.product.sku,
            productFields: item.product.productFields,
          },
        }))
      );
    });
  };
  const onSearchChanged = (e) => setSearch(e.target.value);

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        {["MANUFACTURED", "PICKING", "PICKED", "PACKING", "PACKED"].some(
          (s) => s === status.status
        ) ? (
          <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              {(subsys === "mf" || subsys === "wh") && (
                <>
                  <section aria-labelledby="scan-items">
                    <ScanItemsSection
                      search={search}
                      onSearchChanged={onSearchChanged}
                      onScanClicked={onScanClicked}
                    />
                  </section>
                  <section aria-labelledby="order-summary">
                    <PickPackList
                      subsys={subsys}
                      data={lineItems}
                      status={status.status}
                      setData={setLineItems}
                    />
                  </section>
                </>
              )}
            </div>
          </div>
        ) : status.status === "ACCEPTED" ? (
          <section aria-labelledby="confirm-manufactured">
            <ConfirmManufacturedSection
              subsys={subsys}
              procurementId={procurementId}
              onConfirmManufacturedClicked={onConfirmManufacturedClicked}
            />
          </section>
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            <span className="mt-2 block text-base font-medium text-gray-900">
              No items to pick / pack.
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
