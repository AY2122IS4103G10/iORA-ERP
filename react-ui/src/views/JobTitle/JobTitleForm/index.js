import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";

import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import { addNewJobTitle } from "../../../../stores/slices/jobTitleSlice";

const JobTitleFormBody = ({
  isEditing,
  title,
  onTitleChanged,
  description,
  onDescriptionChanged,
  responsibility,
  onResponsibilityChanged,
  onAddJobTitleClicked,
  onCancelClicked,
}) => (
  <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
    <h1 className="sr-only">{!isEditing ? "Add" : "Edit"} New Job Title</h1>
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
                      {!isEditing ? "Add New" : "Edit"} Job Title
                    </h3>
                  </div>
                  <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                    <SimpleInputGroup
                      label="Title"
                      inputField="title"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="text"
                        name="title"
                        id="title"
                        autoComplete="title"
                        value={title}
                        onChange={onTitleChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Job Description"
                      inputField="description"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="text"
                        name="description"
                        id="description"
                        value={description}
                        onChange={onDescriptionChanged}
                        required
                      />
                    </SimpleInputGroup>
                    <SimpleInputGroup
                      label="Responsibilities"
                      inputField="responsibility"
                      className="relative rounded-md sm:mt-0 sm:col-span-2"
                    >
                      <SimpleInputBox
                        type="text"
                        name="responsibility"
                        id="responsibility"
                        value={responsibility}
                        onChange={onResponsibilityChanged}
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
                    onClick={onAddJobTitleClicked}
                  >
                    {!isEditing ? "Add" : "Save"} jobTitle
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

export const JobTitleForm = () => {
  const { jobTitleId } = useParams();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [responsibility, setResponsibility] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onTitleChanged = (e) => setTitle(e.target.value);
  const onDescriptionChanged = (e) => setDescription(e.target.value);
  const onResponsibilityChanged = (e) => setResponsibility(e.target.value);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [
      title,
      description,
      responsibility,
    ].every(Boolean) && requestStatus === "idle";

    const onAddJobTitleClicked = (evt) => {
        evt.preventDefault();
        if (canAdd)
            try {
                setRequestStatus("pending");
                if (!isEditing) {
                    dispatch(
                      addNewJobTitle({
                        title,
                        description,
                        responsibility,
                      })
                    ).unwrap();
                  } else {
                    dispatch(
                      updateExistingJobTitle({
                        title,
                        description,
                        responsibility,
                      })
                    ).unwrap();
                  }
        alert("Successfully added job title");
        setName("");
        setAddress1("");
        navigate(!isEditing ? "/ad/jobTitle" : `/ad/jobTitle/${jobTitleId}`);
      } catch (err) {
        console.error("Failed to add job title: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/ad/jobTitle" : `/ad/jobTitle/${jobTitleId}`);

  useEffect(() => {
    Boolean(jobTitleId) &&
      api.get("admin/viewJobTitle", jobTitleId).then((response) => {
        const { title, description, responsibility } =
          response.data;
        setIsEditing(true);
        setTitle(title);
        setDescription(description);
        setResponsibility(responsibility);
      });
  }, [jobTitleId]);

  return (
    <JobTitleFormBody
      isEditing={isEditing}
      title={title}
      onTitleChanged={onTitleChanged}
      description={description}
      onDescriptionChanged={onDescriptionChanged}
      responsibility={responsibility}
      onResponsibilityChanged={onResponsibilityChanged}
      onAddJobTitleClicked={onAddJobTitleClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};
