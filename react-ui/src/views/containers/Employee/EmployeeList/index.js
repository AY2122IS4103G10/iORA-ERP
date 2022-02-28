import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import {
  fetchEmployees,
  selectAllEmployee,
} from "../../../../stores/slices/employeeSlice";

export const EmployeeTable = ({ data, handleOnClick }) => {
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
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Department",
        accessor: (row) => row.department.deptName,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Job Title",
        accessor: (row) => row.jobTitle.title,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Company",
        accessor: (row) => row.company.name,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Status",
        accessor: "availStatus",
        Cell: (e) =>
          e.value ? (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
              Active
            </span>
          ) : (
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
              Disabled
            </span>
          ),
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/employee",
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

export const EmployeeList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllEmployee);
  const employeeStatus = useSelector((state) => state.employee.status);
  useEffect(() => {
    employeeStatus === "idle" && dispatch(fetchEmployees());
  }, [employeeStatus, dispatch]);

  const handleOnClick = (row) => navigate(`/ad/employees/${row.original.id}`);

  return (
    Boolean(data.length) && (
      <EmployeeTable data={data} handleOnClick={handleOnClick} />
    )
  );
};
