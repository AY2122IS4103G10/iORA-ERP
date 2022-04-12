import { CheckIcon } from "@heroicons/react/outline";
import { useMemo } from "react";
import { useState } from "react";
// import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api, procurementApi } from "../../../../environments/Api";
// import { scanItem } from "../../../../stores/slices/procurementSlice";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

export const PickPackList = ({
  data,
  status,
  setShowConfirm,
  handlePickPack,
  setData,
  manufacturing,
  currSiteId,
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
              manufacturing.id === currSiteId &&
              ["MANUFACTURED", "PICKING", "ACCEPTED", "PACKING"].some(
                (s) => s === status
              ) ? (
              <EditableCell
                value={row.row.original.siteQuantities[storeId]}
                row={row.row}
                column={row.column}
                updateMyData={updateSiteCol}
                min="0"
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
              [status === "PICKING" || status === "MANUFACTURED"
                ? "pickedQty"
                : "packedQty"]: Object.values({
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
        item.map((row, index) => ({ ...row, isEditing: rowIndex === index }))
      );
    };

    const onSaveClicked = (evt, rowIndex) => {
      evt.preventDefault();
      if (status === "MANUFACTURED" || status === "ACCEPTED")
        handlePickPack().then(() => handleSaveRow(rowIndex));
      else handleSaveRow(rowIndex);
    };

    const handleSaveRow = (rowIndex) => {
      setData((old) =>
        old.map((row, index) => {
          if (index === rowIndex) {
            return {
              ...old[rowIndex],
              [status === "PICKING" || status === "MANUFACTURED"
                ? "pickedQty"
                : "packedQty"]: Object.values(old[rowIndex].siteQuantities)
                .map((val) => parseInt(val))
                .reduce((partialSum, a) => partialSum + a, 0),
              isEditing: false,
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
        Header: "Sites",
        accessor: "siteQuantities",
        columns: siteCols,
      },
      {
        Header: "Req",
        accessor: "requestedQty",
      },
      {
        Header: "Picked",
        accessor: "pickedQty",
      },
      {
        Header: "Packed",
        accessor: "packedQty",
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
                  : onSaveClicked(evt, e.row.index)
              }
            >
              {!e.row.original.isEditing ? "Edit" : "Save"}
            </button>
          );
        },
      },
    ];
  }, [setData, status, handlePickPack, data, currSiteId, manufacturing]);

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
              flex
            />
          </form>
        </div>
      )}
    </div>
  );
};

