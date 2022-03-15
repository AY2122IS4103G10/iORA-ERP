import { PencilIcon } from "@heroicons/react/outline";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import {
  fetchMembershipTiers,
  selectMembershipTierByName,
} from "../../../../stores/slices/membershipTierSlice";
import { NavigatePrev } from "../../../components/Breadcrumbs/NavigatePrev";

const Header = ({ name }) => {
  const navigate = useNavigate();
  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 md:flex md:items-center md:justify-between md:space-x-5 lg:max-w-7xl lg:px-8">
      <div className="flex items-center space-x-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
        </div>
      </div>
      <div className="mt-6 flex flex-col-reverse justify-stretch space-y-4 space-y-reverse sm:flex-row-reverse sm:justify-end sm:space-x-reverse sm:space-y-0 sm:space-x-3 md:mt-0 md:flex-row md:space-x-3">
        <button
          type="button"
          className="inline-flex items-center justify-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-100 focus:ring-cyan-500"
          onClick={() => navigate("edit")}
        >
          <PencilIcon
            className="-ml-1 mr-2 h-5 w-5 text-gray-400"
            aria-hidden="true"
          />
          <span>Edit</span>
        </button>
      </div>
    </div>
  );
};

const MembershipTierDetailsBody = ({ minSpend, multiplier, birthday }) => (
  <div className="mt-8 max-w-3xl mx-auto grid grid-cols-1 gap-6 sm:px-6 lg:max-w-7xl lg:grid-flow-col-dense lg:grid-cols-1">
    <div className="space-y-6 lg:col-start-1 lg:col-span-2">
      {/* Membership Tier Information*/}
      <section aria-labelledby="membership-tier-information-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Membership Tier Information
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Minimum Spend
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{minSpend}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Multiplier
                </dt>
                <dd className="mt-1 text-sm text-gray-900">{multiplier}</dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
      <section aria-labelledby="birthdya-title">
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:px-6">
            <h2
              id="warehouse-information-title"
              className="text-lg leading-6 font-medium text-gray-900"
            >
              Birthday
            </h2>
          </div>
          <div className="border-t border-gray-200 px-4 py-5 sm:px-6">
            <dl className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2">
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Name</dt>
                <dd className="mt-1 text-sm text-gray-900">{birthday.name}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">Quota</dt>
                <dd className="mt-1 text-sm text-gray-900">{birthday.quota}</dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Birthday Spend
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {birthday.birthdaySpend}
                </dd>
              </div>
              <div className="sm:col-span-1">
                <dt className="text-sm font-medium text-gray-500">
                  Multiplier
                </dt>
                <dd className="mt-1 text-sm text-gray-900">
                  {birthday.multiplier}
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    </div>
  </div>
);

export const MembershipTierDetails = () => {
  const { name } = useParams();
  const membershipTier = useSelector((state) =>
    selectMembershipTierByName(state, name)
  );
  const dispatch = useDispatch();
  const memStatus = useSelector((state) => state.membershipTiers.status);

  useEffect(() => {
    memStatus === "idle" && dispatch(fetchMembershipTiers());
  }, [memStatus, dispatch]);

  return (
    Boolean(membershipTier) && (
      <>
        <div className="py-8 xl:py-10">
          <NavigatePrev
            page="Membership Tiers"
            path="/sm/rewards-loyalty/tiers"
          />
          <Header name={membershipTier.name} />
          <MembershipTierDetailsBody
            minSpend={membershipTier.minSpend}
            // currency={membershipTier.currency}
            multiplier={membershipTier.multiplier}
            birthday={membershipTier.birthday}
          />
        </div>
      </>
    )
  );
};
