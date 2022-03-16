import { useOutletContext } from "react-router-dom";
import { procurementApi } from "../../../../environments/Api";
import { ConfirmSection } from "../ProcurementPickPack";

export const ProcurementDelivery = () => {
  const {
    procurementId,
    subsys,
    status,
    setStatus,
    setStatusHistory,
    manufacturing,
    warehouse,
    // lineItems,
    setLineItems,
    addToast,
    currSiteId,
  } = useOutletContext();

  const onConfirmClicked = async () => {
    const { data } = await (status.status === "READY_FOR_SHIPPING"
      ? procurementApi.shipOrder(procurementId)
      : procurementApi.receiveOrder(procurementId, currSiteId));
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
  };

  return (
    <div className="flex justify-center">
      {status.status === "READY_FOR_SHIPPING" && manufacturing.id === currSiteId ? (
        <ConfirmSection
          subsys={subsys}
          procurementId={procurementId}
          title={"Confirm items shipped"}
          body={
            "Confirm that all the items in this order have been shipped? This action cannot be undone."
          }
          onConfirmClicked={onConfirmClicked}
        />
      ) : status.status === "SHIPPING" && warehouse.id === currSiteId ? (
        <ConfirmSection
          subsys={subsys}
          procurementId={procurementId}
          title={"Confirm items received"}
          body={
            "Confirm that all the items in this order have been? This action cannot be undone."
          }
          onConfirmClicked={onConfirmClicked}
        />
      ) : (
        <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
          <span className="mt-2 block text-base font-medium text-gray-900">
            No items to{" "}
            {["SHIPPING", "SHIPPED", "COMPLETED"].some(
              (s) => s === status.status
            )
              ? "receive"
              : "deliver"}
            .
          </span>
        </div>
      )}
    </div>
  );
};
