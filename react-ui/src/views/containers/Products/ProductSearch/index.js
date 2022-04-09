import { PrinterIcon, XIcon } from "@heroicons/react/outline";
import { useRef } from "react";
import { useState } from "react";
import Barcode from "react-barcode";
import { TailSpin } from "react-loader-spinner";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { api } from "../../../../environments/Api";
import { SimpleModal } from "../../../components/Modals/SimpleModal";
import {
  fetchAllModelsBySkus,
  fetchModelBySku,
} from "../../StockTransfer/StockTransferForm";
import { ProductStickerPrint } from "../ProductRFID";

const ProductList = ({ products, openModal, onProductSelectedChanged }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {products.map((product, index) => {
          return (
            <li key={product.rfid}>
              <div className="px-4 py-4 flex items-center sm:px-6">
                <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                  <div className="truncate">
                    <p className="text-base font-medium text-cyan-600 truncate">
                      {product.rfid}
                    </p>
                    <div className="mt-2 flex">
                      <div className="flex items-center text-sm text-gray-500">
                        <p>{product.product.sku}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                    <div className="flex space-x-4">
                      <div className="sm:mt-0 sm:ml-5">
                        <button
                          type="button"
                          className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                          onClick={() => {
                            onProductSelectedChanged(product);
                            openModal();
                          }}
                        >
                          View
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

const RFIDModal = ({
  open,
  closeModal,
  product,
  printQty,
  onPrintQtyChanged,
  onProductSelectedChanged,
  handlePrint,
}) => {
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
            {product.rfid}
          </h3>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">SKU</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.product.sku}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Colour</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {
                  product.product.productFields.find(
                    (field) => field.fieldName === "COLOUR"
                  ).fieldValue
                }
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Size</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {
                  product.product.productFields.find(
                    (field) => field.fieldName === "SIZE"
                  ).fieldValue
                }
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Description</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {product.description}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
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
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500 ">
                Tag
                <div className="mt-2 flex rounded-md">
                  <div className="relative flex focus-within:z-10">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <span className="text-gray-500 sm:text-sm">Qty:</span>
                    </div>
                    <input
                      type="number"
                      name="qty"
                      id="qty"
                      min="1"
                      className="pl-12 focus:ring-cyan-500 focus:border-cyan-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                      value={printQty}
                      onChange={onPrintQtyChanged}
                    />
                  </div>
                  <button
                    type="button"
                    className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                    onClick={() =>
                      Promise.resolve(onProductSelectedChanged(product)).then(
                        () => handlePrint()
                      )
                    }
                  >
                    <PrinterIcon
                      className="h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Print</span>
                  </button>
                </div>
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                <div className="space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
                  <h1 className="tracking-tight text-base">
                    SKU: {product.product.sku}
                  </h1>
                </div>
                <Barcode
                  value={product.rfid}
                  width={1}
                  height={100}
                  margin={0}
                />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </SimpleModal>
  );
};

export const ProductSearch = () => {
  const { addToast } = useToasts();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [productSelected, setProductSelected] = useState(null);
  const [loading, setLoading] = useState(false);
  const [printQty, setPrintQty] = useState(1);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const canSearch = Boolean(search);
  const onSearchClicked = (evt) => {
    evt.preventDefault();
    const fetchProducts = async () => {
      setLoading(true);
      try {
        if (isNaN(parseInt(search.charAt(0)))) {
          const { data } = await api.get(
            "warehouse/productItems",
            search.trim()
          );
          fetchAllModelsBySkus(data).then((d) => {
            setProducts(
              data.map((item, index) => ({
                ...item,
                ...d[index],
              }))
            );
          });
          setProducts(data);
        } else {
          const { data } = await api.get("sam/productItem", search.trim());
          const model = await fetchModelBySku(data.product.sku);

          setProducts([{ ...data, ...model }]);
        }
      } catch (error) {
        addToast(`Error: ${error.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      } finally {
        setSearch("");
        setLoading(false);
      }
    };
    if (canSearch) fetchProducts();
  };
  const onProductSelectedChanged = (e) => setProductSelected(e);
  const onPrintQtyChanged = (e) => setPrintQty(e.target.value);
  const onSearchChanged = (e) => setSearch(e.target.value);
  const openModal = () => setOpen(true);
  const closeRFIDModal = () => setOpen(false);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Search Product
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Scan barcode or RFID tag.</p>
              </div>
              <form
                className="mt-5 sm:flex sm:items-center"
                onSubmit={onSearchClicked}
              >
                <div className="w-full sm:max-w-xs">
                  <label htmlFor="order-no" className="sr-only">
                    Search
                  </label>
                  <input
                    type="text"
                    name="order-no"
                    id="order-no"
                    className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    placeholder="Search products..."
                    value={search}
                    onChange={onSearchChanged}
                    autoFocus
                  />
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-4">
          {loading ? (
            <div className="flex mt-5 items-center justify-center">
              <TailSpin color="#00BCD4" height={20} width={20} />
            </div>
          ) : (
            <ProductList
              products={products}
              openModal={openModal}
              handlePrint={handlePrint}
              onProductSelectedChanged={onProductSelectedChanged}
              printQty={printQty}
              onPrintQtyChanged={onPrintQtyChanged}
            />
          )}
        </div>
      </div>
      {productSelected && (
        <>
          <RFIDModal
            open={open}
            closeModal={closeRFIDModal}
            product={productSelected}
            printQty={printQty}
            onPrintQtyChanged={onPrintQtyChanged}
            onProductSelectedChanged={onProductSelectedChanged}
            handlePrint={handlePrint}
          />
          <div className="hidden">
            <ProductStickerPrint
              ref={componentRef}
              printQty={printQty}
              product={productSelected}
            />
          </div>
        </>
      )}
    </>
  );
};
