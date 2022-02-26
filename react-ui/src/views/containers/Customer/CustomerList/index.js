import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchCustomers,
  selectAllCustomer,
} from "../../../../stores/slices/customerSlice";

export const CustomerTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
      },
      {
        Header: "Customer Name",
        accessor: "lastName",
      },
      {
        Header: "Date of Birth",
        accessor: "dob",
        //Cell: (e) => `$${e.value}`,
      },
      {
        Header: "Contact Number",
        accessor: "contactNumber",
        //Cell: (e) => moment(e.value).format("lll"),
      },
      {
        Header: "Membership Points",
        accessor: "membershipPoints",
        //Cell: (e) => moment(e.value).format("lll"),
      },
    //   {
    //     Header: "Membership Tier",
    //     accessor: (row) => row.membershipTier.name,
    //     //Cell: (e) => moment(e.value).format("lll"),
    //   },
      {
        Header: "Status",
        accessor: "availStatus",
        Cell: (e) => (e.value ? "Available" : "Not available"),
      },
      {
        Header: "Email",
        accessor: "email",
        // Cell: (e) => (e.value ? "Yes" : "No"),
        // Filter: SelectColumnFilter,
        // filter: "includes",
      },
      // {
      //   Header: CogIcon,
      //   accessor: "accessor",
      //   Cell: OptionsCell({
      //     options: [
      //       {
      //         name: "Delete",
      //         navigate: "/customer",
      //       },
      //     ],
      //   }),
      // },
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
  const data = useSelector(selectAllCustomer);
  const customerStatus = useSelector((state) => state.customer.status);
  useEffect(() => {
    customerStatus === "idle" && dispatch(fetchCustomers());
  }, [customerStatus, dispatch]);
  
  const handleOnClick = (row) => navigate(`/crm/customer/${row.original.id}`);

  return <CustomerTable data={data} handleOnClick={handleOnClick} />;
};
