import { MembershipTierList } from "../MembershipTierList";
import { Header } from "../../Customer/ManageCustomer";

export const ManageMembershipTier = () => {
  return (
    <>
      {<Header type="Membership Tier" path="/sm/customers/tiers/create"/>}
      {<MembershipTierList />}
    </>
  );
};