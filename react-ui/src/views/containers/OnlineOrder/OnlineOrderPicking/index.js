import { Dialog } from "@headlessui/react";
import { CheckCircleIcon, CheckIcon } from "@heroicons/react/outline";
import { PrinterIcon, XIcon } from "@heroicons/react/solid";
import moment from "moment";
import { useRef } from "react";
import { useCallback } from "react";
import { forwardRef } from "react";
import { useEffect, useMemo, useState } from "react";
import { TailSpin } from "react-loader-spinner";
import { useSelector } from "react-redux";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { api } from "../../../../environments/Api";
import { selectUserSite } from "../../../../stores/slices/userSlice";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import { BasicTable } from "../../../components/Tables/BasicTable";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { fetchModelBySku } from "../../StockTransfer/StockTransferForm";

const ProductModal = ({ open, closeModal, product }) => {
  return (
    <SimpleModal open={open} closeModal={closeModal}>
      <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-sm sm:min-w-full sm:p-6 md:min-w-full lg:min-w-fit">
        <div className="sm:block absolute top-0 right-0 pt-4 pr-4">
          <button
            type="button"
            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
            onClick={closeModal}
          >
            <span className="sr-only">Close</span>
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            {product.name}
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Product Code
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.modelCode}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">SKU</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.sku}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Colour</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {
                  product.product.productFields.find(
                    (field) => field.fieldName === "COLOUR"
                  ).fieldValue
                }
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {
                  product.product.productFields.find(
                    (field) => field.fieldName === "SIZE"
                  ).fieldValue
                }
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.description}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Images</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <ul className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 md:grid-cols-4 lg:grid-cols-3 xl:grid-cols-4 xl:gap-x-8">
                  {Boolean(product.imageLinks.length)
                    ? product.imageLinks.map((file, index) => (
                        <li key={index} className="relative">
                          <div className="group block w-full rounded-lg bg-gray-100 overflow-hidden">
                            <img
                              src={file}
                              alt=""
                              className="object-cover pointer-events-none"
                            />
                          </div>
                        </li>
                      ))
                    : "No images"}
                </ul>
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SimpleModal>
  );
};

const OnlineOrderTable = ({ data, handleOnClick, handlePrint }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Sku",
        accessor: "sku",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Color",
        accessor: (row) =>
          row.product.productFields.find(
            (field) => field.fieldName === "COLOUR"
          ).fieldValue,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Size",
        accessor: (row) =>
          row.product.productFields.find((field) => field.fieldName === "SIZE")
            .fieldValue,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Qty",
        accessor: "qty",
      },
    ],
    []
  );
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Picking List
        </h3>
        {handlePrint && (
          <div className="mt-6 flex space-x-3 md:mt-0 md:ml-4">
            <button
              type="button"
              className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
              onClick={handlePrint}
            >
              <PrinterIcon
                className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                aria-hidden="true"
              />
              <span>Print</span>
            </button>
          </div>
        )}
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <SimpleTable
            columns={columns}
            data={data}
            handleOnClick={handleOnClick}
          />
        </div>
      )}
    </div>
  );
};
const PickingListTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Sku",
        accessor: "sku",
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
        Header: "Qty",
        accessor: "qty",
      },
    ],
    []
  );
  return (
    <div>
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Picking List
        </h3>
      </div>
      {Boolean(data.length) && (
        <div className="mt-4">
          <BasicTable columns={columns} data={data} />
        </div>
      )}
    </div>
  );
};
const PickingInvoice = forwardRef(({ data, orders }, ref) => {
  return (
    <div ref={ref}>
      <div className="max-w-3xl mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div>
          <div className="space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
            <h1 className="font-extrabold tracking-tight text-5xl">Invoice</h1>
          </div>

          <h4 className="sr-only">Order Information</h4>
          <dl className="grid grid-cols-2 gap-x-6 text-sm py-10">
            <div>
              <dt className="font-medium text-gray-900">Orders</dt>
              <dd className="mt-2 text-gray-700">{orders?.join(", ")}</dd>
            </div>
            <div>
              <dt className="font-medium text-gray-900">Date</dt>
              <dd className="text-cyan-600 mt-2">
                {moment().format("MMMM Do YYYY, h:mm:ss a")}
              </dd>
            </div>
          </dl>
        </div>

        <div className="border-t border-gray-200">
          <h3 className="sr-only">Items</h3>
          <div className="mt-8">
            <PickingListTable data={data} />
          </div>
        </div>
      </div>
    </div>
  );
});

