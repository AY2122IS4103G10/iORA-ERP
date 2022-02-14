import { useMemo } from "react";
import { SelectableTable } from "../../../components/Tables/SelectableTable";
import { SelectColumnFilter } from "../../../components/Tables/SelectableTable";


const getData = () => {
    const data = [
        {
            id: 1,
            productCode: "SKU1231",
            name: "Sky Blue V-neck Top",
            qty: 100,
        },
        {
            id: 0, 
            productCode: "SKU4321",
            name: "Black Blue V-neck Top",
            qty: 100,
        }
    ];
    return data;
}

export const ProductTable = () => {
    const columns = useMemo(
        () => [
            {
                Header: "Product Code", 
                accessor: "productCode"
            }, 
            {
                Header: "Name", 
                accessor: "name"
            },
            {
                Header: "Quantity", 
                accessor: "qty",
            },
        ],
        []
    );
    const data = useMemo(() => getData(), []);

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