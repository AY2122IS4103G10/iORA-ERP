import { classNames } from "../../../../utilities/Util";

export const SimpleInputBox = ({
  type = "text",
  name,
  id,
  placeholder = "",
  value,
  onChange,
  className,
  ...rest
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      className={classNames(
        "flex-1 block w-full focus:ring-cyan-500 focus:border-cyan-500 min-w-0 rounded-md sm:text-sm border-gray-300",
        className
      )}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};
