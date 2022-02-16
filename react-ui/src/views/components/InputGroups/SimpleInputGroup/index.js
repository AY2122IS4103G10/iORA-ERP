import { classNames } from "../../../../utilities/Util";

export const SimpleInputGroup = ({
  label,
  inputField,
  className,
  children,
}) => (
  <div className="sm:grid sm:grid-cols-3 sm:gap-4 sm:items-start sm:border-t sm:border-gray-200 sm:pt-5">
    <label
      htmlFor={inputField}
      className="block text-sm font-medium text-gray-700 sm:mt-px sm:pt-2"
    >
      {label}
    </label>
    <div className={classNames("mt-1", className)}>{children}</div>
  </div>
);
