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
import { selectAllCompanies } from "../../../../stores/slices/companySlice";

export const CompaniesTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "name",
      },
      {
        Header: "Register No.",
        accessor: "registerNumber",
      },
      {
        Header: "Phone",
        accessor: "phoneNumber",
      },
      {
        Header: "Address",
        accessor: (row) => `${row.address.road}, ${row.address.postalCode}`,
      },
      {
        Header: "Active",
        accessor: "active",
        Cell: (e) => (e.value ? "Yes" : "No"),
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
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const CompaniesList = () => {
  const dispatch = useDispatch();
  const data = useSelector(selectAllCompanies);
  // const siteStatus = useSelector((state) => state.company.status);
  // useEffect(() => {
  //   siteStatus === "idle" &&
  //     dispatch(
  //       fetchSites({
  //         storeTypes: ["Store", "Headquarters"],
  //         country: "Singapore",
  //         company: "iORA",
  //       })
  //     );
  // }, [siteStatus, dispatch]);
  return <CompaniesTable data={data} />;
};
