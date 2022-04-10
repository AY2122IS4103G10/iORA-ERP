import { useMemo } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import {
  adjustAtFrom,
  pickPackStockTransfer,
  scanItemStockTransfer,
} from "../../../../stores/slices/stocktransferSlice";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import {
  ConfirmSection,
  ScanItemsSection,
} from "../../Procurement/ProcurementPickPack";

const PickPackList = ({
  data,
  status,
  setShowConfirm,
  handlePickPack,
  setData,
  manufacturing,
  currSiteId,
  onSaveQuanityClicked,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  const columns = useMemo(() => {
    const handleEditRow = (rowIndex) => {
      setData((item) =>
        item.map((row, index) => ({ ...row, isEditing: rowIndex === index }))
      );
    };

    const onSaveClicked = (rowIndex, obj) => {
      if (status === "MANUFACTURED" || status === "ACCEPTED")
        handlePickPack().then(() => handleSaveRow(rowIndex, obj));
      else handleSaveRow(rowIndex, obj);
    };

    const handleSaveRow = (rowIndex, obj) => {
      onSaveQuanityClicked(
        rowIndex,
        obj.product.sku,
        ["MANUFACTURED", "PICKING"].some((s) => s === status)
          ? obj.pickedQty
          : obj.packedQty
      );
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
        Header: "Req",
        accessor: "requestedQty",
      },
      {
        Header: "Picked",
        accessor: "pickedQty",
        Cell: (e) => {
          return e.row.original.isEditing &&
            ["MANUFACTURED", "PICKING", "ACCEPTED"].some(
              (s) => s === status
            ) ? (
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
        Header: "Packed",
        accessor: "packedQty",
        Cell: (e) => {
          return e.row.original.isEditing &&
            ["PACKING"].some((s) => s === status) ? (
            <EditableCell
              value={e.value}
              row={e.row}
              column={e.column}
              updateMyData={updateMyData}
              min="0"
              max={e.row.original.pickedQty}
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
          return lineItem.pickedQty === 0
            ? "READY"
            : lineItem.pickedQty !== lineItem.requestedQty
            ? "PICKING"
            : lineItem.pickedQty === lineItem.requestedQty &&
              lineItem.packedQty === 0
            ? "PICKED"
            : lineItem.packedQty !== lineItem.requestedQty
            ? "PACKING"
            : "PACKED";
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
                  : onSaveClicked(e.row.index, e.row.original)
              }
            >
              {!e.row.original.isEditing ? "Edit" : "Save"}
            </button>
          );
        },
      },
    ];
  }, [setData, status, handlePickPack,  onSaveQuanityClicked]);

  const hiddenColumns =
    manufacturing.id !== currSiteId ||
    ["MANUFACTURED", "PICKING", "PACKING", "ACCEPTED"].every(
      (s) => s !== status
    )
      ? ["[editButton]"]
      : [];

  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Picking / Packing List
        </h3>
        {data
          .map((item) =>
            status === "PICKING" || status === "ACCEPTED"
              ? item.pickedQty
              : item.packedQty
          )
          .every((qty) => qty !== 0) &&
          manufacturing.id === currSiteId && (
            <button
              type="button"
              className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              <span>
                Complete {status === "PICKING" ? "Picking" : "Packing"}
              </span>
            </button>
          )}
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <form>
            <SimpleTable
              columns={columns}
              data={data}
              skipPageReset={skipPageReset}
              hiddenColumns={hiddenColumns}
            />
          </form>
        </div>
      )}
    </div>
  );
};

