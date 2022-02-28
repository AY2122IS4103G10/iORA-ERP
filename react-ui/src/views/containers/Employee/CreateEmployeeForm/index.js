import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";
import { SimpleModal } from "../../../components/Modals/SimpleModal";

import { api, employeeApi } from "../../../../environments/Api";
import SimpleSelectMenu from "../../../components/SelectMenus/SimpleSelectMenu";
import {
  addNewEmployee,
  updateExistingEmployee,
} from "../../../../stores/slices/employeeSlice";
import {
  fetchCompanies,
  selectAllCompanies,
} from "../../../../stores/slices/companySlice";

const payTypes = [
  { id: 1, name: "Monthly", value: "MONTHLY" },
  { id: 2, name: "Hourly", value: "HOURLY" },
];

const EmployeeFormBody = ({
  isEditing,
  name,
  onNameChanged,
  salary,
  onSalaryChanged,
  payTypes,
  payTypeSelected,
  setPayTypeSelected,
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
  companies,
  companySelected,
  setCompanySelected,
}) => {
  return (
    <div className="mt-4 max-w-3xl mx-auto px-4 sm:px-6 lg:max-w-7xl lg:px-8">
      <h1 className="sr-only">Create New Employee</h1>
      {/* Main 3 column grid */}
      <div className="grid grid-cols-1 gap-4 items-start lg:grid-cols-3 lg:gap-8">
        <div className="grid grid-cols-1 gap-4 lg:col-span-4">
          {/* Form */}
          <section aria-labelledby="profile-overview-title">
            <div className="rounded-lg bg-white overflow-hidden shadow">
              <form onSubmit={onAddEmployeeClicked}>
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
                          label="Email"
                          inputField="email"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="email"
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
                            placeholder="Leave blank if using email as username."
                            value={username}
                            onChange={onUsernameChanged}
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Password"
                          inputField="password"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          <SimpleInputBox
                            type="password"
                            name="password"
                            id="password"
                            autoComplete="password"
                            placeholder={
                              isEditing ? "Leave blank if unchanged." : ""
                            }
                            value={password}
                            onChange={onPasswordChanged}
                            required={!isEditing ? true : false}
                          />
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Pay Type"
                          inputField="payType"
                          className="sm:mt-0 sm:col-span-2"
                        >
                          {[
                            payTypes.length,
                            payTypeSelected,
                            setPayTypeSelected,
                          ].every(Boolean) ? (
                            <SimpleSelectMenu
                              options={payTypes}
                              selected={payTypeSelected}
                              setSelected={setPayTypeSelected}
                            />
                          ) : (
                            <div>No pay types</div>
                          )}
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
                            min="0"
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
                          label="Department"
                          inputField="department"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          {[
                            departments.length,
                            departmentSelected,
                            setDepartmentSelected,
                          ].every(Boolean) ? (
                            <SimpleSelectMenu
                              options={departments}
                              selected={departmentSelected}
                              setSelected={setDepartmentSelected}
                            />
                          ) : (
                            <div>No departments</div>
                          )}
                        </SimpleInputGroup>
                        <SimpleInputGroup
                          label="Job Title"
                          inputField="jobTitle"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          {[
                            jobTitles.length,
                            jobTitleSelected,
                            setJobTitleSelected,
                          ].every(Boolean) ? (
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
                          label="Company"
                          inputField="company"
                          className="relative rounded-md sm:mt-0 sm:col-span-2"
                        >
                          {[
                            companies,
                            companySelected,
                            setCompanySelected,
                          ].every(Boolean) ? (
                            <SimpleSelectMenu
                              options={companies}
                              selected={companySelected}
                              setSelected={setCompanySelected}
                            />
                          ) : (
                            <div>No companies</div>
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
  const [payTypeSelected, setPayTypeSelected] = useState(payTypes[0]);
  const [salary, setSalary] = useState("");
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [jobTitles, setJobTitles] = useState([]);
  const [jobTitleSelected, setJobTitleSelected] = useState(null);
  const [departments, setDepartments] = useState([]);
  const [departmentSelected, setDepartmentSelected] = useState(null);
  const [companySelected, setCompanySelected] = useState(null);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const onNameChanged = (e) => setName(e.target.value);
  const onEmailChanged = (e) => setEmail(e.target.value);
  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onSalaryChanged = (e) => setSalary(e.target.value);
  const onDeptChanged = (e) => {
    setDepartmentSelected(e);
    const jobTitles = e.jobTitles.map((jobTitle) => ({
      id: jobTitle.id,
      name: jobTitle.title,
    }));
    setJobTitles(jobTitles);
    setJobTitleSelected(jobTitles[0]);
  };
  const onJobTitleChanged = (e) => setJobTitleSelected(e);

  useEffect(() => {
    api.getAll("admin/viewDepartments?search=").then((response) => {
      const departments = response.data.map((dept) => ({
        id: dept.id,
        name: dept.deptName,
        jobTitles: dept.jobTitles,
      }));
      setDepartments(departments);
      setDepartmentSelected(departments[0]);
      const jobTitles = departments[0].jobTitles.map((jobTitle) => ({
        id: jobTitle.id,
        name: jobTitle.title,
      }));
      setJobTitles(jobTitles);
      setJobTitleSelected(jobTitles[0]);
    });
  }, []);

  const companies = useSelector(selectAllCompanies);
  const company = companies[0];
  const companyStatus = useSelector((state) => state.companies.status);
  useEffect(() => {
    companyStatus === "idle" && dispatch(fetchCompanies());
  }, [companyStatus, dispatch]);

  useEffect(() => {
    company && setCompanySelected(company);
  }, [company]);

  const canAdd = [
    name,
    departmentSelected,
    email,
    payTypeSelected,
    salary,
    jobTitles,
  ].every(Boolean);

  const onAddEmployeeClicked = (evt) => {
    evt.preventDefault();
    console.log({
      name,
      availStatus: true,
      email,
      username: Boolean(username.length) ? username : email,
      password,
      payType: payTypeSelected.value,
      salary,
      department: {
        id: departmentSelected.id,
      },
      jobTitle: {
        id: jobTitleSelected.id,
      },
    });
    if (canAdd)
      if (!isEditing) {
        dispatch(
          addNewEmployee({
            name,
            availStatus: true,
            email,
            username: Boolean(username.length) ? username : email,
            password,
            payType: payTypeSelected.value,
            salary,
            department: {
              id: departmentSelected.id,
            },
            jobTitle: {
              id: jobTitleSelected.id,
            },
            company: { id: companySelected.id },
          })
        )
          .unwrap()
          .then(() => {
            alert("Successfully added employee");
            navigate("/ad/employees");
          })
          .catch((err) => console.error("Failed to add employee: ", err));
      } else {
        dispatch(
          updateExistingEmployee({
            id: employeeId,
            name,
            availStatus: true,
            email,
            username: Boolean(username.length) ? username : email,
            password,
            payType: payTypeSelected.value,
            salary,
            department: {
              id: departmentSelected.id,
            },
            jobTitle: {
              id: jobTitleSelected.id,
            },
            company: { id: companySelected.id },
          })
        )
          .unwrap()
          .then(() => {
            alert("Successfully updated employee");
            navigate(`/ad/employees/${employeeId}`);
          })
          .catch((err) => console.error("Failed to update employee: ", err));
      }
  };

  const onCancelClicked = () =>
    navigate(!isEditing ? "/ad/employees" : `/ad/employees/${employeeId}`);

  useEffect(() => {
    Boolean(employeeId) &&
      employeeApi.getEmployee(employeeId).then((response) => {
        const {
          name,
          department,
          email,
          username,
          payType,
          salary,
          jobTitle,
          company,
        } = response.data;
        setIsEditing(true);
        setName(name);
        setDepartmentSelected({
          id: department.id,
          name: department.deptName,
          jobTitles: department.jobTitles,
        });
        setEmail(email);
        setUsername(username);
        setPayTypeSelected(payTypes.find((type) => type.value === payType));
        setSalary(salary);
        setJobTitleSelected({
          id: jobTitle.id,
          name: jobTitle.title,
        });
        setCompanySelected(company);
      });
  }, [employeeId]);

  return (
    <EmployeeFormBody
      isEditing={isEditing}
      payTypes={payTypes}
      payTypeSelected={payTypeSelected}
      setPayTypeSelected={setPayTypeSelected}
      salary={salary}
      onSalaryChanged={onSalaryChanged}
      name={name}
      onNameChanged={onNameChanged}
      departmentSelected={departmentSelected}
      setDepartmentSelected={onDeptChanged}
      departments={departments}
      jobTitleSelected={jobTitleSelected}
      setJobTitleSelected={onJobTitleChanged}
      jobTitles={jobTitles}
      companies={companies}
      companySelected={companySelected}
      setCompanySelected={setCompanySelected}
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
