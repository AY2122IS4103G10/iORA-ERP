import { PrinterIcon, XIcon } from "@heroicons/react/outline";
import { forwardRef } from "react";
import { useRef } from "react";
import { useState } from "react";
import Barcode from "react-barcode";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { productApi } from "../../../../environments/Api";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

const ProductList = ({
  products,
  handlePrint,
  openModal,
  onProductSelectedChanged,
  printQty,
  onPrintQtyChanged,
}) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.sku}>
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="truncate">
                  <button
                    className="flex text-sm hover:underline hover:text-cyan-600"
                    onClick={() => {
                      onProductSelectedChanged(product);
                      openModal();
                    }}
                  >
                    <p className="text-base font-medium text-cyan-600 truncate">
                      {product.sku}
                    </p>
                  </button>
                </div>

                <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
                  <div>
                    <div className="mt-1 flex rounded-md shadow-sm">
                      <div className="relative flex items-stretch flex-grow focus-within:z-10">
                        <input
                          type="number"
                          name="qty"
                          id="qty"
                          min="1"
                          className="focus:ring-cyan-500 focus:border-cyan-500 block w-full rounded-none rounded-l-md sm:text-sm border-gray-300"
                          placeholder="Quantity"
                          value={printQty}
                          onChange={onPrintQtyChanged}
                        />
                      </div>
                      <button
                        type="button"
                        className="-ml-px relative inline-flex items-center space-x-2 px-4 py-2 border border-gray-300 text-sm font-medium rounded-r-md text-gray-700 bg-gray-50 hover:bg-gray-100 focus:outline-none focus:ring-1 focus:ring-cyan-500 focus:border-cyan-500"
                        onClick={handlePrint}
                      >
                        <PrinterIcon
                          className="h-5 w-5 text-gray-400"
                          aria-hidden="true"
                        />
                        <span>Print</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

const ProductSticker = ({ product }) => {
  const { sku } = product;
  return (
    <div className="max-w-3xl mx-auto px-4 py-6 sm:px-6 sm:py-24 lg:px-8">
      <div className="space-y-2 sm:px-0 sm:flex sm:items-baseline sm:justify-between sm:space-y-0">
        <h1 className="tracking-tight text-base">{sku}</h1>
      </div>
      <Barcode value={sku} width={1} height={100} margin={0} />
    </div>
  );
};

const ProductStickerPrint = forwardRef(({ printQty, product }, ref) => {
  return (
    <div ref={ref} className="py-4 overflow-auto">
      <ul className="grid grid-cols-3 gap-6">
        {new Array(parseInt(printQty)).fill(product).map((product, index) => (
          <li key={index} className="ml-3 col-span-1">
            <ProductSticker product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
});

const StickerModal = ({ open, closeModal, product }) => {
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
        <ProductSticker product={product} />
      </div>
    </SimpleModal>
  );
};

export const ProductPrint = () => {
  const { addToast } = useToasts();
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    onBeforeGetContent: (product) => {
      onProductSelectedChanged(product);
      return Promise.resolve();
    },
  });
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false);
  const [productSelected, setProductSelected] = useState(null);
  const [printQty, setPrintQty] = useState(1);

  const canSearch = Boolean(search);
  const onSearchClicked = (evt) => {
    evt.preventDefault();
    if (canSearch) {
      const skus = search.split(",").map((sku) => sku.trim());
      productApi.searchProductsBySku(skus).then((response) => {
        const products = response.data;
        if (response.data !== "") {
          setProducts(products);
        } else
          addToast(`Error: Product(s) not found.`, {
            appearance: "error",
            autoDismiss: true,
          });
      });
    }
  };

  const onSearchChanged = (e) => setSearch(e.target.value);
  const onProductSelectedChanged = (e) => setProductSelected(e);
  const onPrintQtyChanged = (e) => setPrintQty(e.target.value);

  const openStickerModal = () => setOpen(true);
  const closeStickerModal = () => setOpen(false);

  return (
    <>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          <div className="bg-white shadow sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">
                Print Product Label(s)
              </h3>
              <div className="mt-2 max-w-xl text-sm text-gray-500">
                <p>Scan barcodes or enter product SKUs separated by a comma ",".</p>
              </div>
              <form onSubmit={onSearchClicked}>
                <div className="mt-5 sm:flex sm:items-center">
                  <div className="w-full sm:max-w-md">
                    <label htmlFor="sku" className="sr-only">
                      Product SKU
                    </label>
                    <textarea
                      rows={4}
                      name="skus"
                      id="skus"
                      className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      value={search}
                      onChange={onSearchChanged}
                    />
                    
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-3 w-full inline-flex items-center justify-center px-4 py-2 border border-transparent shadow-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 sm:mt-3 sm:w-auto sm:text-sm"
                >
                  Search
                </button>
              </form>
            </div>
          </div>
        </div>
        <div className="mt-4">
          <ProductList
            products={products}
            openModal={openStickerModal}
            handlePrint={handlePrint}
            onProductSelectedChanged={onProductSelectedChanged}
            printQty={printQty}
            onPrintQtyChanged={onPrintQtyChanged}
          />
        </div>
      </div>
      {Boolean(productSelected) && (
        <>
          <StickerModal
            open={open}
            product={productSelected}
            closeModal={closeStickerModal}
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
