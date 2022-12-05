import { Dispatch, ReactNode, SetStateAction, useState } from "react";

// C - Table
type TableProps = {
  children?: ReactNode;
  pagination?: ReactNode;
};
export default function Table({ children, pagination }: TableProps) {
  return (
    <>
      <div className="overflow-auto w-full relative shadow-md sm:rounded-lg">
        <table className="w-full text-base text-left text-gray-500">
          {children}
        </table>
      </div>
      {pagination}
    </>
  );
}

// C - Table header
type THeadProps = {
  columns: Array<string>;
  isSelectAll?: boolean;
  onSelectAll?: () => void;
};
export function THead({
  columns,
  isSelectAll = false,
  onSelectAll,
}: THeadProps) {
  return (
    <thead className="text-sm text-center text-gray-700 uppercase bg-gray-100">
      <tr>
        {onSelectAll && (
          <th scope="col" className="p-4">
            <div className="flex items-center">
              <input
                type="checkbox"
                className="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 focus:ring-2"
                checked={isSelectAll}
                onClick={onSelectAll}
              />
              <label className="sr-only">checkbox</label>
            </div>
          </th>
        )}
        {columns.map((attribute) => (
          <th key={attribute} scope="col" className="py-3 px-6">
            {attribute}
          </th>
        ))}
      </tr>
    </thead>
  );
}

// C - Table body
type TBodyProps = { children?: ReactNode };
export function TBody({ children }: TBodyProps) {
  return <tbody>{children}</tbody>;
}

// C - Table row.
type TRowProps = {
  data: Array<ReactNode>;
  center?: boolean;
};
export function TRow({ data, center }: TRowProps) {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      {data.map((value, i) => (
        <td className={`py-4 px-6`} key={i}>
          <div className={`w-fit ${center && "mx-auto"}`}>
            {value ? value : "-"}
          </div>
        </td>
      ))}
    </tr>
  );
}

// C - Table span.
type TSpanProps = {
  children?: ReactNode;
  colSpan: number;
  center?: boolean;
};
export function TSpan({ children, colSpan = 1, center }: TSpanProps) {
  return (
    <tr className="bg-white border-b hover:bg-gray-50">
      <td className={`py-4 px-6`} colSpan={colSpan}>
        <div className={`w-fit ${center && "mx-auto"}`}>{children}</div>
      </td>
    </tr>
  );
}

// C - Table pair
type TPairProps = { header: string; value: any };
export function TPair({ header, value }: TPairProps) {
  return (
    <tr>
      <th className="text-sm text-center text-gray-700 uppercase bg-gray-100 py-2 px-6">
        {header}
      </th>
      <td className="bg-white py-2 px-6 flex items-center justify-center">
        {value}
      </td>
    </tr>
  );
}

// C - Table pagination.
// [Functions]
// F - Pagination hooks.
interface UsePaginationProps<T> {
  currentItems: Array<T>;
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
}
export function usePagination<T>(
  items: Array<T>,
  itemsPerPage: number = 10
): UsePaginationProps<T> {
  const [currentPage, setPage] = useState<number>(1);
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = items.slice(indexOfFirstItem, indexOfLastItem);

  return { currentPage, setPage, currentItems, itemsPerPage };
}
type PaginationProps = {
  currentPage: number;
  setPage: Dispatch<SetStateAction<number>>;
  itemsPerPage: number;
  totalItems: number;
};
export function Pagination({
  currentPage,
  setPage,
  itemsPerPage,
  totalItems,
}: PaginationProps) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  const startPages = 3;
  const endPages = totalPages - 3;
  const pageNumbers = [] as Array<number>;
  for (let i = 1; i <= totalPages; i++) {
    if (i <= startPages || i >= endPages) pageNumbers.push(i);
    else if (!pageNumbers.includes(-1)) pageNumbers.push(-1);

    if (!pageNumbers.includes(i) && i === currentPage) {
      pageNumbers.push(i);
      pageNumbers.push(-1);
    }
  }

  const handleChangePage = (page: number) => {
    if (page >= 1 && page <= totalPages) setPage(page);
  };

  return (
    <nav
      className="flex justify-between items-center px-4 py-2 mt-2"
      aria-label="Table navigation"
    >
      <span className="text-sm font-normal text-gray-500">
        Page <span className="font-semibold text-gray-900">{currentPage}</span>{" "}
        of{" "}
        <span className="font-semibold text-gray-900">
          {totalPages === 0 ? 1 : totalPages}
        </span>{" "}
        ({itemsPerPage} {itemsPerPage > 1 ? "items" : "item"} per page)
      </span>
      <ul className="inline-flex items-center -space-x-px">
        <li onClick={() => handleChangePage(currentPage - 1)}>
          <p className="h-10 flex items-center px-2 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            <span className="sr-only">Previous</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </p>
        </li>
        {pageNumbers.map((page, index) => (
          <li
            key={index}
            onClick={page !== -1 ? () => handleChangePage(index + 1) : () => {}}
          >
            <p
              className={
                page === currentPage
                  ? "h-10 flex items-center z-10 px-3 leading-tight text-rose-600 bg-rose-50 border border-rose-300 hover:bg-rose-100 hover:text-rose-700"
                  : "h-10 flex items-center z-10 px-3 leading-tight text-gray-500 bg-white border border-gray-300 hover:bg-gray-100 hover:text-gray-700"
              }
            >
              {page === -1 ? "..." : page}
            </p>
          </li>
        ))}
        <li onClick={() => handleChangePage(currentPage + 1)}>
          <p className="h-10 flex items-center px-2 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700">
            <span className="sr-only">Next</span>
            <svg
              className="w-5 h-5"
              aria-hidden="true"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              ></path>
            </svg>
          </p>
        </li>
      </ul>
    </nav>
  );
}
