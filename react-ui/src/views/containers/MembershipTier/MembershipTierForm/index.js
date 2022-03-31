import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { useToasts } from "react-toast-notifications";
import { api } from "../../../../environments/Api";
import {
  addNewMembershipTier,
  updateExistingMembershipTier,
} from "../../../../stores/slices/membershipTierSlice";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";

const MembershipTierFormBody = ({
  isEditing,
  name,
  onNameChanged,
  multiplier,
  onMultiplierChanged,
  minSpend,
  onMinSpendChanged,
  birthdayName,
  onBirthdayNameChanged,
  birthdaySpend,
  onBirthdaySpendChanged,
  birthdayQuota,
  onBirthdayQuotaChanged,
  birthdayMultiplier,
  onBirthdayMultiplierChanged,
  onAddMembershipTierClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">
      {!isEditing ? "Create New" : "Edit"} Membership Tier
    </h1>
    {/* Left column */}
    <div className="grid grid-cols-1 gap-4 lg:col-span-2">
      {/* Form */}
      <section aria-labelledby="profile-overview-title">
        <div className="rounded-lg bg-white overflow-hidden shadow">
          <form onSubmit={onAddMembershipTierClicked}>
            <div className="p-8 space-y-8 divide-y divide-gray-200">
              <div className="space-y-8 divide-y divide-gray-200 sm:space-y-5">
                <div>
                  <div>
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {!isEditing ? "Create New" : "Edit"} Membership Tier
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <SimpleInputGroup
                      label="Name"
                      inputField="name"
                      className="sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="text"
                        name="name"
                        id="name"
                        autoComplete="name"
                        value={name}
                        onChange={onNameChanged}
                        disabled={isEditing}
                        className={isEditing && "bg-gray-50 text-gray-400"}
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Multiplier"
                      inputField="multiplier"
                      className="sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="number"
                        name="multiplier"
                        id="multiplier"
                        autoComplete="multiplier"
                        step="0.01"
                        min="0"
                        placeholder="0.00"
                        value={multiplier}
                        onChange={onMultiplierChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Minimum Spend"
                      inputField="minimumSpend"
                      className="sm:mt-0 sm:col-span-2"
                    >
                      <div className="mt-1 relative rounded-md">
                        <input
                          type="text"
                          name="price"
                          id="price"
                          className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                          placeholder="0.00"
                          value={minSpend}
                          onChange={onMinSpendChanged}
                          required
                        />
                      </div>
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Birthday"
                      inputField="birthday"
                      className="sm:mt-0 sm:col-span-2"
                    >
                      <div className="py-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="birthdayName"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Name
                          </label>
                          <div className="mt-1">
                            <input
                              type="text"
                              name="birthdayName"
                              id="birthdayName"
                              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              autoComplete="birthdayName"
                              placeholder="STANDARD"
                              value={birthdayName}
                              onChange={onBirthdayNameChanged}
                            />
                            <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">
                              Leave blank if not applicable.
                            </p>
                          </div>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="birthdaySpend"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Birthday Spend
                          </label>
                          <div className="mt-1 relative rounded-md">
                            <input
                              type="text"
                              name="birthdaySpend"
                              id="birthdaySpend"
                              className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pr-12 sm:text-sm border-gray-300 rounded-md"
                              placeholder="200.00"
                              value={birthdaySpend}
                              onChange={onBirthdaySpendChanged}
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">
                            Leave blank if not applicable.
                          </p>
                        </div>
                      </div>
                      <div className="py-2 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="multiplier"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Multiplier
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="multiplier"
                              id="multiplier"
                              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              step="0.01"
                              min="0"
                              placeholder="2.00"
                              value={birthdayMultiplier}
                              onChange={onBirthdayMultiplierChanged}
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">
                            Leave blank if not applicable.
                          </p>
                        </div>
                        <div className="sm:col-span-1">
                          <label
                            htmlFor="quota"
                            className="block text-sm font-medium text-gray-700"
                          >
                            Quota
                          </label>
                          <div className="mt-1">
                            <input
                              type="number"
                              name="quota"
                              id="quota"
                              className="shadow-sm focus:ring-cyan-500 focus:border-cyan-500 block w-full sm:text-sm border-gray-300 rounded-md"
                              min="0"
                              placeholder="1"
                              value={birthdayQuota}
                              onChange={onBirthdayQuotaChanged}
                            />
                          </div>
                          <p className="mt-2 text-sm text-gray-500 whitespace-pre-line">
                            Leave blank if not applicable.
                          </p>
                        </div>
                      </div>
                    </SimpleInputGroup>
                  </div>
                </div>
              </div>

              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                    onClick={onCancelClicked}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
                  >
                    {!isEditing ? "Add" : "Save"} Membership Tier
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </section>
    </div>
  </div>
);

export const MembershipTierForm = () => {
  const { name: tierName } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tierName);
  const [multiplier, setMultiplier] = useState("");
  const [minSpend, setMinSpend] = useState("");
  const [birthdayName, setBirthdayName] = useState("");
  const [birthdaySpend, setBirthdaySpend] = useState("");
  const [birthdayQuota, setBirthdayQuota] = useState("");
  const [birthdayMultiplier, setBirthdayMultiplier] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const onNameChanged = (e) => setName(e.target.value);
  const onMultiplierChanged = (e) => setMultiplier(e.target.value);
  const onMinSpendChanged = (e) => setMinSpend(e.target.value);
  const onBirthdayNameChanged = (e) => setBirthdayName(e.target.value);
  const onBirthdaySpendChanged = (e) => setBirthdaySpend(e.target.value);
  const onBirthdayQuotaChanged = (e) => setBirthdayQuota(e.target.value);
  const onBirthdayMultiplierChanged = (e) =>
    setBirthdayMultiplier(e.target.value);

  const onAddMembershipTierClicked = (evt) => {
    evt.preventDefault();
    if (!isEditing) {
      name &&
        dispatch(
          addNewMembershipTier({
            name,
            multiplier,
            minSpend,
            birthday: {
              name: birthdayName.length ? birthdayName : "STANDARD",
              birthdaySpend: birthdaySpend.length ? birthdaySpend : 200,
              quota: birthdayQuota.length ? birthdayQuota : 1,
              multiplier: birthdayMultiplier.length ? birthdayMultiplier : 2,
            },
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully added membership tier", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate("/sm/rewards-loyalty/tiers");
          })
          .catch((err) => {
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            });
          });
    } else {
      dispatch(
        updateExistingMembershipTier({
          name,
          multiplier,
          minSpend,
          birthday: {
            name: birthdayName.length ? birthdayName : "STANDARD",
            birthdaySpend: birthdaySpend.length ? birthdaySpend : 200,
            quota: birthdayQuota.length ? birthdayQuota : 1,
            multiplier: birthdayMultiplier.length ? birthdayMultiplier : 2,
          },
        })
      )
        .unwrap()
        .then(() => {
          addToast("Successfully updated membership tier", {
            appearance: "success",
            autoDismiss: true,
          });
          navigate(`/sm/rewards-loyalty/tiers/${tierName}`);
        })
        .catch((err) => {
          addToast(`Error: ${err.message}`, {
            appearance: "error",
            autoDismiss: true,
          });
        });
    }
  };

  const onCancelClicked = () => navigate(-1);

  useEffect(() => {
    Boolean(tierName) &&
      api.get("sam/membershipTier", `?name=${tierName}`).then((response) => {
        const { name, multiplier, minSpend, birthday } = response.data;
        setIsEditing(true);
        setName(name);
        setMultiplier(multiplier);
        setMinSpend(minSpend);
        setBirthdayName(birthday.name);
        setBirthdaySpend(birthday.birthdaySpend);
        setBirthdayQuota(birthday.quota);
        setBirthdayMultiplier(birthday.multiplier);
      });
  }, [tierName]);

  return (
    <MembershipTierFormBody
      isEditing={isEditing}
      multiplier={multiplier}
      onMultiplierChanged={onMultiplierChanged}
      name={name}
      onNameChanged={onNameChanged}
      minSpend={minSpend}
      onMinSpendChanged={onMinSpendChanged}
      birthdayName={birthdayName}
      onBirthdayNameChanged={onBirthdayNameChanged}
      birthdaySpend={birthdaySpend}
      onBirthdaySpendChanged={onBirthdaySpendChanged}
      birthdayQuota={birthdayQuota}
      onBirthdayQuotaChanged={onBirthdayQuotaChanged}
      birthdayMultiplier={birthdayMultiplier}
      onBirthdayMultiplierChanged={onBirthdayMultiplierChanged}
      onAddMembershipTierClicked={onAddMembershipTierClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};
