import React from 'react';
import { useTable, useSortBy, usePagination, Column } from 'react-table';
import { ArrowUp, ArrowDown, Download } from 'lucide-react';
import { CSVLink } from 'react-csv';

interface DataTableProps {
  columns: Column[];
  data: any[];
  title: string;
}

export const DataTable: React.FC<DataTableProps> = ({ columns, data, title }) => {
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    canPreviousPage,
    canNextPage,
    pageOptions,
    pageCount,
    gotoPage,
    nextPage,
    previousPage,
    setPageSize,
    state: { pageIndex, pageSize },
  } = useTable(
    {
      columns,
      data,
      initialState: { pageIndex: 0, pageSize: 10 },
    },
    useSortBy,
    usePagination
  );

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="flex justify-between items-center p-4 border-b">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        
        <div className="flex space-x-2">
          <CSVLink
            data={data}
            filename={`${title.toLowerCase().replace(/\s+/g, '-')}.csv`}
            className="inline-flex items-center px-3 py-1.5 border border-green-700 text-green-700 rounded-md text-sm font-medium hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
          >
            <Download size={16} className="mr-1" />
            Export CSV
          </CSVLink>
        </div>
      </div>
      
      <div className="overflow-x-auto">
        <table {...getTableProps()} className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            {headerGroups.map(headerGroup => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map(column => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    <div className="flex items-center">
                      {column.render('Header')}
                      <span className="ml-1">
                        {column.isSorted ? (
                          column.isSortedDesc ? (
                            <ArrowDown size={14} />
                          ) : (
                            <ArrowUp size={14} />
                          )
                        ) : (
                          ''
                        )}
                      </span>
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()} className="bg-white divide-y divide-gray-200">
            {page.map(row => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="hover:bg-gray-50">
                  {row.cells.map(cell => (
                    <td
                      {...cell.getCellProps()}
                      className="px-6 py-4 whitespace-nowrap text-sm text-gray-500"
                    >
                      {cell.render('Cell')}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      <div className="px-4 py-3 border-t border-gray-200 flex items-center justify-between">
        <div className="flex-1 flex justify-between sm:hidden">
          <button
            onClick={() => previousPage()}
            disabled={!canPreviousPage}
            className={`relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !canPreviousPage
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Previous
          </button>
          <button
            onClick={() => nextPage()}
            disabled={!canNextPage}
            className={`ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md ${
              !canNextPage
                ? 'bg-gray-100 text-gray-400'
                : 'bg-white text-gray-700 hover:bg-gray-50'
            }`}
          >
            Next
          </button>
        </div>
        <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing <span className="font-medium">{pageIndex * pageSize + 1}</span> to{' '}
              <span className="font-medium">
                {Math.min((pageIndex + 1) * pageSize, data.length)}
              </span>{' '}
              of <span className="font-medium">{data.length}</span> results
            </p>
          </div>
          <div>
            <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button
                onClick={() => previousPage()}
                disabled={!canPreviousPage}
                className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 text-sm font-medium ${
                  !canPreviousPage
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              <span className="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700">
                Page{' '}
                <span className="font-medium mx-1">{pageIndex + 1}</span> of{' '}
                <span className="font-medium mx-1">{pageOptions.length}</span>
              </span>
              
              <button
                onClick={() => nextPage()}
                disabled={!canNextPage}
                className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 text-sm font-medium ${
                  !canNextPage
                    ? 'bg-gray-100 text-gray-400'
                    : 'bg-white text-gray-500 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};