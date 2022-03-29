export const SimpleInlineRG = ({
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
        <p className="text-sm leading-5 text-gray-500">
          {description}
        </p>
      )}
      <fieldset className="mt-4">
        <legend className="sr-only">{label} method</legend>
        <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
          {options.map((option) => (
            <div key={option.id} className="flex items-center">
              <input
                id={option.id}
                name="notification-method"
                type="radio"
                checked={selected.id === option.id}
                onChange={() => onSelectedChanged(option)}
                className="focus:ring-cyan-500 h-4 w-4 text-cyan-600 border-gray-300"
              />
              <label
                htmlFor={option.id}
                className="ml-3 block text-sm font-medium text-gray-700"
              >
                {option.title}
              </label>
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
};
