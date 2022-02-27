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
import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export const SitesTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
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

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable
          columns={columns}
          data={data}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export const SitesList = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllSites);
  const siteStatus = useSelector((state) => state.sites.status);

  const handleOnClick = (row) => navigate(`${pathname}/${row.original.id}`);

  useEffect(() => {
    siteStatus === "idle" && dispatch(fetchSites());
  }, [siteStatus, dispatch]);
  return <SitesTable data={data} handleOnClick={handleOnClick} />;
};