export const StockTransferPickPack = () => {
  const {
    subsys,
    order,
    lineItems,
    setLineItems,
    userSiteId,
    openInvoiceModal,
    addToast,
    setAction,
    openConfirmModal,
  } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const status = order.statusHistory[order.statusHistory.length - 1]?.status;

  const onConfirmClicked = () => handlePickPack();

  const onScanClicked = (evt) => {
    evt.preventDefault();
    if (status === "ACCEPTED") handlePickPack().then(() => handleScan(search));
    else handleScan(search);
  };

  const handlePickPack = async () => {
    await dispatch(
      pickPackStockTransfer({ orderId: order.id, siteId: userSiteId })
    )
      .unwrap()
      .then(() => {
        addToast(
          `Order #${order.id}  ${
            status === "ACCEPTED"
              ? "has begun picking"
              : status === "PICKED"
              ? "has begun packing"
              : "is ready for delivery"
          }.`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
        if (status === "PACKED") {
          openInvoiceModal();
          navigate(`/${subsys}/stocktransfer/${order.id}/delivery`);
        }
      })
      .catch((error) => {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const handleScan = (barcode) => {
    dispatch(scanItemStockTransfer({ orderId: order.id, barcode }))
      .unwrap()
      .then(() => {
        addToast(
          `Successfully ${
            status === "PICKING" ? "picked" : "packed"
          } ${barcode}.`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      })
      .catch((error) => {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const onSearchChanged = (e) => {
    e.preventDefault();
    if (
      e.target.value.length - search.length > 10 &&
      e.target.value.includes("-")
    ) {
      if (status === "ACCEPTED")
        handlePickPack().then(() => handleScan(e.target.value));
      else handleScan(e.target.value);
    }
    setSearch(e.target.value);
  };

  const onSaveQuanityClicked = async (_, sku, qty) => {
    await dispatch(adjustAtFrom({ orderId: order.id, sku, qty }))
      .unwrap()
      .then(() => {
        addToast(`Success: Updated quantity.`, {
          appearance: "success",
          autoDismiss: true,
        });
      })
      .catch((error) => {
        addToast(`Error: ${error.response.data}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };
  return (
    <>
      <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
        <div className="space-y-6 lg:col-start-1 lg:col-span-2">
          <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              {["ACCEPTED", "PICKING", "PICKED", "PACKING", "PACKED"].some(
                (s) => s === status
              ) ? (
                ["PICKED", "PACKED"].some((s) => s === status) ? (
                  order.fromSite.id === userSiteId ? (
                    <section
                      aria-labelledby="confirm-manufactured"
                      className="flex justify-center"
                    >
                      <ConfirmSection
                        subsys={subsys}
                        procurementId={order.id}
                        title={`Confirm items ${
                          status === "PICKED" ? "picked" : "packed"
                        }`}
                        body={`Confirm that all the items in this order have been ${
                          status === "PICKED" ? "picked" : "packed"
                        }?
                  This action cannot be undone, and this order will advance to the
                  ${status === "PICKED" ? "packing" : "delivery"} stage.`}
                        onConfirmClicked={onConfirmClicked}
                        cancelPath={`/${subsys}/stocktransfer/${order.id}`}
                      />
                    </section>
                  ) : (
                    <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                      <span className="mt-2 block text-base font-medium text-gray-900">
                        {status === "PICKED"
                          ? "Items have been picked"
                          : "Items are ready to be delivered."}
                      </span>
                    </div>
                  )
                ) : (
                  order.fromSite.id === userSiteId &&
                  subsys !== "lg" && (
                    <section aria-labelledby="scan-items">
                      <ScanItemsSection
                        search={search}
                        onSearchChanged={onSearchChanged}
                        onScanClicked={onScanClicked}
                      />
                    </section>
                  )
                )
              ) : (
                <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                  <span className="mt-2 block text-base font-medium text-gray-900">
                    No items to pick / pack.
                  </span>
                </div>
              )}
              {["ACCEPTED", "PICKING", "PICKED", "PACKING", "PACKED"].some(
                (s) => s === status
              ) && (
                <section aria-labelledby="order-summary">
                  <PickPackList
                    data={lineItems}
                    status={status}
                    setData={setLineItems}
                    setAction={setAction}
                    openConfirmModal={openConfirmModal}
                    handlePickPack={handlePickPack}
                    procurementId={order.id}
                    manufacturing={order.fromSite}
                    currSiteId={userSiteId}
                    onSaveQuanityClicked={onSaveQuanityClicked}
                  />
                </section>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
