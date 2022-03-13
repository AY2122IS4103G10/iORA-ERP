import { CheckIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import { procurementApi } from "../../../../environments/Api";
import { ConfirmSection } from "../ProcurementPickPack";

export const ProcurementDelivery = () => {
  const {
    procurementId,
    subsys,
    status,
    setStatus,
    headquarters,
    manufacturing,
    warehouse,
    lineItems,
    setLineItems,
    componentRef,
    handlePrint,
    addToast,
  } = useOutletContext();

  const onConfirmClicked = () => {
    status.status === "READY_FOR_SHIPPING" &&
      procurementApi
        .shipOrder(procurementId)
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
        })
        .then(() => {
          addToast(`Order #${procurementId} has been shipped.`, {
            appearance: "success",
            autoDismiss: true,
          });
        });
  };

  return (
    ["READY_FOR_SHIPPING", "SHIPPING", "SHIPPED", "COMPLETED"].some(
      (s) => s === status.status
    ) ? (
      <div className="flex justify-center">
        <ConfirmSection
          subsys={subsys}
          procurementId={procurementId}
          title={`Confirm items ${
            status.status === "READY_FOR_SHIPPING" ? "shipped" : "received"
          }`}
          body={`Confirm that all the items in this order have been ${
            status.status === "READY_FOR_SHIPPING" ? "shipped" : "received"
          }? This action cannot be undone.`}
          onConfirmClicked={onConfirmClicked}
        />
      </div>
    ) : <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
    <span className="mt-2 block text-base font-medium text-gray-900">
      No items to deliver.
    </span>
  </div>
  );
};
