import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

import { api } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import {
  addNewEmployee,
  updateExistingEmployee,
} from "../../../../stores/slices/employeeSlice";
import {
  fetchJobTitles,
  selectAllJobTitle,
} from "../../../../stores/slices/jobTitleSlice";
import {
  fetchDepartments,
  selectAllDepartment,
} from "../../../../stores/slices/departmentSlice";

const EmployeeFormBody = ({
  isEditing,
  name,
  onNameChanged,
  salary,
  onSalaryChanged,
  payType,
  onPayTypeChanged,
  availStatus,
  onAvailStatusChanged,
  email,
  onEmailChanged,
  username,
  onUsernameChanged,
  password,
  onPasswordChanged,
  onAddEmployeeClicked,
  onCancelClicked,
  departmentSelected,
  setDepartmentSelected,
  departments,
  jobTitleSelected,
  setJobTitleSelected,
  jobTitles,
}) => {
  return (
    <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="sr-only">Create New Employee</h1>
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
                          {!isEditing ? "Create New" : "Edit"} Employee
                        </h3>
                      </div>
                      <div className="mt-6 sm:mt-5 space-y-6 sm:space-y-5">
                        <SimpleInputGroup
                          label="Employee Name"
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
                          label="Available Status"
                          inputField="availStatus"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="text"
                            name="availStatus"
                            id="availStatus"
                            autoComplete="availStatus"
                            value={availStatus}
                            onChange={onAvailStatusChanged}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Email"
                          inputField="email"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="text"
                            name="email"
                            id="email"
                            autoComplete="email"
                            value={email}
                            onChange={onEmailChanged}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Username"
                          inputField="username"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="text"
                            name="username"
                            id="username"
                            autoComplete="username"
                            value={username}
                            onChange={onUsernameChanged}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Password"
                          inputField="password"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="text"
                            name="password"
                            id="password"
                            autoComplete="password"
                            value={password}
                            onChange={onPasswordChanged}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Pay Type"
                          inputField="payType"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="text"
                            name="payType"
                            id="payType"
                            autoComplete="payType"
                            value={payType}
                            onChange={onPayTypeChanged}
                            required
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Salary"
                          inputField="salary"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <span className="text-gray-500 sm:text-sm">$</span>
                          </div>
                          <input
                            type="number"
                            name="salary"
                            id="salary"
                            autoComplete="salary"
                            className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                            placeholder="0.00"
                            value={salary}
                            onChange={onSalaryChanged}
                            required
                            step="0.01"
                            aria-describedby="salary-currency"
                          />
                          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                            <span
                              className="text-gray-500 sm:text-sm"
                              id="salary-currency"
                            >
                              SGD
                            </span>
                          </div>
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Job Title"
                          inputField="jobTitle"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          {Boolean(jobTitles.length) ? (
                            <SimpleSelectMenu
                              options={jobTitles}
                              selected={jobTitleSelected}
                              setSelected={setJobTitleSelected}
                            />
                          ) : (
                            <div>No job titles</div>
                          )}
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Department"
                          inputField="department"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          {Boolean(departments.length) ? (
                            <SimpleSelectMenu
                              options={departments}
                              selected={departmentSelected}
                              setSelected={setDepartmentSelected}
                            />
                          ) : (
                            <div>No departments</div>
                          )}
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
                        onClick={onAddEmployeeClicked}
                      >
                        {!isEditing ? "Add" : "Save"} employee
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
};

export const EmployeeForm = () => {
  const { employeeId } = useParams();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState("");
  const [payType, setPayType] = useState("");
  const [salary, setSalary] = useState("");
  const [availStatus, setAvailStatus] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jobTitleSelected, setJobTitleSelected] = useState(null);
  const [departmentSelected, setDepartmentSelected] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onNameChanged = (e) => setName(e.target.value);
  const onAvailStatusChanged = (e) => setAvailStatus(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onPayTypeChanged = (e) => setPayType(e.target.value);
  const onSalaryChanged = (e) => setSalary(e.target.value);

  const jobTitles = useSelector(selectAllJobTitle).map((jobTitle) => ({
    id: jobTitle.id,
    name: jobTitle.title,
  }));
  const jobTitle = jobTitles[0];

  const jobTitleStatus = useSelector((state) => state.jobTitle.status);
  useEffect(() => {
    jobTitleStatus === "idle" && dispatch(fetchJobTitles());
  }, [jobTitleStatus, dispatch]);
  useEffect(() => setJobTitleSelected(jobTitle), [jobTitle]);
  const departments = useSelector(selectAllDepartment).map((department) => ({
    id: department.id,
    name: department.deptName,
  }));
  const department = departments[0];

  const departmentStatus = useSelector((state) => state.department.status);
  useEffect(() => {
    departmentStatus === "idle" && dispatch(fetchDepartments());
  }, [departmentStatus, dispatch]);
  useEffect(() => setDepartmentSelected(department), [department]);

  const [requestStatus, setRequestStatus] = useState("idle");
  const canAdd =
    [
      name,
      departmentSelected,
      availStatus,
      email,
      username,
      password,
      payType,
      salary,
      jobTitles,
    ].every(Boolean) && requestStatus === "idle";

  const onAddEmployeeClicked = (evt) => {
    evt.preventDefault();
    if (canAdd)
      try {
        setRequestStatus("pending");
        if (!isEditing) {
          dispatch(
            addNewEmployee({
              name,
              availStatus,
              email,
              username,
              password,
              payType,
              salary,
              department: {
                id: departmentSelected.id,
                name: departmentSelected.name,
              },
              jobTitle: {
                id: jobTitleSelected.id,
                name: jobTitleSelected.title,
              },
            })
          ).unwrap();
        } else {
          dispatch(
            updateExistingEmployee({
              name,
              department: departmentSelected,
              availStatus,
              email,
              username,
              password,
              payType,
              salary,
              jobTitle: jobTitleSelected,
            })
          ).unwrap();
        }
        alert("Successfully added employee");
        setName("");
        navigate(!isEditing ? "/ad/employee" : `/ad/employee/${employeeId}`);
      } catch (err) {
        console.error("Failed to add employee: ", err);
      } finally {
        setRequestStatus("idle");
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/ad/employee" : `/ad/employee/${employeeId}`);

  useEffect(() => {
    Boolean(employeeId) &&
      api.get("admin/viewEmployee", employeeId).then((response) => {
        const {
          name,
          department,
          availStatus,
          email,
          username,
          password,
          payType,
          salary,
          jobTitle,
        } = response.data;
        setIsEditing(true);
        setName(name);
        setDepartmentSelected(department);
        setAvailStatus(availStatus);
        setEmail(email);
        setUsername(username);
        setPassword(password);
        setPayType(payType);
        setSalary(salary);
        setJobTitleSelected(jobTitle);
      });
  }, [employeeId]);

  return (
    <EmployeeFormBody
      isEditing={isEditing}
      payType={payType}
      onPayTypeChanged={onPayTypeChanged}
      salary={salary}
      onSalaryChanged={onSalaryChanged}
      name={name}
      onNameChanged={onNameChanged}
      departmentSelected={departmentSelected}
      setDepartmentSelected={setDepartmentSelected}
      departments={departments}
      jobTitleSelected={jobTitleSelected}
      setJobTitleSelected={setJobTitleSelected}
      jobTitles={jobTitles}
      availStatus={availStatus}
      onAvailStatusChanged={onAvailStatusChanged}
      email={email}
      onEmailChanged={onEmailChanged}
      username={username}
      onUsernameChanged={onUsernameChanged}
      password={password}
      onPasswordChanged={onPasswordChanged}
      onAddEmployeeClicked={onAddEmployeeClicked}
      onCancelClicked={onCancelClicked}
    />
  );
};
