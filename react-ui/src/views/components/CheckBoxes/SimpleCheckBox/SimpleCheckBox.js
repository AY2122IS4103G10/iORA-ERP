export const SimpleCheckBox = ({legend, options, inputField, ...rest}) => {
  return (
    <fieldset className="space-y-5">
      <legend className="sr-only">{legend}</legend>
      {options.map((option) => (
        <div className="relative flex items-start">
          <div className="flex items-center h-5">
            <input
              id={inputField}
              aria-describedby="comments-description"
              name={inputField}
              type="checkbox"
              className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300 rounded"
              {...rest}
            />
          </div>
          <div className="ml-3 text-sm">
            <label htmlFor="comments" className="font-medium text-gray-700">
              {option.name}
            </label>
          </div>
        </div>
      ))}
    </fieldset>
  );
};
