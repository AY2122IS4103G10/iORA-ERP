import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { CogIcon } from "@heroicons/react/outline";

import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchCompanies,
  selectAllCompanies,
} from "../../../../stores/slices/companySlice";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";

export const CompaniesTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
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
        <SimpleTable columns={columns} data={data} handleOnClick={handleOnClick}/>
      </div>
    </div>
  );
};

export const CompaniesList = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllCompanies);
  const companyStatus = useSelector((state) => state.companies.status);

  const handleOnClick = (row) => navigate(`${pathname}/${row.original.id}`);

  useEffect(() => {
    companyStatus === "idle" && dispatch(fetchCompanies());
  }, [companyStatus, dispatch]);
  return <CompaniesTable data={data} handleOnClick={handleOnClick}/>;
};
