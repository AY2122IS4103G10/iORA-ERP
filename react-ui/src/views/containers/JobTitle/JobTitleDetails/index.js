import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import {
  fetchJobTitles,
  deleteExistingJobTitle,
  selectJobTitleById,
} from "../../../../stores/slices/jobTitleSlice";
import { useEffect, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";

const JobTitleDetailsBody = ({
  title,
  description,
  responsibility,
  openModal,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 xl:max-w-5xl xl:grid xl:grid-cols-3">
      <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
        <div>
          <div>
            <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                <p className="mt-2 text-sm text-gray-500">{title}</p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <Link to={`/ad/employee/edit/${title}`}>
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
              <h2 className="sr-only">Description</h2>
              <div className="prose max-w-none">
                <p>{description}</p>
              </div>
            </div>
            <div className="py-3 xl:pt-6 xl:pb-0">
              <h2 className="sr-only">Responsibility</h2>
              <div className="prose max-w-none">
                <p>{responsibility}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
);

export const JobTitleDetails = () => {
  const { title } = useParams();
  const jobTitle = useSelector((state) => selectJobTitleById(state, title));
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const jtitleStatus = useSelector((state) => state.jobTitle.status);

  useEffect(() => {
    jtitleStatus === "idle" && dispatch(fetchJobTitles());
  }, [jtitleStatus, dispatch]);

  const onDeleteJobTitleClicked = () => {
    dispatch(deleteExistingJobTitle(jobTitle.name));
    closeModal();
    navigate("/ad/jobTitle");
  };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  return (
    Boolean(jobTitle) && (
      <>
        <JobTitleDetailsBody
          title={jobTitle.title}
          description={jobTitle.description}
          responsibility={jobTitle.responsibility}
          openModal={openModal}
        />
        <ConfirmDelete
          item={jobTitle.title}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteJobTitleClicked}
        />
      </>
    )
  );
};
