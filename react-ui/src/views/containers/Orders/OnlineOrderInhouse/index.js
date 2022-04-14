import { CheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { api, onlineOrderApi } from "../../../../environments/Api";
import { SimpleTable } from "../../../components/Tables/SimpleTable";
import { ConfirmSection } from "../../Procurement/ProcurementPickPack";

const DeliveryList = ({
  data,
  setData,
  status,
  pickupSite,
  currSiteId,
  onSaveQuantityClicked,
  delivery,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  const columns = useMemo(() => {
    const handleEditRow = (rowIndex) => {
      setData((item) =>
        item.map((row, index) => ({ ...row, isEditing: rowIndex === index }))
      );
    };

    const handleSaveRow = (rowIndex, obj) => {
      onSaveQuantityClicked(rowIndex, obj.product.sku, obj.receivedQty);
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
      // {
      //   Header: "Received",
      //   accessor: "receivedQty",
      //   Cell: (e) => {
      //     return e.row.original.isEditing &&
      //       ["DELIVERING", "DELIVERING_MULTIPLE"].some((s) => s === status) ? (
      //       <EditableCell
      //         value={e.value}
      //         row={e.row}
      //         column={e.column}
      //         updateMyData={updateMyData}
      //         min="0"
      //         max={e.row.original.requestedQty}
      //       />
      //     ) : (
      //       e.value
      //     );
      //   },
      // },
      {
        Header: "Status",
        accessor: "",
        Cell: (row) => {
          const lineItem = row.row.original;
          return status === "READY_FOR_DELIVERY"
            ? "READY"
            : lineItem.packedQty !== lineItem.receivedQty
            ? "DELIVERING"
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
  }, [status, setData, onSaveQuantityClicked]);
  const hiddenColumns =
    pickupSite.id !== currSiteId ||
    ["DELIVERING", "DELIVERING_MULTIPLE"].every((s) => s !== status) ||
    (!delivery && pickupSite.id === currSiteId)
      ? ["[editButton]"]
      : [];
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Delivery List
        </h3>
        {/* {data.map((item) => item.receivedQty).every((qty) => qty !== 0) &&
          pickupSite.id === currSiteId && (
            <button
              type="button"
              className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              <span>Complete</span>
            </button>
          )} */}
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

export const OnlineOrderInhouse = () => {
  const {
    orderId,
    subsys,
    status,
    setStatus,
    setStatusHistory,
    site,
    pickupSite,
    lineItems,
    setLineItems,
    addToast,
    currSiteId,
    delivery,
  } = useOutletContext();
  const navigate = useNavigate();
  console.log(lineItems);
  const onMultipleClicked = async () => {
    try {
      const { data } = await onlineOrderApi.deliverMultiple(orderId);
      const { statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      addToast(`Order #${orderId} has begun delivering.`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate("/lg/orders");
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onSingleClicked = async () => {
    try {
      const { data } = await onlineOrderApi.deliverOrder(orderId);
      const { statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      addToast(`Order #${orderId} has been delivered.`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate("/lg/orders");
    } catch (error) {
      console.log(error);
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onSaveQuantityClicked = async () => {
    try {
      const { data } = await api.update(`pickupSite/procurementOrder/receive`, {
        id: orderId,
        lineItems,
      });
      const { lineItems: lIs, statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      setLineItems(
        lIs.map((row, index) => ({
          ...row,
          pickedQty: lIs[index].pickedQty,
          packedQty: lIs[index].packedQty,
        }))
      );
      addToast(`Order ${orderId} completed.`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate(`/${subsys}/procurements/${orderId}`);
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onConfirmClicked = async () => {
    try {
      const { data } = await onlineOrderApi.receive(orderId, currSiteId);
      const { statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);

      addToast(`Order ${orderId} received.`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate(`/${subsys}/orders/${orderId}`);
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  console.log(lineItems);
  return (
    <div className="space-y-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-12 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        {["READY_FOR_DELIVERY", "DELIVERING", "DELIVERING_MULTIPLE"].some(
          (s) => s === status.status
        ) ? (
          status.status === "READY_FOR_DELIVERY" &&
          site.id === currSiteId &&
          subsys === "lg" ? (
            <div className="flex justify-center">
              <NumDeliveriesSection
                subsys={subsys}
                orderId={orderId}
                title={"Confirm number of deliveries."}
                body={`Select "Multiple deliveries" if there will be multiple deliveries for this order, otherwise select "Single delivery". This action cannot be undone.`}
                onMultipleClicked={onMultipleClicked}
                onSingleClicked={onSingleClicked}
              />
            </div>
          ) : (
            pickupSite.id === currSiteId && (
              <div className="flex justify-center">
                <ConfirmSection
                  subsys={subsys}
                  orderId={orderId}
                  title="Confirm items received"
                  body="Confirm that all the items in this order have been received?
            This action cannot be undone, and this order will be marked as completed."
                  onConfirmClicked={onConfirmClicked}
                  cancelPath={`/str/orders/${orderId}`}
                />
              </div>
            )
          )
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            <span className="mt-2 block text-base font-medium text-gray-900">
              No items to{" "}
              {["DELIVERING", "DELIVERING_MULTIPLE", "COMPLETED"].some(
                (s) => s === status.status
              )
                ? "receive"
                : "deliver"}
              .
            </span>
          </div>
        )}
        {["READY_FOR_DELIVERY", "DELIVERING", "DELIVERING_MULTIPLE"].some(
          (s) => s === status.status
        ) &&
          ["sm", "str", "wh", "lg"].some((s) => s === subsys) && (
            <section aria-labelledby="order-summary">
              <DeliveryList
                data={lineItems}
                setData={setLineItems}
                status={status.status}
                onSaveQuantityClicked={onSaveQuantityClicked}
                pickupSite={pickupSite}
                currSiteId={currSiteId}
                delivery={delivery}
              />
            </section>
          )}
      </div>
    </div>
  );
};
