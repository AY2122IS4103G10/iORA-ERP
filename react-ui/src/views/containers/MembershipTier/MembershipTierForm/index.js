import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import {
  addNewMembershipTier,
  updateExistingMembershipTier,
} from "../../../../stores/slices/membershipTierSlice";
import { useToasts } from "react-toast-notifications";

const MembershipTierFormBody = ({
  isEditing,
  name,
  onNameChanged,
  multiplier,
  onMultiplierChanged,
  threshold,
  onThresholdChanged,
  onAddMembershipTierClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">
      {!isEditing ? "Create New" : "Edit"} Membership Tier
    </h1>
    {/* Main 3 column grid */}
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      {/* Left column */}
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        {/* Form */}
        <section aria-labelledby="profile-overview-title">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <form>
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
                        label="Membership Tier Name"
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
                          required
                        />
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Threshold"
                        inputField="threshold"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        {Object.keys(threshold).map((k) => (
                          <SimpleInputGroup
                            label={`${k}`}
                            key={`${k}`}
                            inputField={`${k}`}
                            className="sm:mt-0 sm:col-span-1"
                          >
                            <SimpleInputBox
                              type="text"
                              name={`${k}`}
                              id={`${k}`}
                              value={threshold[k]}
                              onChange={(e) => onThresholdChanged(k, e)}
                              required
                            />
                          </SimpleInputGroup>
                        ))}
                      </SimpleInputGroup>
                      <SimpleInputGroup
                        label="Multiplier"
                        inputField="multiplier"
                        className="sm:mt-0 sm:col-span-2"
                      >
                        <SimpleInputBox
                          type="text"
                          name="multiplier"
                          id="multiplier"
                          autoComplete="multiplier"
                          value={multiplier}
                          onChange={onMultiplierChanged}
                          required
                        />
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
                      onClick={onAddMembershipTierClicked}
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
  </div>
);

export const MembershipTierForm = () => {
  const { name: tierName } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(tierName);
  const [multiplier, setMultiplier] = useState("");
  const [threshold, setThreshold] = useState({
    "SGD,Singapore Dollar": 0,
    "RM,Malaysian Ringgit": 0,
  });

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { addToast } = useToasts();

  const onNameChanged = (e) => setName(e.target.value);
  const onThresholdChanged = (k, e) => {
    const newT = {...threshold}
    newT[k] = e.target.value
    setThreshold(newT);
  };
  const onMultiplierChanged = (e) => setMultiplier(e.target.value);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [name, threshold, multiplier].every(Boolean) && requestStatus === "idle";

  const onAddMembershipTierClicked = (evt) => {
    evt.preventDefault();
    if (canAdd) {
      setRequestStatus("pending");
      if (!isEditing) {
        dispatch(
          addNewMembershipTier({
            name,
            threshold,
            multiplier,
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully added membership tier", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate("/sm/customers/tiers");
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
            threshold,
            multiplier,
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully updated membership tier", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate(`/sm/customers/tiers/${tierName}`);
          })
          .catch((err) => {
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            });
          });
      }
    }
  };

  const onCancelClicked = () =>
    navigate(
      !isEditing ? "/sm/customers/tiers" : `/sm/customers/tiers/${tierName}`
    );

  useEffect(() => {
    Boolean(tierName) &&
      api.get("sam/membershipTier/", `?name=${tierName}`).then((response) => {
        const { name, threshold, multiplier } = response.data;
        setIsEditing(true);
        setName(name);
        setThreshold(threshold);
        setMultiplier(multiplier);
      });
  }, [tierName]);

  return (
    <MembershipTierFormBody
      isEditing={isEditing}
      multiplier={multiplier}
      onMultiplierChanged={onMultiplierChanged}
      name={name}
      onNameChanged={onNameChanged}
      threshold={threshold}
      onThresholdChanged={onThresholdChanged}
      onAddMembershipTierClicked={onAddMembershipTierClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};
