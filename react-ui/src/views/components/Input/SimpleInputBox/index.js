export const SimpleInputBox = ({
  type = "text",
  name,
  id,
  placeholder = "",
  value,
  onChange,
  ...rest
}) => {
  return (
    <input
      type={type}
      name={name}
      id={id}
      placeholder={placeholder}
      className="flex-1 block w-full focus:ring-cyan-500 focus:border-cyan-500 min-w-0 rounded-md sm:text-sm border-gray-300"
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};
