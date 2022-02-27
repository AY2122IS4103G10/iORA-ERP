import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import { SelectColumnFilter, SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchEmployees,
  selectAllEmployee,
} from "../../../../stores/slices/employeeSlice";

export const EmployeeTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Employee Name",
        accessor: "name",
      },
      {
        Header: "Department",
        accessor: (row) => row.department.deptName,
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Job Title",
        accessor: (row) => row.jobTitle.title,
        Filter: SelectColumnFilter,
        filter: 'includes',
      },
      {
        Header: "Status",
        accessor: "availStatus",
        Cell: (e) => (e.value ? "Available" : "Not available"),
      },
      {
        Header: "Email",
        accessor: "email",
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

  return <EmployeeTable data={data} handleOnClick={handleOnClick} />;
};
