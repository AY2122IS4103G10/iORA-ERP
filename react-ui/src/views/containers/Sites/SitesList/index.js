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
  fetchProducts,
  selectAllProducts,
} from "../../../../stores/slices/productSlice";
import { fetchSites, selectAllSites } from "../../../../stores/slices/siteSlice";

export const SitesTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "siteId",
      },
      {
        Header: "Site Code",
        accessor: "siteCode",
        Cell: (e) => (
          <Link
            to={`/ad/sites/${e.value}`}
            className="hover:text-gray-700 hover:underline"
          >
            {e.value}
          </Link>
        ),
      },
      {
        Header: "Name",
        accessor: "name",
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
  // const dispatch = useDispatch();
  const data = useSelector(selectAllProducts);
  // const siteStatus = useSelector((state) => state.sites.status);
  // useEffect(() => {
  //   siteStatus === "idle" && dispatch(fetchSites());
  // }, [siteStatus, dispatch]);
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
