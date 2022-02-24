import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  CurrencyDollarIcon as CurrencyDollarIconSolid,
  PencilIcon,
} from "@heroicons/react/solid";
import { CurrencyDollarIcon, TrashIcon } from "@heroicons/react/outline";
import {
  fetchEmployees,
  deleteExistingEmployee,
  selectEmployeeById,
} from "../../../../stores/slices/employeeSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";

const EmployeeDetailsBody = ({
  name,
  email,
  salary,
  username,
  password,
  availStatus,
  payType,
  jobTitle,
  department,
  openModal,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
      <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
        <div>
          <div>
            <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="mt-2 text-sm text-gray-500">{username}</p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <Link to={`/ad/employee/edit/${username}`}>
                  <button
                    type="button"
                    className="inline-flex justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-700"
                  >
                    <PencilIcon
                      className="-ml-1 mr-2 h-5 w-5 text-gray-400"
                      aria-hidden="true"
                    />
                    <span>Edit</span>
                  </button>
                </Link>
                <button
                  type="button"
                  className="inline-flex justify-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                  onClick={openModal}
                >
                  <TrashIcon
                    className="-ml-1 mr-2 h-5 w-5 text-white"
                    aria-hidden="true"
                  />
                  <span>Delete</span>
                </button>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Department</h2>
              <div className="prose max-w-none">
                <p>{department}</p>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Job Title</h2>
              <div className="prose max-w-none">
                <p>{jobTitle}</p>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Avail Status</h2>
              <div className="prose max-w-none">
                <p>{availStatus}</p>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Email</h2>
              <div className="prose max-w-none">
                <p>{email}</p>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Password</h2>
              <div className="prose max-w-none">
                <p>{password}</p>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Salary</h2>
              <div className="prose max-w-none">
                <p>{salary}</p>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Pay Type</h2>
              <div className="prose max-w-none">
                <p>{payType}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const EmployeeDetails = () => {
  const { username } = useParams();
  const employee = useSelector((state) => selectEmployeeById(state, username));
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const empStatus = useSelector((state) => state.employee.status);

  useEffect(() => {
    empStatus === "idle" && dispatch(fetchEmployees());
  }, [empStatus, dispatch]);

  const onDeleteEmployeeClicked = () => {
    dispatch(deleteExistingEmployee(employee.name));
    closeModal();
    navigate("/ad/employee");
  };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  return (
    Boolean(employee) && (
      <>
        <EmployeeDetailsBody
          name={employee.name}
          email={employee.email}
          salary={employee.salary}
          username={employee.username}
          password={employee.password}
          availStatus={employee.availStatus}
          payType={employee.payType}
          jobTitle={employee.jobTitle}
          department={employee.department}
          openModal={openModal}
        />
        <ConfirmDelete
          item={employee.name}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteEmployeeClicked}
        />
      </>
    )
  );
};
