import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { PencilIcon } from "@heroicons/react/solid";
import {
  fetchCustomers,
  blockExistingCustomer,
  selectCustomerById,
  unblockExistingCustomer,
} from "../../../../stores/slices/customerSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";
import { useEffect } from "react";
import moment from "moment";
import {
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import { useMemo } from "react";

const Header = ({
  customerId,
  firstName,
  lastName,
  availStatus,
  toggleBlock,
}) => {
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <NavigatePrev page="Customers" path={"/sm/customers"} />
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            {firstName} {lastName} {availStatus}
          </h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <Link to={`/sm/customers/edit/${customerId}`}>
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
          className={`inline-flex items-center justify-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-${
            availStatus ? "red" : "cyan"
          }-600 hover:bg-${
            availStatus ? "red" : "cyan"
          }-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-${
            availStatus ? "red" : "cyan"
          }-500`}
          onClick={toggleBlock}
        >
          <span>{availStatus ? "Block" : "Unblock"}</span>
        </button>
      </div>
    </div>
  );
};

const CustomerDetailsBody = ({
  firstName,
  lastName,
  email,
  dob,
  contactNumber,
  membershipPoints,
  membershipTier,
  availStatus,
  address,
  orders,
}) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Customer Information*/}
      <section aria-labelledby="order-information-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Customer Information
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  First Name
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{firstName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Last Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{lastName}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Email</dt>
                <dd className="mt-1 text-sm text-gray-900">{email}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Date of Birth
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {moment(dob).format("DD/MM/YYYY")}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Status</dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {availStatus ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Blocked
                    </span>
                  )}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Contact Number
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{contactNumber}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Membership Tier
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {membershipTier ? membershipTier.name : "N/A"}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Membership Points
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {membershipPoints ? membershipPoints : "-"}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>

      {address && (
        <AddressDetails
          mainName={address.name}
          street1={address.street1}
          street2={address.street2}
          zip={address.zip}
          city={address.city}
          state={address.state}
          deliveryContact={address.phone}
          country={address.country}
        />
      )}
      <section aria-labelledby="order-history">
        <OrderHistory data={orders} />
      </section>
    </div>
  </div>
);

const AddressDetails = ({
  mainName,
  street1,
  street2,
  zip,
  city,
  state,
  deliveryContact,
  country,
}) => {
  return (
    <section className="bg-white shadow sm:rounded-lg mt-6">
      <div className="px-4 py-5 sm:px-6">
        <h2
          id="customer delivery-information-title"
          className="text-lg leading-6 font-medium text-gray-900"
        >
          Main Delivery Address
        </h2>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Person</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {mainName ? mainName : "-"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Contact Number
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {deliveryContact ? deliveryContact : "-"}
            </dd>
          </div>
        </dl>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
        <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-3">
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">
              Street/ Road/ Building
            </dt>
            <dd className="mt-1 text-sm text-gray-900">
              {street1 ? street1 : "-"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Unit Number</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {street2 ? street2 : "-"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Zip</dt>
            <dd className="mt-1 text-sm text-gray-900">{zip ? zip : "-"}</dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">Country</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {country ? country : "-"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">State</dt>
            <dd className="mt-1 text-sm text-gray-900">
              {state ? state : "-"}
            </dd>
          </div>
          <div className="sm:col-span-1">
            <dt className="text-sm font-medium text-gray-500">City</dt>
            <dd className="mt-1 text-sm text-gray-900">{city ? city : "-"}</dd>
          </div>
        </dl>
      </div>
    </section>
  );
};

const OrderHistory = ({ data }) => {
  const navigate = useNavigate();
  const columns = useMemo(() => {
    return [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Date of Purchase",
        accessor: "dateTime",
        Cell: (e) => moment(e.value).format("DD/MM/YY, HH:mm:ss"),
      },
      {
        Header: "Items",
        accessor: (row) => row.lineItems.length,
      },
      {
        Header: "Purchase Amount",
        accessor: "totalAmount",
        Cell: (e) => `$${e.value.toFixed(2)}`,
      },
    ];
  }, []);
  return (
    <div className="pt-8">
      <div className="md:flex md:items-center md:justify-between">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Order History
        </h3>
      </div>
      {Boolean(data.length) ? (
        <div className="mt-4">
          <SimpleTable
            columns={columns}
            data={data}
            handleOnClick={(row) => navigate(`/sm/orders/${row.original.id}`)}
          />
        </div>
      ) : (
        <div className="relative block w-full rounded-lg p-12 text-center focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500">
          <span className="mt-2 block text-sm font-medium text-gray-900">
            No orders.
          </span>
        </div>
      )}
    </div>
  );
};

export const CustomerDetails = () => {
  const { addToast } = useToasts();
  const { customerId } = useParams();
  const customer = useSelector((state) =>
    selectCustomerById(state, parseInt(customerId))
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const cusStatus = useSelector((state) => state.customers.status);

  useEffect(() => {
    cusStatus === "idle" && dispatch(fetchCustomers());
  }, [cusStatus, dispatch]);

  const onBlockCustomerClicked = () => {
    if (customer.availStatus === true) {
      dispatch(blockExistingCustomer(customerId))
        .then(() => {
          addToast("Successfully blocked customer.", {
            appearance: "success",
            autoDismiss: true,
          });
          navigate(`/sm/customers/${customerId}`);
        })
        .catch((err) =>
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          })
        );
    } else {
      dispatch(unblockExistingCustomer(customerId))
        .then(() => {
          addToast("Successfully unblocked customer.", {
            appearance: "success",
            autoDismiss: true,
          });
          navigate(`/sm/customers/${customerId}`);
        })
        .catch((err) =>
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          })
        );
    }
  };

  return (
    Boolean(customer) && (
      <div className="py-8 xl:py-10">
        <Header
          customerId={customer.id}
          firstName={customer.firstName}
          lastName={customer.lastName}
          availStatus={customer.availStatus}
          toggleBlock={onBlockCustomerClicked}
        />
        <CustomerDetailsBody
          firstName={customer.firstName}
          lastName={customer.lastName}
          email={customer.email}
          dob={customer.dob}
          username={customer.username}
          availStatus={customer.availStatus}
          contactNumber={customer.contactNumber}
          membershipPoints={customer.membershipPoints}
          membershipTier={customer.membershipTier}
          address={customer.address}
          orders={customer.orders}
        />
      </div>
    )
  );
};
