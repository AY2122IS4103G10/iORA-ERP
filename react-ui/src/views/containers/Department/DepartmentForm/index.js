import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useToasts } from "react-toast-notifications";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { api, departmentApi } from "../../../../environments/Api";
import { addNewDepartment } from "../../../../stores/slices/departmentSlice";
import { updateExistingDepartment } from "../../../../stores/slices/departmentSlice";
import { RightColSection } from "../../Companies/CompanyForm";
import { FormCheckboxes } from "../../Products/ProductForm";

const DepartmentFormBody = ({
  isEditing,
  name,
  onNameChanged,
  jobTs,
  onJobTitlesChanged,
  jobTitleCheckedState,
  onAddDepartmentClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Department</h1>
    <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
      <div className="grid grid-cols-1 gap-4 lg:col-span-2">
        {/* Form */}
        <section aria-labelledby="profile-overview-title">
          <div className="rounded-lg bg-white overflow-hidden shadow">
            <form onSubmit={onAddDepartmentClicked}>
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
      {/* Right column */}
      <div className="grid grid-cols-1 gap-4">
        {/* Job Titles */}
        <RightColSection fieldName="Job Title" path="/ad/jobTitles/create">
          {jobTs.length ? (
            <FormCheckboxes
              legend="Job Title"
              options={jobTs}
              inputField="JobTitle"
              onFieldsChanged={onJobTitlesChanged}
              fieldValues={jobTitleCheckedState}
            />
          ) : (
            "No job titles found"
          )}
        </RightColSection>
      </div>
    </div>
  </div>
);

export const DepartmentForm = () => {
  const { addToast } = useToasts();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { departmentId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [jobTs, setJobTitles] = useState([]);
  const [jobTitleCheckedState, setJobTitleCheckedState] = useState([]);

  useEffect(() => {
    api.getAll("admin/viewJobTitles?search=").then((response) => {
      setJobTitles(
        response.data.map((title) => ({ ...title, fieldValue: title.title }))
      );
      setJobTitleCheckedState(new Array(response.data.length).fill(false));
    });
  }, []);

  const onNameChanged = (e) => setName(e.target.value);
  const onJobTitlesChanged = (pos) => {
    const updateCheckedState = jobTitleCheckedState.map((item, index) =>
      index === pos ? !item : item
    );
    setJobTitleCheckedState(updateCheckedState);
  };
  const canAdd = [name].every(Boolean);

  const onAddDepartmentClicked = (evt) => {
    evt.preventDefault();
    const jt = [];
    jobTs.forEach(
      (dept, index) => jobTitleCheckedState[index] && jt.push(dept)
    );
    if (canAdd)
      if (!isEditing) {
        dispatch(
          addNewDepartment({
            deptName: name,
            jobTitles: jt.map((title) => ({ id: title.id })),
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully added department.", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate("/ad/departments");
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
      } else {
        dispatch(
          updateExistingDepartment({
            id: departmentId,
            deptName: name,
            jobTitles: jt.map((title) => ({ id: title.id })),
          })
        )
          .unwrap()
          .then(() => {
            addToast("Successfully updated department.", {
              appearance: "success",
              autoDismiss: true,
            });
            navigate(`/ad/departments/${departmentId}`);
          })
          .catch((err) =>
            addToast(`Error: ${err.message}`, {
              appearance: "error",
              autoDismiss: true,
            })
          );
      }
  };

  const onCancelClicked = () => navigate(-1);

  useEffect(() => {
    Boolean(departmentId) &&
      departmentApi.getDepartment(departmentId).then((response) => {
        const { deptName, jobTitles } = response.data;
        setIsEditing(true);
        setName(deptName);
        setJobTitleCheckedState(
          jobTs.map((title) => jobTitles.map((t) => t.id).includes(title.id))
        );
      });
  }, [departmentId, jobTs]);
  return (
    <DepartmentFormBody
      isEditing={isEditing}
      name={name}
      onNameChanged={onNameChanged}
      jobTs={jobTs}
      onJobTitlesChanged={onJobTitlesChanged}
      jobTitleCheckedState={jobTitleCheckedState}
      onAddDepartmentClicked={onAddDepartmentClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};
