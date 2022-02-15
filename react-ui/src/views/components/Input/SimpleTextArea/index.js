export const SimpleTextArea = ({
  inputType = "text",
  inputField,
  placeholder = "",
  value,
  onChange,
  ...rest
}) => {
  return (
    <textarea
      type={inputType}
      id={inputField}
      name={inputField}
      rows={3}
      placeholder={placeholder}
      className="max-w-lg shadow-sm block w-full focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm border border-gray-300 rounded-md"
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
};
