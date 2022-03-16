import { CheckIcon } from "@heroicons/react/outline";
import { useMemo } from "react";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { procurementApi } from "../../../../environments/Api";
import { scanItem } from "../../../../stores/slices/procurementSlice";
import {
  EditableCell,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

export const PickPackList = ({ data, setData }) => {
  const [isEditing, setIsEditing] = useState(false);
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
        Header: "Req",
        accessor: "requestedQty",
      },
      {
        Header: "Picked",
        accessor: "pickedQty",
        Cell: (e) => {
          return isEditing ? (
            <EditableCell
              value={e.value}
              row={e.row}
              column={e.column}
              updateMyData={updateMyData}
              min="0"
            />
          ) : (
            e.value
          );
        },
      },
      {
        Header: "Packed",
        accessor: "packedQty",
      },
      {
        Header: "Status",
        accessor: "",
        Cell: (row) => {
          const lineItem = row.row.original;
          return lineItem.pickedQty !== lineItem.requestedQty
            ? "PICKING"
            : lineItem.pickedQty === lineItem.requestedQty &&
              lineItem.packedQty === 0
            ? "PICKED"
            : lineItem.packedQty !== lineItem.requestedQty
            ? "PACKING"
            : "PACKED";
        },
      },
      // {
      //   Header: "",
      //   accessor: "options",
      //   Cell: () => (
      //     <button
      //       className="text-indigo-600 hover:text-indigo-900"
      //       onClick={() => setIsEditing(!isEditing)}
      //     >
      //       Edit
      //     </button>
      //   ),
      // },
    ];
  }, [isEditing, setData]);
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

export const ConfirmSection = ({
  subsys,
  procurementId,
  title,
  body,
  onConfirmClicked,
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
          onClick={onConfirmClicked}
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
  } = useOutletContext();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const onConfirmClicked = () => {
    status.status === "ACCEPTED"
      ? procurementApi
          .manufactureOrder(procurementId)
          .then((response) => {
            const { lineItems, statusHistory } = response.data;
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
          })
          .then(() => {
            addToast(`Order #${procurementId} has completed manufacturing.`, {
              appearance: "success",
              autoDismiss: true,
            });
          })
      : handlePickPack();
  };

  const onScanClicked = (evt) => {
    evt.preventDefault();
    if (status.status === "MANUFACTURED")
      handlePickPack().then(() => handleScan(search));
    else handleScan(search);
  };

  const handlePickPack = async () => {
    const { data } = await procurementApi.pickPack(procurementId);
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
    addToast(
      `Order #${procurementId}  ${
        status.status === "MANUFACTURED"
          ? "has begun picking"
          : status.status === "PICKED"
          ? "has completed picking"
          : "is ready for shipping. Please print the delivery invoice."
      }.`,
      {
        appearance: "success",
        autoDismiss: true,
      }
    );
    if (status.status === "PACKED") {
      openInvoice();
      navigate(`/${subsys}/procurements/${procurementId}/delivery`);
    }
  };

  const handleScan = (barcode) => {
    dispatch(scanItem({ orderId: procurementId, barcode }))
      .unwrap()
      .then((data) => {
        const { lineItems: lIs, statusHistory } = data;
        setLineItems(
          lineItems.map((item, index) => ({
            ...item,
            pickedQty: lIs[index].pickedQty,
            packedQty: lIs[index].packedQty,
          }))
        );
        setStatus({
          status: statusHistory[statusHistory.length - 1].status,
          timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
        });
        setStatusHistory(statusHistory);
      })
      .then(() => {
        addToast(`Successfully picked ${barcode}.`, {
          appearance: "success",
          autoDismiss: true,
        });
        setSearch("");
      })
      .catch((error) => {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const onSearchChanged = (e) => {
    if (
      e.target.value.length - search.length > 10 &&
      e.target.value.includes("-")
    ) {
      if (status.status === "MANUFACTURED")
        handlePickPack().then(() => handleScan(e.target.value));
      else handleScan(e.target.value);
    }
    setSearch(e.target.value);
  };

  // const onSaveQtyClicked = () => {
  // }

  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {[
              "ACCEPTED",
              "MANUFACTURED",
              "PICKING",
              "PICKED",
              "PACKING",
              "PACKED",
            ].some((s) => s === status.status) ? (
              ["ACCEPTED", "PICKED", "PACKED"].some(
                (s) => s === status.status
              ) ? (
                subsys === "mf" ? (
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
                          : status.status === "PICKED"
                          ? "picked"
                          : "packed"
                      }`}
                      body={`Confirm that all the items in this order have been ${
                        status.status === "ACCEPTED"
                          ? "manufactured"
                          : status.status === "PICKED"
                          ? "picked"
                          : "packed"
                      }?
                  This action cannot be undone, and this order will advance to the
                  ${
                    status.status === "ACCEPTED"
                      ? "picking"
                      : status.status === "PICKED"
                      ? "packing"
                      : "delivery"
                  } stage.`}
                      onConfirmClicked={onConfirmClicked}
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
                subsys === "mf" && (
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
            {["MANUFACTURED", "PICKING", "PICKED", "PACKING", "PACKED"].some(
              (s) => s === status.status
            ) &&
              ["sm", "mf", "wh"].some((s) => s === subsys) && (
                <section aria-labelledby="order-summary">
                  <PickPackList data={lineItems} setData={setLineItems} />
                </section>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
