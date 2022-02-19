import { useMem, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { selectAllProducts } from "../../../../stores/slices/productSlice";
import { fetchProducts } from "../../../../stores/slices/productSlice";
import { SelectableTable } from "../../../components/Tables/SelectableTable";
import { SelectColumnFilter } from "../../../components/Tables/SelectableTable";

const columns = [
        {
            Header: "Model Code", 
            accessor: "modelCode"
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
    useEffect(() => {
        prodStatus === "idle" && dispatch(fetchProducts());
      }, [prodStatus, dispatch]);


    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          <SelectableTable columns={columns} data={data} path="/sm/stocklevels/products" />
        </div>
      </div>
    );
}

export const ProductStocks = () => {
    return (
        <ProductTable />
    );
};