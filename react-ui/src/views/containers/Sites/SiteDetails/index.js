import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { PencilIcon } from "@heroicons/react/solid";
import { TrashIcon } from "@heroicons/react/outline";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect, useState } from "react";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete/index.js";
import {
  deleteExistingSite,
  fetchSites,
  selectSiteById,
} from "../../../../stores/slices/siteSlice";

const SiteDetailsBody = ({
  siteId,
  name,
  address,
  siteCode,
  phone,
  company,
  openModal,
}) => (
  <div className="py-8 xl:py-10">
    <div className="max-w-3xl mx-auto xl:max-w-5xl">
      <NavigatePrev page="Sites" path="/ad/sites" />
      <div className="px-4 sm:px-6 lg:px-8 xl:grid xl:grid-cols-3">
        <div className="xl:col-span-2 xl:pr-8 xl:border-r xl:border-gray-200">
          <div>
            <div className="md:flex md:items-center md:justify-between md:space-x-4 xl:border-b xl:pb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                <p className="mt-2 text-sm text-gray-500">{siteCode}</p>
              </div>
              <div className="mt-4 flex space-x-3 md:mt-0">
                <Link to={`/ad/sites/edit/${siteId}`}>
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
            <aside className="mt-8 xl:hidden">
              <h2 className="sr-only">Details</h2>
              <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Address</h2>
                  <div className="mt-2 leading-8">
                    <span className="text-gray-900 text-sm font-medium">
                      {`${address.road}, ${address.postalCode}`}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Phone</h2>
                  <div className="mt-2 leading-8">
                    <span className="text-gray-900 text-sm font-medium">
                      {phone}
                    </span>
                  </div>
                </div>
              </div>
              <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-8">
                <div>
                  <h2 className="text-sm font-medium text-gray-500">Company</h2>
                  <div className="mt-2 leading-8">
                    <span className="text-gray-900 text-sm font-medium">
                      {company.name}
                    </span>
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </div>
        <aside className="hidden xl:block xl:pl-8">
          <h2 className="sr-only">Details</h2>
          <div className="space-y-5">
            <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Address</h2>
                <div className="mt-2 leading-8">
                  <span className="text-gray-900 text-sm font-medium">
                    {`${address.road}, ${address.postalCode}`}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-gray-200 py-6 space-y-8">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Phone</h2>
                <div className="mt-2 leading-8">
                  <span className="text-gray-900 text-sm font-medium">
                    {phone}
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 border-t border-b border-gray-200 py-6 space-y-8">
              <div>
                <h2 className="text-sm font-medium text-gray-500">Company</h2>
                <div className="mt-2 leading-8">
                  <span className="text-gray-900 text-sm font-medium">
                    {company.name}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </aside>
      </div>
    </div>
  </div>
);

export const SiteDetails = () => {
  const { siteId } = useParams();
  const site = useSelector((state) => selectSiteById(state, parseInt(siteId)));
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sitesStatus = useSelector((state) => state.sites.status);
  useEffect(() => {
    sitesStatus === "idle" && dispatch(fetchSites());
  }, [sitesStatus, dispatch]);

  const onDeleteSiteClicked = () => {
    try {
      dispatch(deleteExistingSite(siteId));
      alert("Successfully deleted site");
      closeModal();
      navigate("/ad/sites");
    } catch (err) {
      console.error("Failed to add promo: ", err);
    }
  };

  const openModal = () => setOpenDelete(true);
  const closeModal = () => setOpenDelete(false);

  return (
    Boolean(site) && (
      <>
        <SiteDetailsBody
          siteId={siteId}
          name={site.name}
          address={site.address}
          siteCode={site.siteCode}
          phone={site.phoneNumber}
          company={site.company}
          openModal={openModal}
        />
        <ConfirmDelete
          item={site.name}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteSiteClicked}
        />
      </>
    )
  );
};
