import { Link } from "react-router-dom";
import { Header } from "../../Index/AdminIndex";
import { JobTitleList } from "../JobTitleList";
const AddJobTitleButton = () => {
  return <Link to="/ad/jobTitles/create">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
    >
      Add job title
    </button>
  </Link>
}

export const ManageJobTitle = () => {
  return (
    <>
      {<Header button={<AddJobTitleButton />} title="Job Titles" />}
      {<JobTitleList />}
    </>
  );
};