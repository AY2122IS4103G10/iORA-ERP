import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
  SelectColumnFilter,
  OptionsCell,
} from "../../../components/Tables/SimpleTable";

import {
  fetchSites,
  selectAllSites,
} from "../../../../stores/slices/siteSlice";

export const SitesTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Code",
        accessor: "siteCode",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Company",
        accessor: (row) => row.company.name,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Country",
        accessor: (row) => row.address.country,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/sites",
      //       },
      //     ],
      //   }),
      // },
    ],
    []
  );
  const dispatch = useDispatch();
  const data = useSelector(selectAllSites);
  const siteStatus = useSelector((state) => state.sites.status);
  useEffect(() => {
    siteStatus === "idle" &&
      dispatch(
        fetchSites({
          storeTypes: ["Store", "Headquarters"],
          country: "Singapore",
          company: "iORA",
        })
      );
  }, [siteStatus, dispatch]);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const SitesList = () => {
  return <SitesTable />;
};
