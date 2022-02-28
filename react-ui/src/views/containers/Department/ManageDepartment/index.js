import { Link } from "react-router-dom";
import { Header } from "../../Index/AdminIndex";
import { DepartmentList } from "../DepartmentList";

const AddDepartmentButton = () => {
  return <Link to="/ad/departments/create">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
    >
      Create New Department
    </button>
  </Link>
}

export const ManageDepartment = () => {
  return (
    <>
      {<Header button={<AddDepartmentButton />} title="Departments" />}
      {<DepartmentList />}
    </>
  );
};