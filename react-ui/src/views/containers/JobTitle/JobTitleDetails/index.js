import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  PencilIcon,
} from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import {
  fetchJobTitles,
  deleteExistingJobTitle,
  selectJobTitleById,
} from "../../../../stores/slices/jobTitleSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";

const Header = ({ jobTitlesId, name, openModal }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <Link to={`/ad/jobTitles/edit/${jobTitlesId}`}>
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

const JobTitleDetailsBody = ({
  title,
  description,
  responsibility,
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* JobTitles Information*/}
      <section aria-labelledby="order-information-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Job Title Information
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Title</dt>
                <dd className="mt-1 text-sm text-gray-900">{title}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Description</dt>
                <dd className="mt-1 text-sm text-gray-900">{description}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Responsibilities</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  <ul className="divide-y divide-gray-200">
                    {responsibility.map((value) =>
                      <li key={value} className="py-4">
                        {value}
                      </li>)}
                  </ul>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export const JobTitleDetails = () => {
  const { jobTitleId } = useParams();
  const jobTitle = useSelector((state) => selectJobTitleById(state, parseInt(jobTitleId)));
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const memStatus = useSelector((state) => state.jobTitle.status);

  useEffect(() => {
    memStatus === "idle" && dispatch(fetchJobTitles());
  }, [memStatus, dispatch]);

  const onDeleteJobTitleClicked = () => {
    dispatch(deleteExistingJobTitle(jobTitleId)).then(() => {
      closeModal();
      navigate("/ad/jobTitles");
    })
  }

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  return (
    Boolean(jobTitle) && (
      <>
        <div className="py-8 xl:py-10">
          <NavigatePrev page="JobTitles" path={-1} />
          <Header
            jobTitlesId={jobTitle.id}
            openModal={openModal}
          />
          <JobTitleDetailsBody
            title={jobTitle.title}
            description={jobTitle.description}
            responsibility={jobTitle.responsibility}
          />
        </div>
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
