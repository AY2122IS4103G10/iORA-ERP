import { PrinterIcon } from "@heroicons/react/outline";
import { useState } from "react";
import { useToasts } from "react-toast-notifications";
import { productApi } from "../../../../environments/Api";

const ProductList = ({ products, handlePrint }) => {
  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-md">
      <ul className="divide-y divide-gray-200">
        {products.map((product) => (
          <li key={product.sku}>
            <div className="px-4 py-4 flex items-center sm:px-6">
              <div className="min-w-0 flex-1 sm:flex sm:items-center sm:justify-between">
                <div className="truncate">
                  <div className="flex text-sm">
                    <p className="text-base font-medium text-cyan-600 truncate">
                      {product.sku}
                    </p>
                  </div>
                </div>
                <div className="mt-4 flex-shrink-0 sm:mt-0 sm:ml-5">
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
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const ProductPrint = () => {
  const [search, setSearch] = useState("");
  const [products, setProducts] = useState([]);
  const { addToast } = useToasts();

  const canSearch = Boolean(search);
  const onSearchClicked = (evt) => {
    evt.preventDefault();
    if (canSearch)
      productApi.searchProductsBySku(search).then((response) => {
        if (response.data !== "") {
          setProducts(response.data);
        } else
          addToast(`Error: Product not found.`, {
            appearance: "error",
            autoDismiss: true,
          });
      });
  };

  const onSearchChanged = (e) => setSearch(e.target.value);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Print Product Sticker
            </h3>
            <div className="mt-2 max-w-xl text-sm text-gray-500">
              <p>Scan barcode or enter product SKU.</p>
            </div>
            <form
              className="mt-5 sm:flex sm:items-center"
              onSubmit={onSearchClicked}
            >
              <div className="w-full sm:max-w-xs">
                <label htmlFor="sku" className="sr-only">
                  Product SKU
                </label>
                <input
                  type="text"
                  name="sku"
                  id="sku"
                  className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                  placeholder="Search products..."
                  value={search}
                  onChange={onSearchChanged}
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
        <ProductList products={products} />
      </div>
    </div>
  );
};
