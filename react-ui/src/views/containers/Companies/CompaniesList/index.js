import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CogIcon } from "@heroicons/react/outline";

import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchCompanies,
  selectAllCompanies,
} from "../../../../stores/slices/companySlice";
import { Link } from "react-router-dom";

export const CompaniesTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        Cell: (e) => (
          <Link
            to={`/ad/companies/${e.value}`}
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
      {
        Header: "Register No.",
        accessor: "registerNumber",
      },
      {
        Header: "Phone",
        accessor: "telephone",
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
  const companyStatus = useSelector((state) => state.companies.status);
  useEffect(() => {
    companyStatus === "idle" && dispatch(fetchCompanies());
  }, [companyStatus, dispatch]);
  return <CompaniesTable data={data} />;
};
