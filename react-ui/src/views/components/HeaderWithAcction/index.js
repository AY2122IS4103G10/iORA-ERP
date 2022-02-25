export const HeaderWithAction = ({ title, name }) => {
  return (
    <div className="bg-white shadow">
      <div className="px-4 sm:px-6 lg:max-w-6xl lg:mx-auto lg:px-8">
        <div className="py-6 md:flex md:items-center md:justify-between lg:border-t lg:border-gray-300">
          <div className="flex-1 min-w-0">
            <div>
              <div class="row" className="flex item-left">
                <h1 className="text-2xl font-bold leading-8 text-gray-900 sm:leading-9 sm:truncate flex items-left ">
                  {title}
                </h1>
                <button
                  type="button"
                  class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  {name}
                  <a href="#"></a>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
