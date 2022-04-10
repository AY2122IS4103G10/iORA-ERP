import { useMemo } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { onlineOrderApi } from "../../../../environments/Api";
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
  setData,
  handlePickPack,
  onSaveQuanityClicked,
  site,
  currSiteId,
  delivery,
  pickupSite,
}) => {
  const [skipPageReset, setSkipPageReset] = useState(false);
  const columns = useMemo(() => {
    const handleEditRow = (rowIndex) => {
      setData((item) =>
        item.map((row, index) => ({ ...row, isEditing: rowIndex === index }))
      );
    };

    const onSaveClicked = (rowIndex, obj) => {
      if (status === "PENDING")
        handlePickPack().then(() => handleSaveRow(rowIndex, obj));
      else handleSaveRow(rowIndex, obj);
    };

    const handleSaveRow = (rowIndex, obj) => {
      onSaveQuanityClicked(
        rowIndex,
        obj.product.sku,
        ["PENDING", "PICKING"].some((s) => s === status)
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
        accessor: "qty",
      },
      {
        Header: "Picked",
        accessor: "pickedQty",
        Cell: (e) => {
          return e.row.original.isEditing &&
            ["PICKING", "PENDING"].some((s) => s === status) ? (
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
        accessor: "",
        Cell: (row) => {
          const lineItem = row.row.original;
          return lineItem.pickedQty === 0
            ? "READY"
            : lineItem.pickedQty !== lineItem.qty
            ? "PICKING"
            : lineItem.pickedQty === lineItem.qty && lineItem.packedQty === 0
            ? "PICKED"
            : lineItem.packedQty !== lineItem.qty
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
  }, [handlePickPack, setData, status, onSaveQuanityClicked]);
  const hiddenColumns =
    site.id !== currSiteId ||
    ["PENDING", "PICKING", "PACKING"].every((s) => s !== status)
      ? ["[editButton]"]
      : [];
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
            hiddenColumns={hiddenColumns}
          />
        </div>
      )}
    </div>
  );
};

export const OnlineOrderPickPack = () => {
  const { addToast } = useToasts();
  const {
    subsys,
    orderId,
    currSiteId,
    status: st,
    setStatus,
    setStatusHistory,
    lineItems,
    setLineItems,
    openInvoice,
    pickupSite,
    site,
    delivery,
  } = useOutletContext();

  const status = st.status;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const onConfirmClicked = () => handlePickPack();

  const onScanClicked = (evt) => {
    evt.preventDefault();
    handleScan(search);
  };

  const handlePickPack = async () => {
    const { data } = await onlineOrderApi.pickPack(orderId, currSiteId);
    const { statusHistory } = data;
    setStatus(statusHistory[statusHistory.length - 1]);
    setStatusHistory(statusHistory);
    addToast(
      `Order #${orderId}  ${
        status === "PENDING"
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
      openInvoice();
      navigate(`/${subsys}/orders/${orderId}`);
    }
  };

  const handleScan = async (barcode) => {
    try {
      const { data } = await onlineOrderApi.scanItem(orderId, barcode);
      const { lineItems: lIs, statusHistory } = data;
      setLineItems(
        lineItems.map((item, index) => ({
          ...item,
          pickedQty: lIs[index].pickedQty,
          packedQty: lIs[index].packedQty,
        }))
      );
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      addToast(
        `Successfully ${
          status === "PICKING" || status === "PENDING" ? "picked" : "packed"
        } ${barcode}.`,
        {
          appearance: "success",
          autoDismiss: true,
        }
      );
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setSearch("");
    }
  };

  const onSearchChanged = (e) => {
    if (
      e.target.value.length - search.length > 10 &&
      e.target.value.includes("-")
    ) {
      if (status === "PENDING")
        handlePickPack().then(() => handleScan(e.target.value));
      else handleScan(e.target.value);
    }
    setSearch(e.target.value);
  };
  const onSaveQuanityClicked = async (rowIndex, sku, qty) => {
    try {
      const { data } = await onlineOrderApi.adjustProduct(orderId, sku, qty);
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
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  return (
    <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
      <div className="space-y-6 lg:col-start-1 lg:col-span-2">
        <div className="max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
          <div className="space-y-6 lg:col-start-1 lg:col-span-2">
            {["PENDING", "PICKING", "PICKED", "PACKING", "PACKED"].some(
              (s) => s === status
            ) ? (
              ["PICKED", "PACKED"].some((s) => s === status) ? (
                site.id === currSiteId ? (
                  <section
                    aria-labelledby="confirm"
                    className="flex justify-center"
                  >
                    <ConfirmSection
                      subsys={subsys}
                      procurementId={orderId}
                      title={`Confirm items ${
                        status === "PICKED" ? "picked" : "packed"
                      }`}
                      body={`Confirm that all the items in this order have been ${
                        status === "PICKED" ? "picked" : "packed"
                      }?
                  This action cannot be undone, and this order will advance to the
                  ${status === "PICKED" ? "packing" : "delivery"} stage.`}
                      onConfirmClicked={onConfirmClicked}
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
                site.id === currSiteId && (
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
            {["PENDING", "PICKING", "PICKED", "PACKING", "PACKED"].some(
              (s) => s === status
            ) &&
              ["sm", "wh", "str"].some((s) => s === subsys) && (
                <section aria-labelledby="order-summary">
                  <PickPackList
                    data={lineItems}
                    status={status}
                    setData={setLineItems}
                    handlePickPack={handlePickPack}
                    onSaveQuanityClicked={onSaveQuanityClicked}
                    site={site}
                    currSiteId={currSiteId}
                    delivery={delivery}
                    pickupSite={pickupSite}
                  />
                </section>
              )}
          </div>
        </div>
      </div>
    </div>
  );
};
