import { CheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { procurementApi } from "../../../../environments/Api";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { ScanItemsSection } from "../ProcurementPickPack";

const DeliveryList = ({
  data,
  setData,
  status,
  onSaveQuanityClicked,
  warehouse,
  currSiteId,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  const columns = useMemo(() => {
    const handleEditRow = (rowIndex) => {
      setData((item) =>
        item.map((row, index) => ({ ...row, isEditing: rowIndex === index }))
      );
    };

    const handleSaveRow = (rowIndex, obj) => {
      onSaveQuanityClicked(rowIndex, obj.product.sku, obj.receivedQty);
    };

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
        Header: "To Deliver",
        accessor: "packedQty",
      },
      {
        Header: "Received",
        accessor: "receivedQty",
        Cell: (e) => {
          return e.row.original.isEditing &&
            ["SHIPPING", "SHIPPING_MULTIPLE"].some((s) => s === status) ? (
            <EditableCell
              value={e.value}
              row={e.row}
              column={e.column}
              updateMyData={updateMyData}
              min="0"
              max={e.row.original.requestedQty}
            />
          ) : (
            e.value
          );
        },
      },
      {
        Header: "Status",
        accessor: "[status]",
        Cell: (row) => {
          const lineItem = row.row.original;
          return status === "READY_FOR_SHIPPING"
            ? "READY"
            : lineItem.packedQty !== lineItem.receivedQty
            ? "SHIPPING"
            : "RECEIVED";
        },
      },
      {
        Header: "",
        accessor: "[editButton]",
        Cell: (e) => {
          return (
            <button
              className="text-cyan-600 hover:text-cyan-900"
              onClick={() =>
                !e.row.original.isEditing
                  ? handleEditRow(e.row.index)
                  : handleSaveRow(e.row.index, e.row.original)
              }
            >
              {!e.row.original.isEditing ? "Edit" : "Save"}
            </button>
          );
        },
      },
    ];
  }, [status, onSaveQuanityClicked, setData]);
  const hiddenColumns =
    warehouse.id !== currSiteId ||
    ["SHIPPING", "SHIPPING_MULTIPLE"].every((s) => s !== status)
      ? ["[editButton]"]
      : [];
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Delivery List
        </h3>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <SimpleTable
            columns={columns}
            data={data}
            skipPageReset={skipPageReset}
            hiddenColumns={hiddenColumns}
          />
        </div>
      )}
    </div>
  );
};

export const NumDeliveriesSection = ({
  title,
  body,
  onMultipleClicked,
  onSingleClicked,
}) => {
  return (
    <div className="relative inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-sm transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
      <div>
        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
          <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
        </div>
        <div className="mt-3 text-center sm:mt-5">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {title}
          </h3>
          <div className="mt-2">
            <p className="text-sm text-gray-500">{body}</p>
          </div>
        </div>
      </div>
      <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
        <button
          type="button"
          className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:col-start-2 sm:text-sm"
          onClick={onMultipleClicked}
        >
          Multiple deliveries
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={onSingleClicked}
        >
          Single delivery
        </button>
      </div>
    </div>
  );
};

