import { useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { stockTransferApi } from "../../../../environments/Api";
import { scanItemStockTransfer } from "../../../../stores/slices/stocktransferSlice";
import {
  ConfirmSection,
  PickPackList,
  ScanItemsSection,
} from "../../Procurement/ProcurementPickPack";

export const StockTransferPickPack = () => {
  const { addToast } = useToasts();
  const { subsys, order, lineItems, setLineItems, userSiteId, openInvoice } =
    useOutletContext();
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
    const { data } = await stockTransferApi.pickPack(order.id, userSiteId);
    const { lineItems } = data;
    setLineItems(
      lineItems.map((item) => ({
        ...item,
        product: {
          sku: item.product.sku,
          productFields: item.product.productFields,
        },
      }))
    );
    addToast(
      `Order #${order.id}  ${
        status === "PICKED" ? "has completed picking" : "is ready for shipping"
      }.`,
      {
        appearance: "success",
        autoDismiss: true,
      }
    );
    if (status === "PACKED") {
      openInvoice();
      navigate(`/${subsys}/stocktransfer/${order.id}/delivery`);
    }
  };
  const handleScan = (barcode) => {
    dispatch(scanItemStockTransfer({ orderId: order.id, barcode }))
      .unwrap()
      .then((data) => {
        const { lineItems: lIs } = data;
        setLineItems(
          lineItems.map((item, index) => ({
            ...item,
            fulfilledQty: lIs[index].fulfilledQty,
          }))
        );
        addToast(`Successfully picked ${search}.`, {
          appearance: "success",
          autoDismiss: true,
        });
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
      if (status.status === "ACCEPTED") {
        handlePickPack();
      }
      handleScan(e.target.value);
    }
    setSearch(e.target.value);
  };

  return (
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
                        order.status === "PICKED" ? "picked" : "packed"
                      }`}
                      body={`Confirm that all the items in this order have been ${
                        order.status === "PICKED" ? "picked" : "packed"
                      }?
                  This action cannot be undone, and this order will advance to the
                  ${order.status === "PICKED" ? "packing" : "delivery"} stage.`}
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
                order.fromSite.id === userSiteId && (
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
                <PickPackList data={lineItems} setData={setLineItems} />
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
