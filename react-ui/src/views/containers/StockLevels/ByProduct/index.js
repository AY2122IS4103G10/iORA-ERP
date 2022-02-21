import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProducts, selectAllProducts } from "../../../../stores/slices/productSlice";
import { SelectableTable } from "../../../components/Tables/SelectableTable";

const columns = [
        {
            Header: "SKU Code", 
            accessor: "sku"
        }, 
        {
            Header: "Name", 
            accessor: "name"
        },
    ]


export const ProductTable = () => {
    const dispatch = useDispatch();
    const data = useSelector(selectAllProducts);
    const prodStatus = useSelector((state) => state.products.status);

    const products = data.flatMap((model) => 
      model.products.map((product) => ({
        ...product,
        name: model.name,
      })));

    useEffect(() => {
        prodStatus === "idle" && dispatch(fetchProducts());
      }, [prodStatus, dispatch]);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          <SelectableTable columns={columns} data={products} path="/sm/stocklevels/products" />
        </div>
      </div>
    );
}

export const ProductStocks = () => {
    return (
        <ProductTable />
    );
};