import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  fetchMembershipTiers,
  selectAllMembershipTiers
} from "../../../../stores/slices/membershipTierSlice";
import { SimpleTable } from "../../../components/Tables/SimpleTable";


export const MembershipTierTable = ({ data, handleOnClick }) => {
  const columns = useMemo(
    () => [
      {
        Header: "Membership Tier",
        accessor: "name",
      },
      {
        Header: "Multiplier",
        accessor: "multiplier",
      },
      {
        Header: "Threshold (SGD)",
        accessor: (e) => e.threshold["SGD,Singapore Dollar"],
      },
      {
        Header: "Threshold (RM)",
        accessor: (e) => e.threshold["RM,Malaysian Ringgit"],
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

export const MembershipTierList = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const data = useSelector(selectAllMembershipTiers);
  const membershipTierStatus = useSelector((state) => state.membershipTiers.status);
  useEffect(() => {
    membershipTierStatus === "idle" && dispatch(fetchMembershipTiers());
  }, [membershipTierStatus, dispatch]);
  
  const handleOnClick = (row) => navigate(`/sm/customers/tiers/${row.original.name}`);

  return <MembershipTierTable data={data} handleOnClick={handleOnClick} />;
};
