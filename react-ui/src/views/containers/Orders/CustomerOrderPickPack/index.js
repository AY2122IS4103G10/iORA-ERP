import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { procurementApi } from "../../../../environments/Api";
import { scanItem } from "../../../../stores/slices/procurementSlice";
import { ConfirmSection, PickPackList, ScanItemsSection } from "../../Procurement/ProcurementPickPack";

export const CustomerOrderPickPack = () => {
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
          : "is ready for shipping"
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
    // procurementApi
    //   .pickPack(procurementId)
    //   .then((response) => {
    //     const { lineItems, statusHistory } = response.data;
    //     setLineItems(
    //       lineItems.map((item) => ({
    //         ...item,
    //         product: {
    //           sku: item.product.sku,
    //           productFields: item.product.productFields,
    //         },
    //       }))
    //     );
    //     setStatus({
    //       status: statusHistory[statusHistory.length - 1].status,
    //       timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
    //     });
    //     setStatusHistory(statusHistory);
    //   })
    //   .then(() => {
    //     addToast(
    //       `Order #${procurementId}  ${
    //         status.status === "MANUFACTURED"
    //           ? "has begun picking"
    //           : status.status === "PICKED"
    //           ? "has completed picking"
    //           : "is ready for shipping"
    //       }.`,
    //       {
    //         appearance: "success",
    //         autoDismiss: true,
    //       }
    //     );
    //     if (status.status === "PACKED") {
    //       openInvoice();
    //       navigate(`/${subsys}/procurements/${procurementId}/delivery`);
    //     }
    //   });
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
      if (status.status === "MANUFACTURED") {
        handlePickPack();
      }
      handleScan(e.target.value);
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
