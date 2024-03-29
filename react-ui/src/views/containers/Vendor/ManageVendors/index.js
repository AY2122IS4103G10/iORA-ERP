import { Link } from "react-router-dom";
import { VendorList } from "../VendorList";
import { Header } from "../../Index/AdminIndex";

const AddVendorButton = () => {
  return <Link to="/ad/vendors/create">
    <button
      type="button"
      className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
    >
      Create New Vendor
    </button>
  </Link>
}

export const ManageVendors = () => {
  return (
    <>
      {<Header button={<AddVendorButton/>} title="Vendors" />}
      {<VendorList />}
    </>
  );
};