export const ScanItemsSection = ({
  search,
  searchHelper,
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
          <p>{searchHelper}</p>
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

export const ConfirmSection = ({
  title,
  body,
  onConfirmClicked,
  cancelPath,
  setShowConfirm,
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
          onClick={() => {
            onConfirmClicked();
            setShowConfirm && setShowConfirm(false);
          }}
        >
          Confirm
        </button>
        <button
          type="button"
          className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:col-start-1 sm:text-sm"
          onClick={() =>
            setShowConfirm ? setShowConfirm(false) : navigate(cancelPath)
          }
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export const ProcurementPickPack = () => {
  const { addToast } = useToasts();
  const {
    procurementId,
    subsys,
    status,
    setStatus,
    setStatusHistory,
    lineItems,
    setLineItems,
    openInvoice,
    openConfirmModal,
    manufacturing,
    currSiteId,
  } = useOutletContext();
  // const dispatch = useDispatch();
  const navigate = useNavigate();
  // const [search, setSearch] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);

  const manufactureOrder = async () => {
    try {
      const { data } = await procurementApi.manufactureOrder(procurementId);
      const { statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      addToast(`Order #${procurementId} has completed manufacturing.`, {
        appearance: "success",
        autoDismiss: true,
      });
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  const onConfirmClicked = () => {
    status.status === "ACCEPTED" ? manufactureOrder() : onSaveQuantityClicked();
  };

  // const onScanClicked = (evt) => {
  //   evt.preventDefault();
  //   if (status.status === "MANUFACTURED")
  //     handlePickPack().then(() => handleScan(search));
  //   else handleScan(search);
  // };

  const handlePickPack = async () => {
    try {
      const { data } = await procurementApi.pickPack(procurementId);
      const { statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      if (status.status !== "PICKING") {
        addToast(
          `Order #${procurementId}  ${
            status.status === "MANUFACTURED"
              ? "has begun picking"
              : status.status === "PICKED"
              ? "has begun packing"
              : "is ready for shipping. Please print the delivery invoice"
          }.`,
          {
            appearance: "success",
            autoDismiss: true,
          }
        );
      }
      if (status.status === "PACKED") {
        openInvoice();
        navigate(`/${subsys}/procurements/${procurementId}/delivery`);
      }
      if (showConfirm) setShowConfirm(false);
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };

  // const handleScan = (barcode) => {
  //   dispatch(scanItem({ orderId: procurementId, barcode }))
  //     .unwrap()
  //     .then((data) => {
  //       const { lineItems: lIs, statusHistory } = data;
  //       setLineItems(
  //         lineItems.map((item, index) => ({
  //           ...item,
  //           pickedQty: lIs[index].pickedQty,
  //           packedQty: lIs[index].packedQty,
  //         }))
  //       );
  //       setStatus(statusHistory[statusHistory.length - 1]);
  //       setStatusHistory(statusHistory);
  //       addToast(
  //         `Successfully  ${
  //           status.status === "PICKING" || status.status === "MANUFACTURED"
  //             ? "picked"
  //             : "packed"
  //         } ${barcode}.`,
  //         {
  //           appearance: "success",
  //           autoDismiss: true,
  //         }
  //       );
  //       setSearch("");
  //     })
  //     .catch((error) => {
  //       addToast(`Error: ${error.message}`, {
  //         appearance: "error",
  //         autoDismiss: true,
  //       });
  //       setSearch("");
  //     });
  // };

  // const onSearchChanged = (e) => {
  //   if (
  //     e.target.value.length - search.length > 10 &&
  //     e.target.value.includes("-")
  //   ) {
  //     if (status.status === "MANUFACTURED")
  //       handlePickPack().then(() => handleScan(e.target.value));
  //     else handleScan(e.target.value);
  //   }
  //   setSearch(e.target.value);
  // };

  const onSaveQuantityClicked = async () => {
    try {
      const { data } = await api.update(
        `manufacturing/procurementOrder/${
          status.status === "PICKING" ? "pick" : "pack"
        }`,
        {
          id: procurementId,
          lineItems,
        }
      );
      const { lineItems: lIs, statusHistory } = data;
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      setLineItems(
        lineItems.map((row, index) => ({
          ...row,
          pickedQty: lIs[index].pickedQty,
          packedQty: lIs[index].packedQty,
          isEditing: true,
        }))
      );
      setShowConfirm(false);
      addToast(
        `Successfully completed ${
          status.status === "PICKING" ? "picking" : "packing"
        }.`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
      if (
        statusHistory[statusHistory.length - 1].status === "READY_FOR_SHIPPING"
      ) {
        navigate(`/${subsys}/procurements/${procurementId}/delivery`);
        openInvoice();
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
        {[
          "ACCEPTED",
          "MANUFACTURED",
          "PICKING",
          "PICKED",
          "PACKING",
          "PACKED",
        ].some((s) => s === status.status) ? (
          ["ACCEPTED", "PICKED", "PACKED"].some((s) => s === status.status) ||
          showConfirm ? (
            manufacturing.id === currSiteId ? (
              <section
                aria-labelledby="confirm-manufactured"
                className="flex justify-center"
              >
                <ConfirmSection
                  subsys={subsys}
                  procurementId={procurementId}
                  title={`Confirm items ${
                    status.status === "ACCEPTED"
                      ? "manufactured"
                      : status.status === "PICKING"
                      ? "picked"
                      : "packed"
                  }`}
                  body={`Confirm that all the items in this order have been ${
                    status.status === "ACCEPTED"
                      ? "manufactured"
                      : status.status === "PICKING"
                      ? "picked"
                      : "packed"
                  }?
                  This action cannot be undone, and this order will advance to the
                  ${
                    status.status === "ACCEPTED"
                      ? "picking"
                      : status.status === "PICKING"
                      ? "packing"
                      : "delivery"
                  } stage.`}
                  onConfirmClicked={onConfirmClicked}
                  setShowConfirm={setShowConfirm}
                />
              </section>
            ) : (
              <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
                <span className="mt-2 block text-base font-medium text-gray-900">
                  {status.status === "ACCEPTED"
                    ? "Items are being manufactured."
                    : status.status === "PICKED"
                    ? "Items have been picked"
                    : "Items are ready to be delivered."}
                </span>
              </div>
            )
          ) : (
            // subsys === "mf" && (
            //   <section aria-labelledby="scan-items">
            //     <ScanItemsSection
            //       search={search}
            //       searchHelper={`Scan barcode or enter product SKU. Scan once to "pick", a second
            //       time to "pack".`}
            //       onSearchChanged={onSearchChanged}
            //       onScanClicked={onScanClicked}
            //     />
            //   </section>
            // )
            <div></div>
          )
        ) : (
          <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
            <span className="mt-2 block text-base font-medium text-gray-900">
              No items to pick / pack.
            </span>
          </div>
        )}
        {["MANUFACTURED", "PICKING", "PICKED", "PACKING", "PACKED"].some(
          (s) => s === status.status
        ) &&
          ["sm", "mf", "wh"].some((s) => s === subsys) && (
            <section aria-labelledby="order-summary">
              <PickPackList
                data={lineItems}
                status={status.status}
                openConfirmModal={openConfirmModal}
                handlePickPack={handlePickPack}
                procurementId={procurementId}
                setShowConfirm={setShowConfirm}
                setData={setLineItems}
                manufacturing={manufacturing}
                currSiteId={currSiteId}
              />
            </section>
          )}
      </div>
    </div>
  );
};
