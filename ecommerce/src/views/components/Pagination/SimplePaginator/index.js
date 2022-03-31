import { classNames } from "../../../../../../ecommerce/src/utilities/Util";

export const SimplePaginator = ({
  itemsPerPage,
  totalItems,
  paginateFront,
  paginateBack,
  paginate,
  currentPage,
}) => {
  const pages = [];

  for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
    pages.push(i);
  }

  return (
    <nav
      aria-label="Pagination"
      className="max-w-7xl mx-auto px-4 mt-6 flex justify-between text-sm font-medium text-gray-700 sm:px-6 lg:px-8"
    >
      <div className="min-w-0 flex-1">
        {Boolean(pages.length) && currentPage !== pages[0] && (
          <button
            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-600 focus:ring-gray-600 focus:ring-opacity-25"
            onClick={paginateFront}
          >
            Previous
          </button>
        )}
      </div>
      <div className="hidden space-x-2 sm:flex">
        {/* Current: "border-gray-600 ring-1 ring-gray-600", Default: "border-gray-300" */}
        {pages.slice(0, 3).map((page, id) => (
          <button
            key={id}
            className={classNames(
              currentPage === page
                ? "border-gray-600 ring-1 ring-gray-600"
                : "border-gray-300",
              "inline-flex items-center px-4 h-10 border rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-600 focus:ring-gray-600 focus:ring-opacity-25"
            )}
            onClick={() => paginate(page)}
          >
            {page}
          </button>
        ))}
        {/* {pages.length > 6 && (
          <span className="inline-flex items-center text-gray-500 px-1.5 h-10">
            ...
          </span>
        )}
        {pages.length > 3 &&
          pages.slice(-3).map((page) => (
            <button
              className={classNames(
                currentPage === page
                  ? "border-gray-600 ring-1 ring-gray-600"
                  : "border-gray-300",
                "inline-flex items-center px-4 h-10 borderrounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-600 focus:ring-gray-600 focus:ring-opacity-25"
              )}
              onClick={paginate}
            >
              {page}
            </button>
          ))} */}
      </div>
      <div className="min-w-0 flex-1 flex justify-end">
        {Boolean(pages.length) && currentPage !== pages[pages.length - 1] && (
          <button
            className="inline-flex items-center px-4 h-10 border border-gray-300 rounded-md bg-white hover:bg-gray-100 focus:outline-none focus:border-gray-600 focus:ring-2 focus:ring-offset-1 focus:ring-offset-gray-600 focus:ring-gray-600 focus:ring-opacity-25"
            onClick={paginateBack}
          >
            Next
          </button>
        )}
      </div>
    </nav>
  );
};
