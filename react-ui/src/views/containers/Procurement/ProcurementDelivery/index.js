import { CheckIcon } from "@heroicons/react/solid";
import { useState } from "react";
import { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { api, procurementApi } from "../../../../environments/Api";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { ConfirmSection } from "../ProcurementPickPack";

const DeliveryList = ({
  data,
  setData,
  status,
  warehouse,
  currSiteId,
  setShowConfirm,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  const columns = useMemo(() => {
    const siteCols = data.length
      ? Object.keys(data[0]?.siteQuantities).map((store) => ({
          Header: () => (
            <div className="flex items-center justify-between">
              <span>{store}</span>
            </div>
          ),
          minWidth: 100,
          maxWidth: 130,
          accessor: `siteQuantities.${store}`,
          Cell: (row) => {
            const storeId = parseInt(row.column.id.split(".")[1]);
            return row.row.original.isEditing &&
              warehouse.id === currSiteId &&
              ["SHIPPING", "SHIPPING_MULTIPLE"].some((s) => s === status) ? (
              <EditableCell
                value={row.row.original.siteQuantities[storeId]}
                row={row.row}
                column={row.column}
                updateMyData={updateSiteCol}
              />
            ) : (
              row.value
            );
          },
        }))
      : [];
    const updateSiteCol = (rowIndex, columnId, value) => {
      const split = columnId.split(".");
      columnId = split[0];
      const storeId = split[1];
      setSkipPageReset(true);
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [columnId]: { ...old[rowIndex][columnId], [storeId]: value },
              receivedQty: Object.values({
                ...old[rowIndex][columnId],
                [storeId]: value,
              })
                .map((val) => parseInt(val))
                .reduce((partialSum, a) => partialSum + a, 0),
            };
          }
          return row;
        })
      );
    };
    const handleEditRow = (evt, rowIndex) => {
      evt.preventDefault();
      setData((item) =>
        item.map((row, index) => {
          if (index === rowIndex) return { ...row, isEditing: true };
          return row;
        })
      );
    };

    const handleSaveRow = (evt, rowIndex) => {
      evt.preventDefault();
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              receivedQty: Object.values(old[rowIndex].siteQuantities)
                .map((val) => parseInt(val))
                .reduce((partialSum, a) => partialSum + a, 0),
              isEditing: false,
            };
          }
          return row;
        })
      );
    };

    // const updateMyData = (rowIndex, columnId, value) => {
    //   setSkipPageReset(true);
    //   setData((old) =>
    //     old.map((row, index) => {
    //       if (index === rowIndex) {
    //         return {
    //           ...old[rowIndex],
    //           [columnId]: value,
    //         };
    //       }
    //       return row;
    //     })
    //   );
    // };
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
        Header: "Sites",
        accessor: "siteQuantities",
        columns: siteCols,
      },
      {
        Header: "To Deliver",
        accessor: "packedQty",
      },
      {
        Header: "Received",
        accessor: "receivedQty",
        // Cell: (e) => {
        //   return e.row.original.isEditing &&
        //     ["SHIPPING", "SHIPPING_MULTIPLE"].some((s) => s === status) ? (
        //     <EditableCell
        //       value={e.value}
        //       row={e.row}
        //       column={e.column}
        //       updateMyData={updateMyData}
        //       min="0"
        //       max={e.row.original.requestedQty}
        //     />
        //   ) : (
        //     e.value
        //   );
        // },
      },
      {
        Header: "",
        accessor: "[editButton]",
        Cell: (e) => {
          return (
            <button
              className="text-cyan-600 hover:text-cyan-900"
              onClick={(evt) =>
                !e.row.original.isEditing
                  ? handleEditRow(evt, e.row.index)
                  : handleSaveRow(evt, e.row.index)
              }
            >
              {!e.row.original.isEditing ? "Edit" : "Save"}
            </button>
          );
        },
      },
    ];
  }, [status, setData, data, currSiteId, warehouse]);
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
        {data.map((item) => item.receivedQty).every((qty) => qty !== 0) &&
          warehouse.id === currSiteId && (
            <button
              type="button"
              className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={() => {
                setShowConfirm(true);
              }}
            >
              <span>Complete</span>
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
  // const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

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

  // const onScanClicked = (evt) => {
  //   evt.preventDefault();
  //   handleScan(search);
  // };
  // const handleScan = async (barcode) => {
  //   try {
  //     const { data } = await procurementApi.scanReceive(procurementId, barcode);
  //     const { lineItems: lIs, statusHistory } = data;
  //     const status = statusHistory[statusHistory.length - 1];
  //     setLineItems(
  //       lineItems.map((item, index) => ({
  //         ...item,
  //         receivedQty: lIs[index].receivedQty,
  //       }))
  //     );
  //     setStatus(status);
  //     setStatusHistory(statusHistory);
  //     addToast(`Received ${barcode}.`, {
  //       appearance: "success",
  //       autoDismiss: true,
  //     });
  //     setSearch("");
  //     if (status.status === "COMPLETED") {
  //       addToast(`Order ${procurementId} completed.`, {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });
  //       navigate(`/${subsys}/procurements/${procurementId}`);
  //     }
  //   } catch (error) {
  //     addToast(`Error: ${error.response.data}`, {
  //       appearance: "error",
  //       autoDismiss: true,
  //     });
  //   }
  // };

  // const onSearchChanged = (e) => {
  //   if (
  //     e.target.value.length - search.length > 10 &&
  //     e.target.value.includes("-")
  //   ) {
  //     handleScan(e.target.value);
  //   }
  //   setSearch(e.target.value);
  // };
  const onSaveQuantityClicked = async () => {
    try {
      const { data } = await api.update(`warehouse/procurementOrder/receive`, {
        id: procurementId,
        lineItems,
      });
      const { lineItems: lIs, statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      setLineItems(
        lineItems.map((row, index) => ({
          ...row,
          pickedQty: lIs[index].pickedQty,
          packedQty: lIs[index].packedQty,
        }))
      );
      setShowConfirm(false);
      addToast(`Order ${procurementId} completed.`, {
        appearance: "success",
        autoDismiss: true,
      });
      navigate(`/${subsys}/procurements/${procurementId}`);
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onConfirmClicked = () => onSaveQuantityClicked();
  console.log(lineItems);
  return (
    <div className="space-y-6 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-12 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        {["READY_FOR_SHIPPING", "SHIPPING", "SHIPPING_MULTIPLE"].some(
          (s) => s === status.status
        ) || showConfirm ? (
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
            // (status.status === "SHIPPING" ||
            //   status.status === "SHIPPING_MULTIPLE") &&
            // warehouse.id === currSiteId && (
            //   <section aria-labelledby="scan-items">
            //     <ScanItemsSection
            //       search={search}
            //       searchHelper={`Scan barcode or enter product SKU to confirm receipt of item.`}
            //       onSearchChanged={onSearchChanged}
            //       onScanClicked={onScanClicked}
            //     />
            //   </section>
            // )
            showConfirm && (
              <div className="flex justify-center">
                <ConfirmSection
                  subsys={subsys}
                  procurementId={procurementId}
                  title="Confirm items received"
                  body="Confirm that all the items in this order have been received?
            This action cannot be undone, and this order will be marked as completed."
                  onConfirmClicked={onConfirmClicked}
                  setShowConfirm={setShowConfirm}
                />
              </div>
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
                onSaveQuantityClicked={onSaveQuantityClicked}
                warehouse={warehouse}
                currSiteId={currSiteId}
                setShowConfirm={setShowConfirm}
              />
            </section>
          )}
      </div>
    </div>
  );
};
