import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";

import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchDepartments,
  selectAllDepartment,
} from "../../../../stores/slices/departmentSlice";

const DepartmentTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "deptName",
      },
      {
        Header: "Job Titles",
        accessor: (row) => row.jobTitles.map((title) => title.title).join(", "),
      },
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

export const DepartmentList = () => {
  const { pathname } = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllDepartment);
  const departmentStatus = useSelector((state) => state.department.status);

  const handleOnClick = (row) => navigate(`${pathname}/${row.original.id}`);

  useEffect(() => {
    departmentStatus === "idle" && dispatch(fetchDepartments());
  }, [departmentStatus, dispatch]);
  return <DepartmentTable data={data} handleOnClick={handleOnClick} />;
};
