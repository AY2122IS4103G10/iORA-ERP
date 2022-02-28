import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchSites, getAllSites, selectAllSites } from "../../../../stores/slices/siteSlice";

import { SelectableTable } from "../../../components/Tables/SelectableTable";
import { SelectColumnFilter } from "../../../components/Tables/SelectableTable";

export const SiteTables = (subsys) => {
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
                Header: "Company", 
                accessor: "company.name",
                Filter: SelectColumnFilter, 
                filter: "includes"
            },
        ],
        []
    );
    const dispatch = useDispatch();
    const data = useSelector(selectAllSites);
    const siteStatus = useSelector((state) => state.sites.status);
    useEffect(() => {
        siteStatus === "idle" && dispatch(getAllSites());
    }, [siteStatus])
    // console.log(subsys);
    const path = "/" + subsys.subsys.subsys.subsys + "/stocklevels";
    return (
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
        <div className="mt-4">
          <SelectableTable columns={columns} data={data} path={path} />
        </div>
      </div>
    );
}

export const SiteStocks = (subsys) => {
    return (
        <SiteTables subsys={subsys} />
    );
};