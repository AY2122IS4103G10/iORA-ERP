import { useRef } from "react";
import { useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useToasts } from "react-toast-notifications";
import { api, productApi } from "../../../../environments/Api";
import { ProductList } from "../ProductRFID";

export const ProductSearch = () => {
  const { addToast } = useToasts();
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const [open, setOpen] = useState(false)
  const [productSelected, setProductSelected] = useState(null);
  const [printQty, setPrintQty] = useState(1);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  const canSearch = Boolean(search);

  const onSearchClicked = (evt) => {
    evt.preventDefault();
    const fetchOrder = async () => {
      try {
        if (isNaN(parseInt(search.charAt(0)))) {
          const { data } = await productApi.searchProductBySku(search.trim());
          console.log(data)
        } else {
          const { data } = await api.get("sam/productItem", search.trim());
          setProducts([data]);
        }
      } catch (error) {
        addToast(`Error: ${error.response.data}`, {
          appearance: "error",
          autoDismiss: true,
        });
        setSearch("");
      }
    };
    if (canSearch) fetchOrder();
  };
  
  const onProductSelectedChanged = (e) => setProductSelected(e);
  const onPrintQtyChanged = (e) => setPrintQty(e.target.value);
  const onSearchChanged = (e) => setSearch(e.target.value);
  const openStickerModal = () => setOpen(true);
  const closeStickerModal = () => setOpen(false);

  return (
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
                  Order No.
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
  );
};
