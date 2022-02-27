import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { CogIcon } from "@heroicons/react/outline";

import { SimpleTable } from "../../../components/Tables/SimpleTable";
import {
  fetchMembershipTiers,
  selectAllMembershipTier,
} from "../../../../stores/slices/membershipTierSlice";

export const MembershipTierTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Id",
        accessor: "id",
        // Cell: (e) => (
        //   <Link
        //     to={`/admin/membershipTier/${e.value}`}
        //     className="hover:text-gray-700 hover:underline"
        //   >
        //     {e.value}
        //   </Link>
        // ),name, department, companyCode, status, email
      },
      {
        Header: "Membership Tier",
        accessor: "name",
      },
      {
        Header: "Multiplier",
        accessor: "multiplier",
      },
      {
        Header: "Threshold",
        accessor: "threshold",
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
      //         navigate: "/membershipTier",
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

export const MembershipTierList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllMembershipTier);
  const membershipTierStatus = useSelector((state) => state.membershipTier.status);
  useEffect(() => {
    membershipTierStatus === "idle" && dispatch(fetchMembershipTiers());
  }, [membershipTierStatus, dispatch]);
  
  const handleOnClick = (row) => navigate(`/crm/membershipTier/${row.original.id}`);

  return <MembershipTierTable data={data} handleOnClick={handleOnClick} />;
};
