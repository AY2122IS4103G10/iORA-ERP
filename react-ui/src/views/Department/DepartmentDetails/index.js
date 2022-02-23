import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
    PencilIcon,
} from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import {
    fetchDepartments,
    deleteExistingDepartment,
    selectDepartmentById,
} from "../../../../stores/slices/departmentSlice";
import { useEffect, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete.js";

const DepartmentDetailsBody = ({
    name,
}) => (
    <div className="py-8 xl:py-10">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
            <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
                <div>
                    <div>
                        <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
                            <div>
                                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                                <p className="mt-2 text-sm text-gray-500">{name}</p>
                            </div>
                            <div className="mt-4 flex space-x-3 md:mt-0">
                                <Link to={`/ad/department/edit/${name}`}>
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
                    </div>
                </div>
            </div>
        </div>
    </div>
);

export const DepartmentDetails = () => {
    const { name } = useParams();
    const department = useSelector((state) => selectDepartmentById(state, name));
    const [openDelete, setOpenDelete] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const depStatus = useSelector((state) => state.department.status);

    useEffect(() => {
        depStatus === "idle" && dispatch(fetchDepartments());
      }, [depStatus, dispatch]);

    const onDeleteDepartmentClicked = () => {
        dispatch(deleteExistingDepartment(department.name));
        closeModal();
        navigate("/ad/department");
    };

    const openModal = () => setOpenDelete(true);
    const closeModal = () => setOpenDelete(false);

    return (
        Boolean(department) && (
            <>
              <DepartmentDetailsBody
                name={department.name}
                openModal={openModal}
              />
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