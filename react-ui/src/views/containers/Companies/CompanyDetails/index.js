import { PencilIcon, TrashIcon } from "@heroicons/react/outline";
import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import {
  deleteExistingCompany,
  fetchCompanies,
  selectCompanyById,
} from "../../../../stores/slices/companySlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import ConfirmDelete from "../../../components/Modals/ConfirmDelete";
import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";

const Header = ({ company, openModal, available }) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev page="Companies" path="/ad/companies" />
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{company.name}</h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <Link to={`/ad/companies/edit/${company.id}`}>
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
        {available && (
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
        )}
      </div>
    </div>
  );
};

const DepartmentTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: "deptName",
      },
      {
        Header: "Job Titles",
        accessor: (row) => row.jobTitles.map((title) => title.title).join(", "),
      },
    ],
    []
  );

  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Departments
        </h3>
      </div>

      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

const VendorTable = ({ data }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
        Cell: (e) => (
          <Link
            to={`/ad/vendors/${e.value}`}
            className="hover:text-gray-700 hover:underline"
          >
            {e.value}
          </Link>
        ),
      },
      {
        Header: "Company Name",
        accessor: "companyName",
      },
      {
        Header: "Email",
        accessor: "email",
      },
      {
        Header: "Telephone",
        accessor: "telephone",
      },
      {
        Header: "Country",
        accessor: (row) => row.address[0].country,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
    ],
    []
  );

  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">Vendors</h3>
      </div>
      <div className="mt-4">
        <SimpleTable columns={columns} data={data} />
      </div>
    </div>
  );
};

export const CompanyDetails = () => {
  const { addToast } = useToasts();
  const { companyId } = useParams();
  const company = useSelector((state) =>
    selectCompanyById(state, parseInt(companyId))
  );
  const [openDelete, setOpenDelete] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sitesStatus = useSelector((state) => state.companies.status);

  useEffect(() => {
    sitesStatus === "idle" && dispatch(fetchCompanies());
  }, [sitesStatus, dispatch]);

  const onDeleteCompanyClicked = () => {
    dispatch(deleteExistingCompany(companyId))
      .then(() => {
        addToast("Successfully deleted company", {
          appearance: "success",
          autoDismiss: true,
        });
        closeModal();
        navigate("/ad/companies");
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
    Boolean(company) && (
      <>
        <div className="py-8 xl:py-10">
          <Header
            company={company}
            openModal={openModal}
            available={company.active}
          />
          <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
            <div className="space-y-6 lg:col-start-1 lg:col-span-2">
              {/* Site Information list*/}
              <section aria-labelledby="applicant-information-title">
                <div className="bg-white shadow sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h2
                      id="company-information-title"
                      className="text-lg leading-6 font-medium text-gray-900"
                    >
                      Company Information
                    </h2>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
                    <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Register No.
                        </dt>

                        <dd className="mt-1 text-sm text-gray-900">
                          {company.registerNumber}
                        </dd>
                      </div>

                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Address
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {company.address && (
                            <address className="not-italic">
                              <span className="block">
                                {company.address.road}
                              </span>
                              <span className="block">
                                {company.address.city}{" "}
                                {company.address.postalCode}
                              </span>
                              <span className="block">
                                {company.address.state},{" "}
                                {company.address.country}
                              </span>
                            </address>
                          )}
                        </dd>
                      </div>
                      <div className="sm:col-span-1">
                        <dt className="text-sm font-medium text-gray-500">
                          Telephone
                        </dt>
                        <dd className="mt-1 text-sm text-gray-900">
                          {company.telephone}
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              </section>
              {Boolean(company.departments.length) && (
                <section aria-labelledby="departments">
                  <DepartmentTable data={company.departments} />
                </section>
              )}
              {Boolean(company.vendors.length) && (
                <section aria-labelledby="vendors">
                  <VendorTable data={company.vendors} />
                </section>
              )}
            </div>
          </div>
        </div>
        <ConfirmDelete
          item={company.name}
          open={openDelete}
          closeModal={closeModal}
          onConfirm={onDeleteCompanyClicked}
        />
      </>
    )
  );
};
