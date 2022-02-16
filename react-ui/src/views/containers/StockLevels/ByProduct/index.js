import { useMemo } from "react";
import { SelectableTable } from "../../../components/Tables/SelectableTable";
import { SelectColumnFilter } from "../../../components/Tables/SelectableTable";


const getData = () => {
    const data = [
        {
            sku: "SKU1231",
            name: "Sky Blue V-neck Top",
        },
        {
            sku: "SKU4321",
            name: "Black Blue V-neck Top",
        }
    ];
    return data;
}

export const ProductTable = () => {
    const columns = useMemo(
        () => [
            {
                Header: "SKU Code", 
                accessor: "sku"
            }, 
            {
                Header: "Name", 
                accessor: "name"
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