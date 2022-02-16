import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";

import {
    employeeAdded,
    employeeUpdated,
    selectEmployeeById,
} from "../../../../stores/slices/employeeSlice";
import { SimpleInputGroup } from "../../../components/InputGroups/SimpleInputGroup";
import { SimpleInputBox } from "../../../components/Input/SimpleInputBox";
import { SimpleTextArea } from "../../../components/Input/SimpleTextArea";

const checkboxState = (allFields) => {
    const res = [];
    allFields.forEach((field) => res.push(field));
    return res;
};

const AddEmployeeFormBody = ({
    isEditing,
    name,
    onNameChanged,
    department,
    onDepartmentChanged,
    companyCode,
    onCompanyCodeChanged,
    payrollPerMonth,
    onPayrollPerMonthChanged,
    status,
    onStatusChanged,
    email,
    onEmailChanged,
    username,
    onUsernameChanged,
    password,
    onPasswordChanged,
    onAddEmployeeClicked,
    onCancelClicked,
}) => (
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
                                                label="Department"
                                                inputField="department"
                                                className="sm:mt-0 sm:col-span-2"
                                            >
                                                <SimpleInputBox
                                                    type="text"
                                                    name="department"
                                                    id="department"
                                                    autoComplete="department"
                                                    value={department}
                                                    onChange={onDepartmentChanged}
                                                    required
                                                />
                                            </SimpleInputGroup>
                                            <SimpleInputGroup
                                                label="Status"
                                                inputField="status"
                                                className="sm:mt-0 sm:col-span-2"
                                            >
                                                <SimpleInputBox
                                                    type="text"
                                                    name="status"
                                                    id="status"
                                                    autoComplete="status"
                                                    value={status}
                                                    onChange={onStatusChanged}
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
                                                label="Company Code"
                                                inputField="companyCode"
                                                className="sm:mt-0 sm:col-span-2"
                                            >
                                                <SimpleTextArea
                                                    type="text"
                                                    id="companyCode"
                                                    name="companyCode"
                                                    value={companyCode}
                                                    onChange={onCompanyCodeChanged}
                                                    required
                                                />
                                            </SimpleInputGroup>
                                            <SimpleInputGroup
                                                label="Payroll Per Month"
                                                inputField="payrollPerMonth"
                                                className="relative rounded-md sm:mt-0 sm:col-span-2"
                                            >
                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                    <span className="text-gray-500 sm:text-sm">$</span>
                                                </div>
                                                <input
                                                    type="number"
                                                    name="payrollPerMonth"
                                                    id="payrollPerMonth"
                                                    autoComplete="payrollPerMonth"
                                                    className="focus:ring-cyan-500 focus:border-cyan-500 block w-full pl-7 pr-12 sm:text-sm border-gray-300 rounded-md"
                                                    placeholder="0.00"
                                                    value={payrollPerMonth}
                                                    onChange={onPayrollPerMonthChanged}
                                                    required
                                                    step="0.01"
                                                    aria-describedby="payrollPerMonth-currency"
                                                />
                                                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                                    <span
                                                        className="text-gray-500 sm:text-sm"
                                                        id="payrollPerMonth-currency"
                                                    >
                                                        SGD
                                                    </span>
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
                                            onClick={onAddEmployeeClicked}
                                        >
                                            {!isEditing ? "Add" : "Edit"} employee
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

export const EmployeeForm = () => {
    const { prodId: employeeId } = useParams();
    const employee = useSelector((state) =>
        selectEmployeeById(state, employeeId)
    );
    const isEditing = Boolean(employee);
    const [name, setName] = useState(!isEditing ? "" : employee.name);
    const [department, setDepartment] = useState(!isEditing ? "" : employee.department);
    const [companyCode, setCompanyCode] = useState(!isEditing ? "" : employee.companyCode);
    const [payrollPerMonth, setPayrollPerMonth] = useState(!isEditing ? "" : employee.payrollPerMonth);
    const [status, setStatus] = useState(!isEditing ? "" : employee.status);
    const [email, setEmail] = useState(!isEditing ? "" : employee.email);
    const [username, setUsername] = useState(!isEditing ? "" : employee.username);
    const [password, setPassword] = useState(!isEditing ? "" : employee.password);

    const dispatch = useDispatch();
    const navigate = useNavigate();

    const onNameChanged = (e) => setName(e.target.value);
    const onDepartmentChanged = (e) => setDepartment(e.target.value);
    const onCompanyCode = (e) => setCompanyCode(e.target.value);
    const onPayrollPerMonthChanged = (e) => setPayrollPerMonth(e.target.value);
    const onStatusChanged = (e) => setStatus(e.target.value);
    const onEmailChanged = (e) => setEmail(e.target.value);
    const onUsernameChanged = (e) => setUsername(e.target.value);
    const onPasswordChanged = (e) => setPassword(e.target.value);

    const onAddEmployeeClicked = (evt) => {
        evt.preventDefault();
        canAdd &&
            dispatch(
                !isEditing
                    ? productAdded(
                        name,
                        department,
                        companyCode,
                        payrollPerMonth,
                        status,
                        email,
                        username,
                        password
                    )
                    : productUpdated({
                        name,
                        department,
                        companyCode,
                        payrollPerMonth,
                        status,
                        email,
                        username,
                        password
                    })
            );
        setName("");
        setDepartment("");
        setCompanyCode("");
        setPayrollPerMonth("");
        setStatus("");
        setEmail("");
        setUsername("");
        setPassword("");
        navigate(!isEditing ? "/admin/employee" : `/admin/employee/${name}`);
    };

    const canAdd = name && department && companyCode && payrollPerMonth && status && email && username && password;

    const onCancelClicked = () =>
        navigate(!isEditing ? "/admin/employee" : `/admin/employee/${name}`);

    return (
        <AddEmployeeFormBody
            isEditing={isEditing}
            name={name}
            onNameChanged={onNameChanged}
            department={department}
            onDepartmentChanged={onDepartmentChanged}
            companyCode={companyCode}
            onCompanyCodeChanged={onCompanyCodeChanged}
            payrollPerMonth={payrollPerMonth}
            onPayrollPerMonthChanged={onPayrollPerMonthChanged}
            status={status}
            onStatusChanged={onStatusChanged}
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

