import { XIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import { useMemo } from "react";
import { useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api, onlineOrderApi } from "../../../../environments/Api";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
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

const PackageModal = ({
  open,
  closeModal,
  numPackages,
  onNumPackagesChanged,
  onSaveClicked,
  sizes,
  sizeSelected,
  onSizeSelectedChanged,
  onRemoveClicked,
  loading,
}) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <div className="max-w-3xl mx-auto px-4 py-4 sm:px-6 sm:py-6 lg:px-8 lg:py-8">
          <form onSubmit={onSaveClicked}>
            <div className="space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                  <h3 className="text-lg leading-6 font-medium text-gray-900">
                    Packages
                  </h3>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <SimpleInputGroup
                      label="No. of packages"
                      inputField="packages"
                      className="sm:mt-0 sm:col-span-2 relative flex"
                    >
                      <div className="flex-1 flex items-center justify-between">
                        <span>{numPackages}</span>
                        <button
                          type="submit"
                          className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          onClick={onNumPackagesChanged}
                        >
                          Add
                        </button>
                      </div>
                    </SimpleInputGroup>
                    <ul className="max-h-96 overflow-auto divide-y divide-gray-200">
                      {sizeSelected.map((_, index) => (
                        <li
                          key={index}
                          className="py-4 flex items-center justify-between"
                        >
                          <span className="text-sm">{index + 1}.</span>
                          <div>
                            <select
                              id="countries"
                              name="countries"
                              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm rounded-md"
                              value={sizeSelected[index]}
                              onChange={(e) => {
                                onSizeSelectedChanged(e.target.value, index);
                              }}
                            >
                              {sizes.map((size, index) => (
                                <option key={index} value={size}>
                                  {size}
                                </option>
                              ))}
                            </select>
                          </div>
                          <button
                            className="mr-4"
                            onClick={(evt) => onRemoveClicked(evt, index)}
                          >
                            <XIcon
                              className="h-5 w-5 text-gray-500"
                              aria-hidden="true"
                            />
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={closeModal}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    <span>Confirm</span>
                    {loading && (
                      <div className="ml-3 flex items-center justify-center">
                        <TailSpin color="#FFFFFF" height={20} width={20} />
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </SimpleModal>
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
    openInfoModal,
    setParcelDelivery
  } = useOutletContext();
  const status = st.status;
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [numPackages, setNumPackages] = useState(1);
  const [sizes, setSizes] = useState([]);
  const [sizeSelected, setSizeSelected] = useState([]);
  const [openPackage, setOpenPackage] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchPackageSizes = async () => {
      const { data } = await api.getAll("online/order/parcelSize");
      const sizes = data.map((size) => size.replaceAll("_", " "));
      setSizes(sizes);
      setSizeSelected([sizes[0]]);
    };
    fetchPackageSizes();
  }, []);

  const onNumPackagesChanged = (evt) => {
    evt.preventDefault();
    sizeSelected.push(sizes[0]);
    setNumPackages(sizeSelected.length);
    setSizeSelected(sizeSelected);
  };
  const onSizeSelectedChanged = (e, index) => {
    setSizeSelected(
      sizeSelected.map((size, idx) => (index === idx ? e : size))
    );
  };

  const onRemoveClicked = (evt, idx) => {
    evt.preventDefault();
    if (sizeSelected.length > 1) {
      const s = sizeSelected.filter((_, index) => index !== idx);
      setSizeSelected(s);
      setNumPackages(s.length);
    }
  };

  const onSaveClicked = async (evt) => {
    evt.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.create(
        `online/order/delivery/${orderId}/${currSiteId}`,
        {
          parcelDelivery: sizeSelected.map((size) => ({
            ps: size.replaceAll(" ", "_"),
          })),
        }
      );
      const { parcelDelivery, statusHistory } = data;
      setParcelDelivery(parcelDelivery)
      setStatus(statusHistory[statusHistory.length - 1]);
      setStatusHistory(statusHistory);
      addToast("Order is ready for delivery", {
        appearance: "success",
        autoDismiss: true,
      });
      openInfoModal();
      navigate(`/${subsys}/orders/${orderId}`);
    } catch (error) {
      addToast(`Error: ${error.response.data}`, {
        appearance: "error",
        autoDismiss: true,
      });
    } finally {
      setLoading(false);
    }
  };

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

  const openPackageModal = () => setOpenPackage(true);
  const closePackageModal = () => setOpenPackage(false);

  return (
    <>
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
                        }? This action cannot be undone,
                 ${
                   status === "PICKED"
                     ? "and this order will advance to the packing stage."
                     : subsys === "str"
                     ? "and the customer will be notified that their order is ready for collection."
                     : "and this order will advance to the delivery stage."
                 }
                  `}
                        onConfirmClicked={
                          status === "PACKED" && delivery
                            ? openPackageModal
                            : onConfirmClicked
                        }
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
      {Boolean(sizes.length) && (
        <PackageModal
          open={openPackage}
          closeModal={closePackageModal}
          numPackages={numPackages}
          onNumPackagesChanged={onNumPackagesChanged}
          sizes={sizes}
          sizeSelected={sizeSelected}
          onSizeSelectedChanged={onSizeSelectedChanged}
          onRemoveClicked={onRemoveClicked}
          onSaveClicked={onSaveClicked}
          loading={loading}
        />
      )}
    </>
  );
};
