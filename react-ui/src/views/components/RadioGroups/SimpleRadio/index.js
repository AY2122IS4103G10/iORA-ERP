export const SimpleRadio = ({
  label,
  description,
  options,
  selected,
  onSelectedChanged,
}) => {
  return (
    <div>
      {label && (
        <label className="text-base font-medium text-gray-900">{label}</label>
      )}
      {description && (
        <p className="text-sm leading-5 text-gray-500">{description}</p>
      )}
      <fieldset className="mt-4 mb-1">
        <legend className="sr-only">Notification method</legend>
        <div className="space-y-4">
          {options.map((option) => (
            <div key={option.id} className="ml-1 flex items-center">
              <input
                id={option.id}
                name="option"
                type="radio"
                className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
                checked={option.id === selected.id}
                onChange={() => onSelectedChanged(option)}
              />
              <label
                htmlFor={option.id}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {option.fieldValue}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
