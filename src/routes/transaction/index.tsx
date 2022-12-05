import { PencilSquareIcon, PlusCircleIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import { LicensePlate } from "../../components/Car";
import FilterPanel from "../../components/FilterPanel";
import { Checkbox, Select } from "../../components/Form";
import Table, {
  Pagination,
  TBody,
  THead,
  TRow,
  TSpan,
  usePagination,
} from "../../components/Table";
import { TransactionStatusBadge } from "../../components/Transaction";
import { StaffLayout, Header, Main } from "../../components/Layout";
import {
  selectTransactions,
  selectTransactionsUpdateTime,
} from "../../redux/transactions";
import { useAppSelector } from "../../redux/store";
import { TransactionWithRef } from "../../types/transaction";
import { timestampToString } from "../../utils/datetime";

type StatusFilter = "All" | "Paid" | "Unpaid" | "Cancel";
type Filters = {
  status: StatusFilter;
  isOnlyInSystem: boolean;
};
const defaultFilters: Filters = {
  status: "All",
  isOnlyInSystem: false,
};

// P - Transaction list
function TransactionList() {
  // [States]
  const transactions = useAppSelector(selectTransactions);
  const updateTime = useAppSelector(selectTransactionsUpdateTime);

  // [Filters]
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const filtered_transactions = transactions.filter(
    (transaction) =>
      (filters.status === "All"
        ? true
        : transaction.status === filters.status) &&
      (filters.isOnlyInSystem ? transaction.timestamp_out === null : true)
  );

  // [Pagination]
  const { currentPage, setPage, currentItems, itemsPerPage } =
    usePagination<TransactionWithRef>(filtered_transactions);

  return (
    <StaffLayout
      title="Transactions' List"
      select="Transactions"
      isLoading={updateTime === "Updating..."}
    >
      <Main>
        <Header
          hideBack
          title={`Transactions' List (${transactions.length})`}
          subTitle={`Updated on: ${updateTime}`}
          btns={
            <Link to="/transaction/add">
              <PlusCircleIcon className="w-10 h-10 p-1 hover:bg-gray-300 rounded-md" />
            </Link>
          }
        />
        <FilterPanel onClear={() => setFilters(defaultFilters)}>
          <Select
            name="status"
            placeholder="Status"
            value={filters.status}
            setForm={setFilters}
            options={["All", "Paid", "Unpaid", "Cancel"]}
            sidePlaceHolder
            noSpacer
          />
          <Checkbox
            name="isOnlyInSystem"
            checked={filters.isOnlyInSystem}
            placeholder="Only In-System Transactions"
            setForm={setFilters}
            noSpacer
          />
        </FilterPanel>
        <Table
          pagination={
            <Pagination
              currentPage={currentPage}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              totalItems={transactions.length}
            />
          }
        >
          <THead
            columns={[
              "License number",
              "Status",
              "Timestamp-in",
              "Timestamp-out",
              "Fee",
              "Actions",
            ]}
          />
          <TBody>
            {currentItems.length > 0 ? (
              currentItems.map((transaction, i) => (
                <TRow
                  key={i}
                  center
                  data={[
                    <LicensePlate
                      license_number={transaction.license_number}
                    />,
                    <TransactionStatusBadge status={transaction.status} />,
                    timestampToString(transaction.timestamp_in),
                    transaction.timestamp_out
                      ? timestampToString(transaction.timestamp_out)
                      : undefined,
                    transaction.fee ? `${transaction.fee.toFixed(2)} ฿` : "-",
                    <Link
                      to={`/transaction/${
                        transaction.tid ? transaction.tid : ""
                      }`}
                    >
                      <PencilSquareIcon className="text-black w-8 h-8 p-1 rounded-md hover:bg-gray-300 hover:cursor-pointer" />
                    </Link>,
                  ]}
                />
              ))
            ) : (
              <TSpan colSpan={6} center>
                No Transaction
              </TSpan>
            )}
          </TBody>
        </Table>
      </Main>
    </StaffLayout>
  );
}

export default TransactionList;
