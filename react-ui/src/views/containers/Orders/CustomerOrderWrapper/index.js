import {
  PencilIcon,
  PrinterIcon,
  TrashIcon,
  XIcon,
} from "@heroicons/react/outline";
import { useRef } from "react";
import { useState } from "react";
import { useEffect } from "react";
import { TailSpin } from "react-loader-spinner";
import { useDispatch, useSelector } from "react-redux";
import { Outlet } from "react-router-dom";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { api, orderApi, procurementApi } from "../../../../environments/Api";
import { deleteExistingProcurement } from "../../../../stores/slices/procurementSlice";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import Confirmation from "../../../components/Modals/Confirmation";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { Tabs } from "../../../components/Tabs";
import { fetchAllModelsBySkus } from "../../StockTransfer/StockTransferForm";

const Header = ({
  subsys,
  disableTabs,
  tabs,
  navigate,
  orderId,
  status,
  openModal,
  onAcceptClicked,
  onCancelOrderClicked,
  onShippedClicked,
  onFulfilClicked,
  openInvoice,
  setAction,
  openConfirm,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev page="Orders" path={`/${subsys}/orders`} />
      <div className="relative pb-5 border-b border-gray-200 sm:pb-0">
        <div className="md:flex md:items-center md:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{`Order #${orderId}`}</h1>
          <div className="mt-3 flex md:mt-0 md:absolute md:top-3 md:right-0">
            {/* <button
              type="button"
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={openInvoice}
            >
              <span>View Invoice</span>
            </button> */}
            <button
              type="button"
              className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              // onClick={handlePrint}
            >
              <PrinterIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Print</span>
            </button>
            {/* {status === "PENDING" ? (
              subsys === "sm" ? (
                <div>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    disabled={status !== "PENDING"}
                    onClick={() =>
                      navigate(`/sm/procurements/edit/${orderId}`)
                    }
                  >
                    <PencilIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </button>

                  <button
                    type="button"
                    className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
                    onClick={openModal}
                    disabled={status !== "PENDING"}
                  >
                    <TrashIcon
                      className="-ml-1 mr-2 h-5 w-5 text-white"
                      aria-hidden="true"
                    />
                    <span>Delete</span>
                  </button>
                </div>
              ) : (
                <div>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                    onClick={() => {
                      setAction({ name: "Accept", action: onAcceptClicked });
                      openConfirm();
                    }}
                    disabled={status !== "PENDING"}
                  >
                    <span>Accept order</span>
                  </button>
                  <button
                    type="button"
                    className="ml-3 inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    onClick={() => {
                      setAction({
                        name: "Cancel",
                        action: onCancelOrderClicked,
                      });
                      openConfirm();
                    }}
                    disabled={status !== "PENDING"}
                  >
                    <span>Cancel order</span>
                  </button>
                </div>
              )
            ) : status === "ACCEPTED" && subsys === "mf" ? (
              <div></div>
            ) : status === "READY" && subsys === "mf" ? (
              <button
                type="button"
                className="ml-3 inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
                onClick={onShippedClicked}
                disabled
              >
                <span>Ship order</span>
              </button>
            ) : (
              <div></div>
            )} */}
          </div>
        </div>
        <div className="mt-4">
          <div className="sm:hidden">
            <label htmlFor="current-tab" className="sr-only">
              Select a tab
            </label>
            <select
              id="current-tab"
              name="current-tab"
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              defaultValue={tabs.find((tab) => tab.current).name}
            >
              {tabs.map((tab) => (
                <option key={tab.name}>{tab.name}</option>
              ))}
            </select>
          </div>
          {!disableTabs && (
            <div className="hidden sm:block">
              <Tabs tabs={tabs} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// const InvoiceModal = ({
//   open,
//   closeModal,
//   orderId,
//   orderStatus,
//   data,
//   qrValue,
//   company,
//   headquarters,
//   manufacturing,
//   warehouse,
//   handlePrint,
// }) => {
//   return (
//     [company, headquarters, manufacturing, warehouse].every(Boolean) && (
//       <SimpleModal open={open} closeModal={closeModal}>
//         <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
//           <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
//             <button
//               type="button"
//               className="mr-10 inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
//               onClick={handlePrint}
//             >
//               <PrinterIcon
//                 className="-ml-1 mr-2 h-5 w-5 text-gray-400"
//                 aria-hidden="true"
//               />
//               <span>Print</span>
//             </button>
//             <button
//               type="button"
//               className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
//               onClick={closeModal}
//             >
//               <span className="sr-only">Close</span>
//               <XIcon className="h-6 w-6" aria-hidden="true" />
//             </button>
//           </div>
//           <ProcurementInvoice
//             orderId={orderId}
//             orderStatus={orderStatus}
//             company={company}
//             headquarters={headquarters}
//             manufacturing={manufacturing}
//             warehouse={warehouse}
//             data={data}
//             qrValue={qrValue}
//           />
//         </div>
//       </SimpleModal>
//     )
//   );
// };

export const CustomerOrderWrapper = ({ subsys }) => {
  const { addToast } = useToasts();
  const { orderId } = useParams();
  const componentRef = useRef();
  const navigate = useNavigate();
  const handlePrint = useReactToPrint({ content: () => componentRef.current });
  const [order, setOrder] = useState(null);
  const [lineItems, setLineItems] = useState([]);
  const [status, setStatus] = useState("");
  const [statusHistory, setStatusHistory] = useState([]);
  const [openDelete, setOpenDelete] = useState(false);
  const [qrValue, setQrValue] = useState("");
  const [open, setOpen] = useState(false);
  const [action, setAction] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [loading, setLoading] = useState(false)
  const currSiteId = useSelector(selectUserSite);

  useEffect(() => {
    const fetchOrder = async () => {
      setLoading(true)
      try {
        const { data } = await orderApi.get(orderId);
        const { lineItems, statusHistory } = data;
        fetchAllModelsBySkus(lineItems).then((data) => {
          setLineItems(
            lineItems.map((item, index) => ({
              ...item,
              product: {
                ...item.product,
                modelCode: data[index].modelCode,
                name: data[index].name,
              },
            }))
          );
        });
        setStatus(statusHistory[statusHistory.length - 1].status);
        setStatusHistory(statusHistory);
        setOrder(data);
        setQrValue(`/${subsys}/orders/${orderId}/pick-pack`);
        setLoading(false)
      } catch (error) {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      }
    };
    fetchOrder();
  }, [subsys, orderId, addToast]);

  // const onDeleteProcurementClicked = () => {
  //   dispatch(
  //     deleteExistingProcurement({
  //       orderId: orderId,
  //       siteId: headquarters.id,
  //     })
  //   )
  //     .unwrap()
  //     .then(() => {
  //       addToast("Successfully deleted procurement order", {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });
  //       closeModal();
  //       navigate("/sm/procurements");
  //     })
  //     .catch((err) =>
  //       addToast(`Error: ${err.message}`, {
  //         appearance: "error",
  //         autoDismiss: true,
  //       })
  //     );
  // };

  // const onCancelOrderClicked = () => {
  //   procurementApi
  //     .cancelOrder(orderId, manufacturing.id)
  //     .then((response) => {
  //       const { statusHistory } = response.data;
  //       setStatus({
  //         status: statusHistory[statusHistory.length - 1].status,
  //         timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
  //       });
  //     })
  //     .then(() => {
  //       addToast("Successfully cancelled procurement order", {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });
  //       closeConfirmModal();
  //     })
  //     .catch((err) =>
  //       addToast(`Error: ${err.message}`, {
  //         appearance: "error",
  //         autoDismiss: true,
  //       })
  //     );
  // };

  // const onFulfilClicked = () => {
  //   procurementApi
  //     .fulfillOrder(manufacturing.id, {
  //       id: orderId,
  //       lineItems,
  //     })
  //     .then((response) => {
  //       const { lineItems, statusHistory } = response.data;
  //       setLineItems(lineItems);
  //       setStatus({
  //         status: statusHistory[statusHistory.length - 1].status,
  //         timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
  //       });
  //     })
  //     .then(() => {
  //       addToast("Successfully fulfilled procurement order", {
  //         appearance: "success",
  //         autoDismiss: true,
  //       });
  //       closeConfirmModal();
  //     })
  //     .catch((err) =>
  //       addToast(`Error: ${err.message}`, {
  //         appearance: "error",
  //         autoDismiss: true,
  //       })
  //     );
  // };

  // const onShippedClicked = () => {
  //   procurementApi
  //     .shipOrder(manufacturing.id, {
  //       id: orderId,
  //       lineItems,
  //     })
  //     .then((response) => {
  //       const { lineItems, statusHistory } = response.data;
  //       // setHeadquarters(headquarters);
  //       // setManufacturing(manufacturing);
  //       // setWarehouse(warehouse);
  //       setLineItems(lineItems);
  //       // lineItems.map((item) => ({
  //       //   ...item,
  //       //   actualQuantity: fulfilledProductItems.length,
  //       // }))
  //       setStatus({
  //         status: statusHistory[statusHistory.length - 1].status,
  //         timeStamp: statusHistory[statusHistory.length - 1].timeStamp,
  //       });
  //     })
  //     .catch((error) =>
  //       console.error("Failed to ship procurement: ", error.message)
  //     );
  // };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  const openInvoice = () => setOpen(true);
  const closeInvoice = () => setOpen(false);

  const openConfirmModal = () => setOpenConfirm(true);
  const closeConfirmModal = () => setOpenConfirm(false);

  const tabs = [
    {
      name: "Details",
      href: `/${subsys}/orders/${orderId}`,
      current: true,
    },
    {
      name: "Pick / Pack",
      href: `/${subsys}/orders/${orderId}/pick-pack`,
      current: false,
    },
    { name: "Delivery", href: "#", current: false },
  ];

  return loading ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    Boolean(order) && (
      <>
        <div className="py-8 xl:py-10">
          <Header
            subsys={subsys}
            navigate={navigate}
            disableTabs={order.delivery === null}
            tabs={tabs}
            orderId={orderId}
            status={status}
            openModal={openModal}
            handlePrint={handlePrint}
            openInvoice={openInvoice}
            setAction={setAction}
            openConfirm={openConfirmModal}
          />
          <Outlet
            context={{
              subsys,
              orderId,
              order,
              status,
              setStatus,
              lineItems,
              setLineItems,
              statusHistory,
              setStatusHistory,
              currSiteId,
            }}
          />
        </div>
        {
        /*
        <div className="hidden">
          <ProcurementInvoice
            ref={componentRef}
            orderId={orderId}
            orderStatus={status}
            company={headquarters.company}
            headquarters={headquarters}
            manufacturing={manufacturing}
            warehouse={warehouse}
            data={lineItems}
            qrValue={qrValue}
          />
        </div>
        <InvoiceModal
          open={open}
          closeModal={closeInvoice}
          orderId={orderId}
          orderStatus={status}
          company={headquarters.company}
          headquarters={headquarters}
          manufacturing={manufacturing}
          warehouse={warehouse}
          data={lineItems}
          qrValue={qrValue}
          handlePrint={handlePrint}
        />
        {Boolean(action) && (
          <Confirmation
            title={`${action.name} "Order #${orderId}"`}
            body={`Are you sure you want to ${action.name.toLowerCase()} "Order #${orderId}"? This action cannot be undone.`}
            open={openConfirm}
            closeModal={closeConfirmModal}
            onConfirm={action.action}
          />
        )} */}
      </>
    )
  );
};
