import { useState } from "react";
import { useMemo } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {
  adjustAtTo,
  completeStockTransfer,
  deliverMultipleStockTransfer,
  deliverStockTransfer,
  scanReceiveStockTransfer,
} from "../../../../stores/slices/stocktransferSlice";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { NumDeliveriesSection } from "../../Procurement/ProcurementDelivery";
import { ScanItemsSection } from "../../Procurement/ProcurementPickPack";

const DeliveryList = ({
  data,
  setData,
  status,
  setAction,
  openConfirmModal,
  onCompleteClicked,
  order,
  userSiteId,
  onSaveQuantityClicked,
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
      {
        Header: "Received",
        accessor: "receivedQty",
        Cell: (e) => {
          return e.row.original.isEditing &&
            ["DELIVERING", "DELIVERING_MULTIPLE"].some((s) => s === status) ? (
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
  }, [status, onSaveQuantityClicked, setData]);
  const hiddenColumns =
    order.toSite.id !== userSiteId ||
    ["DELIVERING", "DELIVERING_MULTIPLE"].every((s) => s !== status)
      ? ["[editButton]"]
      : [];
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Delivery List
        </h3>
        {(status === "DELIVERING" || status === "DELIVERING_MULTIPLE") &&
          order.toSite.id === userSiteId && (
            <button
              type="button"
              className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={() => {
                setAction({
                  name: "Complete",
                  action: onCompleteClicked,
                  body: `The quantity received of one or more items have not reached their quantity delivered.
                Are you sure you want to complete "Order #${order.id}"? 
                This action cannot be undone.`,
                });
                openConfirmModal();
              }}
            >
              <span>Complete Order</span>
            </button>
          )}
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

export const StockTransferDelivery = () => {
  const {
    subsys,
    order,
    lineItems,
    setLineItems,
    addToast,
    userSiteId,
    setAction,
    openConfirmModal,
  } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const status = order.statusHistory[order.statusHistory.length - 1]?.status;

  const onMultipleClicked = () => {
    dispatch(deliverMultipleStockTransfer(order.id))
      .unwrap()
      .then(() => {
        addToast(`Order #${order.id} has been delivered.`, {
          appearance: "success",
          autoDismiss: true,
        });
        navigate(`/${subsys}/stocktransfer`);
      });
  };

  const onSingleClicked = () => {
    dispatch(deliverStockTransfer(order.id))
      .unwrap()
      .then(() => {
        addToast(`Order #${order.id} has been delivered.`, {
          appearance: "success",
          autoDismiss: true,
        });
        navigate(`/${subsys}/stocktransfer`);
      });
  };

  const onCompleteClicked = () => {
    dispatch(completeStockTransfer(order.id))
      .unwrap()
      .then(() => {
        addToast(`Order #${order.id} has been delivered.`, {
          appearance: "success",
          autoDismiss: true,
        });
      });
  };

  const onScanClicked = (evt) => {
    evt.preventDefault();
    handleScan(search);
  };
  const handleScan = (barcode) => {
    dispatch(scanReceiveStockTransfer({ orderId: order.id, barcode }))
      .unwrap()
      .then(() => {
        addToast(`Received ${barcode}.`, {
          appearance: "success",
          autoDismiss: true,
        });
        setSearch("");
        if (status === "COMPLETED") {
          addToast(`Order ${order.id} completed.`, {
            appearance: "success",
            autoDismiss: true,
          });
          navigate(`/${subsys}/stocktransfer/${order.id}`);
        }
      })
      .catch((error) =>
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        })
      );
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
  const onSaveQuantityClicked = async (_, sku, qty) => {
    await dispatch(adjustAtTo({ orderId: order.id, sku, qty }))
      .unwrap()
      .then(() => {
        addToast(`Success: Updated quantity.`, {
          appearance: "success",
          autoDismiss: true,
        });
        if (status.status === "COMPLETED") {
          addToast(`Order ${order.id} completed.`, {
            appearance: "success",
            autoDismiss: true,
          });
          navigate(`/${subsys}/procurements/${order.id}`);
        }
      })
      .catch((error) => {
        addToast(`Error: ${error.response.data}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  return (
    <div className="space-y-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-12 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        {["READY_FOR_DELIVERY", "DELIVERING", "DELIVERING_MULTIPLE"].some(
          (s) => s === status
        ) ? (
          status === "READY_FOR_DELIVERY" &&
          order.fromSite.id === userSiteId &&
          subsys === "lg" ? (
            <div className="flex justify-center">
              <NumDeliveriesSection
                subsys={subsys}
                procurementId={order.id}
                title={"Confirm number of deliveries."}
                body={`Select "Multiple deliveries" if there will be multiple deliveries for this order, otherwise select "Single delivery". This action cannot be undone.`}
                onMultipleClicked={onMultipleClicked}
                onSingleClicked={onSingleClicked}
              />
            </div>
          ) : (
            (status === "DELIVERING" || status === "DELIVERING_MULTIPLE") &&
            order.toSite.id === userSiteId &&
            subsys !== "lg" && (
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
              {["DELIVERING", "DELIVERING_MULTIPLE", "COMPLETED"].some(
                (s) => s === status
              )
                ? "receive"
                : "deliver"}
              .
            </span>
          </div>
        )}
        {["READY_FOR_DELIVERY", "DELIVERING", "DELIVERING_MULTIPLE"].some(
          (s) => s === status
        ) &&
          ["sm", "str", "wh", "lg"].some((s) => s === subsys) && (
            <section aria-labelledby="order-summary">
              <DeliveryList
                data={lineItems}
                setData={setLineItems}
                status={status}
                setAction={setAction}
                onCompleteClicked={onCompleteClicked}
                openConfirmModal={openConfirmModal}
                order={order}
                userSiteId={userSiteId}
                onSaveQuantityClicked={onSaveQuantityClicked}
              />
            </section>
          )}
      </div>
    </div>
  );
};
