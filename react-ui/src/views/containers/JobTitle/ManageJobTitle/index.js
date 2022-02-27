import { Link } from "react-router-dom";
import { JobTitleList } from "../JobTitleList";
import { Header } from "../../Index/AdminIndex";

const AddJobTitleButton = () => {
  return <Link to="/ad/jobTitle/create">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
    >
      Create New Job Title
    </button>
  </Link>
}


export const ManageJobTitle = () => {
  return (
    <>
      {<Header button={<AddJobTitleButton/>} title="Job Titles" />}
      {<JobTitleList />}
    </>
  );
};