export const OnlineOrderPicking = ({ subsys }) => {
  const { addToast } = useToasts();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [openInfo, setOpenInfo] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orders, setOrders] = useState(null);
  const [openConfirm, setOpenConfirm] = useState(false);
  const currSiteId = parseInt(useSelector(selectUserSite));
  const componentRef = useRef();

  const fetchOnlineOrdersOfSite = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await api.getAll(`online/pickingList/${currSiteId}`);
      const { data: orders } = await api.getAll(
        `online/order/${currSiteId}/PENDING`
      );
      const lineItems = Object.keys(data).map((key, index) => ({
        id: index + 1,
        sku: key,
        qty: Object.values(data)[index],
      }));
      fetchAllModelsBySkus(lineItems).then((data) =>
        setData(
          lineItems
            .map((item, index) => {
              return {
                ...item,
                modelCode: data[index].modelCode,
                name: data[index].name,
                description: data[index].description,
                imageLinks: data[index].imageLinks,
                product: data[index].products.find(
                  (product) => product.sku === item.sku
                ),
              };
            })
            .sort((item) => item.name)
        )
      );
      setOrders(orders.map((order) => order.id));
      setLoading(false);
    } catch (error) {
      addToast(`Error: ${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  }, [addToast, currSiteId]);

  const fetchAllModelsBySkus = async (items) => {
    return Promise.all(items.map((item) => fetchModelBySku(item.sku)));
  };
  useEffect(() => {
    fetchOnlineOrdersOfSite();
  }, [currSiteId, addToast, subsys, fetchOnlineOrdersOfSite]);

  const handleOnClick = (row) => {
    setSelectedProduct(row.original);
    openInfoModal();
  };

  const onStartPickedClicked = async () => {
    try {
      await api.update("online/startPick", orders);
      addToast(`Orders ${orders.join(", ")} have started picking.`, {
        appearance: "success",
        autoDismiss: true,
      });
      closeConfirmModal();
      fetchOnlineOrdersOfSite();
    } catch (error) {
      addToast(`Error: ${error.message}`, {
        appearance: "error",
        autoDismiss: true,
      });
    }
  };
  const openInfoModal = () => setOpenInfo(true);
  const closeInfoModal = () => setOpenInfo(false);

  const openConfirmModal = () => setOpenConfirm(true);
  const closeConfirmModal = () => setOpenConfirm(false);

  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onAfterPrint: openConfirmModal,
  });

  return loading ? (
    <div className="flex mt-5 items-center justify-center">
      <TailSpin color="#00BFFF" height={20} width={20} />
    </div>
  ) : (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          {Boolean(data.length) ? (
            <OnlineOrderTable
              data={data}
              handleOnClick={handleOnClick}
              handlePrint={handlePrint}
            />
          ) : (
            <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
              <CheckCircleIcon className="mx-auto h-12 w-12 text-gray-400" />
              <span className="mt-2 block text-sm font-medium text-gray-900">
                No orders requiring attention.
              </span>
            </div>
          )}
        </div>
      </div>
      {selectedProduct && (
        <ProductModal
          open={openInfo}
          closeModal={closeInfoModal}
          product={selectedProduct}
        />
      )}
      <div className="hidden">
        <PickingInvoice ref={componentRef} data={data} orders={orders} />
      </div>
      <SimpleModal open={openConfirm} closeModal={closeConfirmModal}>
        <div className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full sm:p-6">
          <div className="hidden sm:block absolute top-0 right-0 pt-4 pr-4">
            <button
              type="button"
              className="bg-white rounded-md text-gray-400 hover:text-gray-500"
              onClick={closeConfirmModal}
            >
              <span className="sr-only">Close</span>
              <XIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="sm:flex sm:items-start">
            <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
              <CheckIcon
                className="h-6 w-6 text-green-600"
                aria-hidden="true"
              />
            </div>
            <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
              <Dialog.Title
                as="h3"
                className="text-lg leading-6 font-medium text-gray-900"
              >
                Start picking for orders
              </Dialog.Title>
              <div className="mt-2">
                <p className="text-sm text-gray-500">
                  Start picking for PENDING orders? A picking list for these
                  orders will be generated, and they're statuses will be updated
                  to PICKING.
                  <span className="mt-2 block text-sm font-medium text-gray-900">
                    Please ensure the picking list has been printed before clicking "Confirm".
                  </span>
                </p>
              </div>
            </div>
          </div>
          <div className="mt-5 sm:mt-4 sm:flex sm:flex-row-reverse">
            <button
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-cyan-600 text-base font-medium text-white hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:ml-3 sm:w-auto sm:text-sm"
              onClick={onStartPickedClicked}
            >
              Confirm
            </button>
            <button
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:w-auto sm:text-sm"
              onClick={closeConfirmModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </SimpleModal>
    </>
  );
};
