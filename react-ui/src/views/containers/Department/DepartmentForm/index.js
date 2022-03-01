import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { addNewDepartment } from "../../../../stores/slices/departmentSlice";
import { updateExistingDepartment } from "../../../../stores/slices/departmentSlice";

const DepartmentFormBody = ({
  isEditing,
  name,
  onNameChanged,
  onAddDepartmentClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Department</h1>
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
                      {!isEditing ? "Add New" : "Edit"} Department
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <SimpleInputGroup
                      label="Department Name"
                      inputField="name"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
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
                    onClick={onAddDepartmentClicked}
                  >
                    {!isEditing ? "Add" : "Save"} Department
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

export const DepartmentForm = () => {
  const { departmentId } = useParams();
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onNameChanged = (e) => setName(e.target.value);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd = [name].every(Boolean) && requestStatus === "idle";

  const onAddDepartmentClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        if (!isEditing) {
          dispatch(
            addNewDepartment({
              deptName: name,
            })
          ).unwrap();
        } else {
          dispatch(
            updateExistingDepartment({
              deptName: name,
            })
          ).unwrap();
        }
        alert("Successfully added department");
        setName("");
        navigate(
          !isEditing ? "/ad/department" : `/ad/department/${departmentId}`
        );
      } catch (err) {
        console.error("Failed to add department: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () => navigate(!isEditing ? "/ad/department" : `/ad/department/${departmentId}`);

  useEffect(() => {
    Boolean(departmentId) &&
      api.get("admin/viewDepartment", departmentId).then((response) => {
        const { name } = response.data;
        setIsEditing(true);
        setName(name);
      });
  }, [departmentId]);

  return (
    <DepartmentFormBody
      isEditing={isEditing}
      name={name}
      onNameChanged={onNameChanged}
      onAddDepartmentClicked={onAddDepartmentClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};
