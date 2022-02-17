import { useMemo } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import moment from "moment";
import { CogIcon } from "@heroicons/react/outline";

import {
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { selectAllEmployee } from "../../../../stores/slices/employeeSlice";

export const EmployeeTable = () => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        // Cell: (e) => (
        //   <Link
        //     to={`/admin/employee/${e.value}`}
        //     className="hover:text-gray-700 hover:underline"
        //   >
        //     {e.value}
        //   </Link>
        // ),name, department, companyCode, status, email
      },
      {
        Header: "Employee Name",
        accessor: "name",
        
      },
      {
        Header: "Department",
        accessor: "department",
        //Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Company Code",
        accessor: "companyCode",
        //Cell: (e) => moment(e.value).format("lll"),
      },
      {
        Header: "Status",
        accessor: "status",
        //Cell: (e) => moment(e.value).format("lll"),
      },
      {
        Header: "Email",
        accessor: "email",
        // Cell: (e) => (e.value ? "Yes" : "No"),
        // Filter: SelectColumnFilter,
        // filter: "includes",
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/products",
      //       },
      //     ],
      //   }),
      // },
    ],
    []
  );
  const data = useSelector(selectAllEmployee);
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const EmployeeList = () => {
  return <EmployeeTable />;
};