export const ProcurementDelivery = () => {
  const {
    procurementId,
    subsys,
    status,
    setStatus,
    setStatusHistory,
    manufacturing,
    warehouse,
    lineItems,
    setLineItems,
    addToast,
    currSiteId,
  } = useOutletContext();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const onMultipleClicked = async () => {
    try {
      const { data } = await procurementApi.shipMultiple(procurementId);
      const { lineItems, statusHistory } = data;
      setLineItems(
        lineItems.map((item) => ({
          ...item,
          product: {
            sku: item.product.sku,
            productFields: item.product.productFields,
          },
        }))
      );
      setStatus({
        status: statusHistory[statusHistory.length - 1].status,
        timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
      });
      setStatusHistory(statusHistory);
      addToast(`Order #${procurementId} has begun shipping.`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate("/lg/procurements");
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onSingleClicked = async () => {
    try {
      const { data } = await procurementApi.shipOrder(procurementId);
      const { lineItems, statusHistory } = data;
      setLineItems(
        lineItems.map((item) => ({
          ...item,
          product: {
            sku: item.product.sku,
            productFields: item.product.productFields,
          },
        }))
      );
      setStatus({
        status: statusHistory[statusHistory.length - 1].status,
        timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
      });
      setStatusHistory(statusHistory);
      addToast(`Order #${procurementId} has been shipped.`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate("/lg/procurements");
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onScanClicked = (evt) => {
    evt.preventDefault();
    handleScan(search);
  };
  const handleScan = async (barcode) => {
    try {
      const { data } = await procurementApi.scanReceive(procurementId, barcode);
      const { lineItems: lIs, statusHistory } = data;
      const status = statusHistory[statusHistory.length - 1];
      setLineItems(
        lineItems.map((item, index) => ({
          ...item,
          receivedQty: lIs[index].receivedQty,
        }))
      );
      setStatus(status);
      setStatusHistory(statusHistory);
      addToast(`Received ${barcode}.`, {
        appearance: "success",
        autoDismiss: true,
      });
      setSearch("");
      if (status.status === "COMPLETED") {
        addToast(`Order ${procurementId} completed.`, {
          appearance: "success",
          autoDismiss: true,
        });
        navigate(`/${subsys}/procurements/${procurementId}`);
      }
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onSearchChanged = (e) => {
    if (
      e.target.value.length - search.length > 10 &&
      e.target.value.includes("-")
    ) {
      handleScan(e.target.value);
    }
    setSearch(e.target.value);
  };
  const onSaveQuanityClicked = async (rowIndex, sku, qty) => {
    try {
      const { data } = await procurementApi.adjustAtWarehouse(
        procurementId,
        sku,
        qty
      );
      const { lineItems: lIs, statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      setLineItems(
        lineItems.map((row, index) => ({
          ...row,
          pickedQty: lIs[index].pickedQty,
          packedQty: lIs[index].packedQty,
          isEditing: rowIndex === index && false,
        }))
      );
      addToast(`Success: Updated quantity.`, {
        appearance: "success",
        autoDismiss: true,
      });
      if (status.status === "COMPLETED") {
        addToast(`Order ${procurementId} completed.`, {
          appearance: "success",
          autoDismiss: true,
        });
        navigate(`/${subsys}/procurements/${procurementId}`);
      }
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <div className="space-y-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-12 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        {["READY_FOR_SHIPPING", "SHIPPING", "SHIPPING_MULTIPLE"].some(
          (s) => s === status.status
        ) ? (
          status.status === "READY_FOR_SHIPPING" &&
          manufacturing.id === currSiteId &&
          subsys === "lg" ? (
            <div className="flex justify-center">
              <NumDeliveriesSection
                subsys={subsys}
                procurementId={procurementId}
                title={"Confirm number of deliveries."}
                body={`Select "Multiple deliveries" if there will be multiple deliveries for this order, otherwise select "Single delivery". This action cannot be undone.`}
                onMultipleClicked={onMultipleClicked}
                onSingleClicked={onSingleClicked}
              />
            </div>
          ) : (
            (status.status === "SHIPPING" ||
              status.status === "SHIPPING_MULTIPLE") &&
            warehouse.id === currSiteId && (
              <section aria-labelledby="scan-items">
                <ScanItemsSection
                  search={search}
                  searchHelper={`Scan barcode or enter product SKU to confirm receipt of item.`}
                  onSearchChanged={onSearchChanged}
                  onScanClicked={onScanClicked}
                />
              </section>
            )
          )
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            <span className="mt-2 block text-base font-medium text-gray-900">
              No items to{" "}
              {["SHIPPING", "SHIPPING_MULTIPLE", "COMPLETED"].some(
                (s) => s === status.status
              )
                ? "receive"
                : "deliver"}
              .
            </span>
          </div>
        )}
        {["READY_FOR_SHIPPING", "SHIPPING", "SHIPPING_MULTIPLE"].some(
          (s) => s === status.status
        ) &&
          ["sm", "mf", "wh", "lg"].some((s) => s === subsys) && (
            <section aria-labelledby="order-summary">
              <DeliveryList
                data={lineItems}
                setData={setLineItems}
                status={status.status}
                onSaveQuanityClicked={onSaveQuanityClicked}
                warehouse={warehouse}
                currSiteId={currSiteId}
              />
            </section>
          )}
      </div>
    </div>
  );
};
