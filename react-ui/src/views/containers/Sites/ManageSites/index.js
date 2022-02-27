import { Link } from "react-router-dom";
import { Header } from "../../Index/AdminIndex";
import { SitesList } from "../SitesList";

const AddSiteButton = () => {
  return <Link to="/ad/sites/create">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
    >
      Add site
    </button>
  </Link>
}


export const ManageSites = () => {
  return (
    <>
      {<Header button={<AddSiteButton />} title="Sites" />}
      {<SitesList />}
    </>
  );
};
