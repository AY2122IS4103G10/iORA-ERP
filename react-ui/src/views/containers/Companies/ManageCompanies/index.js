import { Link } from "react-router-dom";
import { Header } from "../../Index/AdminIndex";
import { CompaniesList } from "../CompaniesList";

const AddCompanyButton = () => {
  return <Link to="/ad/companies/create">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
    >
      Add company
    </button>
  </Link>
}


export const ManageCompanies = () => {
  return (
    <>
      {<Header button={<AddCompanyButton/>} title="Companies" />}
      {<CompaniesList />}
    </>
  );
};
