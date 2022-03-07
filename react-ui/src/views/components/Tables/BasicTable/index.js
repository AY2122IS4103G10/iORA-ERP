/**
 * Sources:
 * React Table Part 1: https://www.samuelliedtke.com/blog/react-table-tutorial-part-1/
 * React Table Part 2: https://www.samuelliedtke.com/blog/react-table-tutorial-part-2/
 */
import {
  useTable,
  useFlexLayout,
} from "react-table";

import { SortDownIcon, SortUpIcon, SortIcon } from "../Icons";


export const BasicTable = ({
  columns,
  data,
  flex = false,
  handleOnClick,
  hiddenColumns = [],
}) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
  } = useTable(
    {
      columns,
      data,
      initialState: {
        
        hiddenColumns: hiddenColumns,
      },
    },
    flex && useFlexLayout,
  );

  return (
    <>
      <div className="mt-4 flex flex-col">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table
                {...getTableProps()}
                className="min-w-full divide-y divide-gray-200"
              >
                <thead className="bg-gray-200">
                  {headerGroups.map((headerGroup) => (
                    <tr {...headerGroup.getHeaderGroupProps()}>
                      {headerGroup.headers.map((column) => (
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-900 uppercase tracking-wider"
                          {...column.getHeaderProps(
                            
                            {
                              style: {
                                maxWidth: column.maxWidth,
                                minWidth: column.minWidth,
                                width: column.width,
                              },
                            }
                          )}
                        >
                          <div className="flex items-center justify-between">
                            {column.render("Header")}
                            {/* Sort direction indicator */}
                            <span>
                              {column.isSorted ? (
                                column.isSortedDesc ? (
                                  <SortDownIcon className="w-4 h-4 text-gray-400" />
                                ) : (
                                  <SortUpIcon className="w-4 h-4 text-gray-400" />
                                )
                              ) : (
                                <SortIcon className="w-4 h-4 text-gray-400 opacity-0 group-hover:opacity-100" />
                              )}
                            </span>
                          </div>
                        </th>
                      ))}
                    </tr>
                  ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                  {page.map((row, i) => {
                    prepareRow(row);
                    return (
                      <tr
                        {...row.getRowProps()}
                        className={[
                          i % 2 === 0 ? "bg-white" : "bg-gray-50",
                          Boolean(handleOnClick) &&
                            "cursor-pointer hover:bg-gray-100",
                        ].join(" ")}
                        onClick={
                          Boolean(handleOnClick)
                            ? () => handleOnClick(row)
                            : undefined
                        }
                      >
                        {row.cells.map((cell) => (
                          <td
                            {...cell.getCellProps()}
                            className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900"
                          >
                            {cell.render("Cell")}
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
