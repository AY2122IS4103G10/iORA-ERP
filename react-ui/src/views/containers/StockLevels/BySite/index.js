import { useMemo } from "react";

import { SelectableTable } from "../../../components/Tables/SelectableTable";
import { SelectColumnFilter } from "../../../components/Tables/SelectableTable";




const getData = () => {
    const data = [
        {
            id: 1,
            siteCode: "ICO",
            name: "iORA Compass One",
            country: "SG",
        },
        {
            id: 2,
            siteCode: "IOI",
            name: "iORA IOI Mall",
            country: "MY",
        }
    ];
    return data;
}

export const SiteTables = () => {
    const columns = useMemo(
        () => [
            {
                Header: "Site Code", 
                accessor: "siteCode"
            }, 
            {
                Header: "Name", 
                accessor: "name"
            },
            {
                Header: "Country", 
                accessor: "country",
                Filter: SelectColumnFilter, 
                filter: "includes"
            },
        ],
        []
    );
    const data = useMemo(() => getData(), []);

    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          <SelectableTable columns={columns} data={data} path="/sm/stocklevels" />
        </div>
      </div>
    );
}

export const SiteStocks = () => {
    return (
        <SiteTables />
    );
};