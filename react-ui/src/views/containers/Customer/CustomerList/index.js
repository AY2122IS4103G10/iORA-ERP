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
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Customer Name",
        accessor: (row) => `${row.firstName} ${row.lastName}`,
      },
      {
        Header: "Date of Birth",
        accessor: "dob",
        Cell: (e) => moment(e.value).format("DD/MM/YY"),
      },
      {
        Header: "Contact Number",
        accessor: "contactNumber",
        //Cell: (e) => moment(e.value).format("lll"),
      },
      {
        Header: "Membership Points",
        accessor: "membershipPoints",
      },
      {
        Header: "Membership Tier",
        accessor: (row) => row.membershipTier.name,
        Filter: SelectColumnFilter,
        filter: "includes",
      },
      {
        Header: "Status",
        accessor: "availStatus",
        Cell: (e) => (e.value ? "Available" : "Blocked"),
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
