import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  SelectColumnFilter,
  SimpleTable,
} from "../../../components/Tables/SimpleTable";
import {
  fetchCustomers,
  selectAllCustomers,
} from "../../../../stores/slices/customerSlice";
import { useNavigate } from "react-router-dom";
import moment from "moment";

export const CustomerTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "#",
        accessor: "id",
      },
      {
        Header: "Name",
        accessor: (row) => `${row.firstName} ${row.lastName}`,
      },
      {
        Header: "DOB",
        accessor: "dob",
        Cell: (e) => moment(e.value).format("DD/MM/YY"),
      },
      {
        Header: "Contact",
        accessor: "contactNumber",
      },
      {
        Header: "Member Points",
        accessor: "membershipPoints",
      },
      {
        Header: "Member Tier",
        accessor: "membershipTier.name",
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Status",
        accessor: "availStatus",
        Cell: (e) => (e.value ? (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Active
          </span>
        ) : (
          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Blocked
          </span>
        )),
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Email",
        accessor: "email",
      },
    ],
    []
  );

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <SimpleTable
          columns={columns}
          data={data}
          handleOnClick={handleOnClick}
        />
      </div>
    </div>
  );
};

export const CustomerList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllCustomers);
  const customerStatus = useSelector((state) => state.customers.status);
  useEffect(() => {
    customerStatus === "idle" && dispatch(fetchCustomers());
  }, [customerStatus, dispatch]);
  const handleOnClick = (row) => navigate(`/sm/customers/${row.original.id}`);

  return <CustomerTable data={data} handleOnClick={handleOnClick} />;
};
