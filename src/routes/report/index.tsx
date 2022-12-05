import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { Link } from "react-router-dom";
import FilterPanel from "../../components/FilterPanel";
import { Checkbox, Select } from "../../components/Form";
import { ReportStatusBadge } from "../../components/Report";
import Table, {
  Pagination,
  TBody,
  THead,
  TRow,
  TSpan,
  usePagination,
} from "../../components/Table";
import { ProfilePhoto } from "../../components/User";
import { REPORT_TOPIC } from "../../constants/report";
import useAuth from "../../contexts/auth";
import { StaffLayout, Header, Main } from "../../components/Layout";
import { selectCustomers } from "../../redux/customers";
import { selectReports, selectReportsUpdateTime } from "../../redux/reports";
import { useAppSelector } from "../../redux/store";
import {
  Report,
  ReportStatus as ReportStatusType,
  ReportTopic,
} from "../../types/report";
import { timestampToString } from "../../utils/datetime";

type StatusFilter = "All" | ReportStatusType;
type TopicFilter = "All" | ReportTopic;
type Filters = {
  status: StatusFilter;
  topic: TopicFilter;
  isOnlyUnclaimed: boolean;
};
const defaultFilters: Filters = {
  status: "All",
  topic: "All",
  isOnlyUnclaimed: false,
};

// P - Reports' List
function ReportList() {
  // [States]
  const reports = useAppSelector(selectReports);
  const customers = useAppSelector(selectCustomers);
  const updateTime = useAppSelector(selectReportsUpdateTime);

  // [Hooks]
  const { user } = useAuth();

  // [Filters]
  const [filters, setFilters] = useState<Filters>(defaultFilters);
  const filtered_reports = reports.filter(
    (report) =>
      (filters.status === "All" ? true : report.status === filters.status) &&
      (filters.topic === "All" ? true : report.topic === filters.topic) &&
      (filters.isOnlyUnclaimed ? report.staff === null : true)
  );
  const claimed_reports = reports.filter(
    (report) => report.staff?.id === user?.email && report.status === "Open"
  );

  // [Pagination]
  const { currentPage, setPage, currentItems, itemsPerPage } =
    usePagination<Report>(filtered_reports);

  return (
    <StaffLayout
      title="Reports' List"
      select="Reports"
      isLoading={updateTime === "Updating..."}
    >
      <Main>
        <Header
          hideBack
          title={`Reports' List (${reports.length})`}
          subTitle={`Updated on: ${updateTime}`}
        />
        {claimed_reports.length > 0 && (
          <div className="mb-5">
            <Table>
              <th
                colSpan={6}
                className="text-sm text-gray-700 uppercase bg-gray-100 py-3 px-6 font-bold w-full"
              >
                On-Going Report
              </th>

              {claimed_reports.map((report, i) => {
                const customer = customers.find(
                  (customer) => customer.uid === report.customer?.id
                );
                return (
                  <TRow
                    key={i}
                    data={[
                      <ProfilePhoto
                        src={customer?.photoUrl}
                        size="sm"
                        lineThumbnail
                      />,
                      customer?.displayName,
                      <ReportStatusBadge status={report.status} />,
                      report.topic,
                      timestampToString(report.created_timestamp),
                      <Link to={`/report/${report.rid ? report.rid : ""}`}>
                        <PencilSquareIcon className="text-black w-8 h-8 p-1 rounded-md hover:bg-gray-300 hover:cursor-pointer" />
                      </Link>,
                    ]}
                    center
                  />
                );
              })}
            </Table>
          </div>
        )}
        <FilterPanel onClear={() => setFilters(defaultFilters)}>
          <Select
            name="status"
            placeholder="Status"
            value={filters.status}
            setForm={setFilters}
            options={["All", "Pending", "Open", "Closed"]}
            sidePlaceHolder
            noSpacer
          />
          <Select
            name="topic"
            placeholder="Topic"
            value={filters.topic}
            setForm={setFilters}
            options={["All", ...REPORT_TOPIC]}
            sidePlaceHolder
            noSpacer
          />
          <Checkbox
            name="isOnlyUnclaimed"
            checked={filters.isOnlyUnclaimed}
            placeholder="Only Unclaimed Reports"
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
              totalItems={reports.length}
            />
          }
        >
          <THead
            columns={[
              "Photo",
              "Customer",
              "Status",
              "Topic",
              "Created Timestamp",
              "Actions",
            ]}
          />
          <TBody>
            {currentItems.length > 0 ? (
              currentItems.map((report, i) => {
                const customer = customers.find(
                  (customer) => customer.uid === report.customer?.id
                );
                return (
                  <TRow
                    key={i}
                    data={[
                      <ProfilePhoto
                        src={customer?.photoUrl}
                        size="sm"
                        lineThumbnail
                      />,
                      customer?.displayName,
                      <ReportStatusBadge status={report.status} />,
                      report.topic,
                      timestampToString(report.created_timestamp),
                      <Link to={`/report/${report.rid ? report.rid : ""}`}>
                        <PencilSquareIcon className="text-black w-8 h-8 p-1 rounded-md hover:bg-gray-300 hover:cursor-pointer" />
                      </Link>,
                    ]}
                    center
                  />
                );
              })
            ) : (
              <TSpan colSpan={6} center>
                No reports.
              </TSpan>
            )}
          </TBody>
        </Table>
      </Main>
    </StaffLayout>
  );
}

export default ReportList;
