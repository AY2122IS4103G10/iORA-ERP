import { RadioGroup } from "@headlessui/react";
import { CheckCircleIcon } from '@heroicons/react/solid';
import { classNames } from "../../../utilities/Util";


export const RadioGroupComponent = ({label, options, value, onChange}) => {
    return (
        <RadioGroup value={value} onChange={onChange}>
        <RadioGroup.Label className="text-lg font-medium text-gray-900">{label}</RadioGroup.Label>

        <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
          {options.map((option) => (
            <RadioGroup.Option
              key={option.id}
              value={option}
              className={({ checked, active }) =>
                classNames(
                  checked ? 'border-transparent' : 'border-gray-300',
                  active ? 'ring-2 ring-gray-500' : '',
                  'relative bg-white border rounded-lg shadow-sm p-4 flex cursor-pointer focus:outline-none'
                )
              }
            >
              {({ checked, active }) => (
                <>
                  <div className="flex-1 flex">
                    <div className="flex flex-col">
                      <RadioGroup.Label as="span" className="block text-sm font-medium text-gray-900">
                        {option.title}
                      </RadioGroup.Label>
                      <RadioGroup.Description
                        as="span"
                        className="mt-1 flex items-center text-sm text-gray-500"
                      >
                        {option.description}
                      </RadioGroup.Description>
                      <RadioGroup.Description as="span" className="mt-6 text-sm font-medium text-gray-900">
                        {option.footer}
                      </RadioGroup.Description>
                    </div>
                  </div>
                  {checked ? <CheckCircleIcon className="h-5 w-5 text-gray-600" aria-hidden="true" /> : null}
                  <div
                    className={classNames(
                      active ? 'border' : 'border-2',
                      checked ? 'border-gray-500' : 'border-transparent',
                      'absolute -inset-px rounded-lg pointer-events-none'
                    )}
                    aria-hidden="true"
                  />
                </>
              )}
            </RadioGroup.Option>
          ))}
        </div>
      </RadioGroup>
    )
}