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
        Header: "Min. Spend",
        accessor: "minSpend",
      },
      // {
      //   Header: "Currency",
      //   accessor: "currency",
      //   Cell: (e) => `${e.value.name} (${e.value.code})`,
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
  const data = useSelector(selectAllMembershipTiers);
  const membershipTierStatus = useSelector((state) => state.membershipTiers.status);
  useEffect(() => {
    membershipTierStatus === "idle" && dispatch(fetchMembershipTiers());
  }, [membershipTierStatus, dispatch]);
  console.log(data)
  const handleOnClick = (row) => navigate(`/sm/rewards-loyalty/tiers/${row.original.name}`);

  return <MembershipTierTable data={data} handleOnClick={handleOnClick} />;
};
