import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { PencilIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import {
  fetchDepartments,
  deleteExistingDepartment,
  selectDepartmentById,
} from "../../../../stores/slices/departmentSlice";
import { useEffect, useMemo, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { SimpleTable } from "../../../components/Tables/SimpleTable";

const Header = ({ departmentId, name, openModal }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <Link to={`/ad/departments/edit/${departmentId}`}>
          <button
            type="button"
            className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
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
          className="inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-red-500"
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
  );
};

const DepartmentDetailsBody = ({ jobTitles }) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Departments Information*/}
      {Boolean(jobTitles.length) && (
        <section aria-labelledby="vendors">
          <div className="px-4 py-5 sm:px-6">
            <JobTitleTable data={jobTitles} />
          </div>
        </section>
      )}
    </div>
  </div>
);

const JobTitleTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Title",
        accessor: "title",
      },
      {
        Header: "Description",
        accessor: "description",
      },
    ],
    []
  );

  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Job Titles
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const DepartmentDetails = () => {
  const { addToast } = useToasts();
  const { departmentId } = useParams();
  const department = useSelector((state) =>
    selectDepartmentById(state, parseInt(departmentId))
  );
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const depStatus = useSelector((state) => state.department.status);

  useEffect(() => {
    depStatus === "idle" && dispatch(fetchDepartments());
  }, [depStatus, dispatch]);

  const onDeleteDepartmentClicked = () => {
    dispatch(deleteExistingDepartment(departmentId))
      .unwrap()
      .then(() => {
        addToast("Successfully deleted company", {
          appearance: "success",
          autoDismiss: true,
        });
        closeModal();
        navigate("/ad/departments");
      })
      .catch((err) => {
        addToast(`Error: ${err.message}`, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  return (
    Boolean(department) && (
      <>
        <div className="py-8 xl:py-10">
          <NavigatePrev page="Departments" path="/ad/departments" />
          <Header
            departmentId={department.id}
            name={department.deptName}
            openModal={openModal}
          />
          <DepartmentDetailsBody jobTitles={department.jobTitles} />
        </div>
        <ConfirmDelete
          item={department.name}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteDepartmentClicked}
        />
      </>
    )
  );
};
