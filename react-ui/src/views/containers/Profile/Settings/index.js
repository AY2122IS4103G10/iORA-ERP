export const Settings = () => {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
      <div className="mt-4">
        <div className="mt-10 divide-y divide-gray-200 mx-3">
          <div className="space-y-1">
            <h3 className="text-lg leading-6 font-medium text-gray-900">
              Settings
            </h3>
            <p className="max-w-2xl text-sm text-gray-500">
              View your settings here!
            </p>
          </div>
          <div className="mt-6">
            <dl className="divide-y divide-gray-200">
              <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4">
                <dt className="text-sm font-medium text-gray-500">Setting 1</dt>
                <dd className="mt-1 flex text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <span className="flex-grow">Setting 1</span>
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </div>
    </div>
  );
};
