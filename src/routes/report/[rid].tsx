import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Form, TextArea } from "../../components/Form";
import { ReportChat, ClaimReportModal } from "../../components/Report";
import { ReportStatusBadge } from "../../components/Report";
import Feedback from "../../components/Feedback";
import Table, { TBody, TPair } from "../../components/Table";
import { TransactionCard } from "../../components/Transaction";
import { UserCard } from "../../components/User";
import { closeReport, useGetReport } from "../../helpers/report";
import { StaffLayout, Header, Main, Panel } from "../../components/Layout";
import { selectCustomers } from "../../redux/customers";
import { selectStaffs } from "../../redux/staffs";
import { selectTransactions } from "../../redux/transactions";
import { useAppSelector } from "../../redux/store";
import { timestampToString } from "../../utils/datetime";
import { handleFormError } from "../../utils/error";

const formState = { response: "" };
const errorsState = { response: "", form: "" };

export function ReportDetail() {
  // [States]
  const transactions = useAppSelector(selectTransactions);
  const customers = useAppSelector(selectCustomers);
  const staffs = useAppSelector(selectStaffs);
  const [form, setForm] = useState<{ response: string }>(formState);
  const [errors, setErrors] = useState<{ response: string; form: string }>(
    errorsState
  );
  const [isRequest, setRequest] = useState<boolean>(false);

  // [Hooks]
  const { rid } = useParams();
  const { report, chats, updateTime } = useGetReport(rid as string, "Staff");

  // [Data]
  const transaction = transactions.find(
    (transaction) => transaction.tid === report?.t_ref?.id
  );
  const customer = customers.find(
    (customer) => customer.uid === report?.customer?.id
  );
  const staff = staffs.find((staff) => staff.email === report?.staff?.id);

  // [Functions]
  // F - Handle on closed.
  const handleOnClose = async () => {
    try {
      setRequest(true);
      if (report) await closeReport(report, form.response);
    } catch (err: any) {
      handleFormError(err, Object.keys(errors), setErrors);
    } finally {
      setRequest(false);
    }
  };

  return (
    <StaffLayout
      title="Report's Info"
      select="Reports"
      isLoading={updateTime === "Updating..." || report?.is_edit || isRequest}
    >
      <Main>
        <Header
          title="Report's Info"
          subTitle={`Updated on: ${updateTime}`}
          btns={[
            <ReportChat report={report} chats={chats} />,
            <ClaimReportModal report={report} />,
          ]}
        />
        <div className="w-full h-[70vh] flex flex-col gap-3 md:flex-row justify-between lg:gap-5">
          {report ? (
            <>
              <div className="flex flex-col gap-2 flex-1">
                <Panel header="Info">
                  <Table>
                    <TBody>
                      <TPair header="RID" value={report.rid} />
                      <TPair
                        header="Status"
                        value={<ReportStatusBadge status={report.status} />}
                      />
                      <TPair header="Topic" value={report.topic} />
                      <TPair
                        header="Created Timestamp"
                        value={timestampToString(report.created_timestamp)}
                      />
                    </TBody>
                  </Table>
                  <Panel header="Description">
                    <p className="text-justify px-4 py-2 border rounded-lg shadow">
                      {report.description}
                    </p>
                  </Panel>
                </Panel>
                {transaction && (
                  <Panel header="Referenced Transaction">
                    <TransactionCard transaction={transaction} box />
                  </Panel>
                )}
              </div>
              <div className="flex flex-col gap-2 flex-1">
                <div className="flex flex-col lg:gap-5 lg:flex-row">
                  {customer && (
                    <Panel header="Customer">
                      <UserCard
                        id={customer.uid}
                        displayName={customer.displayName}
                        photoUrl={customer.photoUrl}
                        type="Customer"
                      />
                    </Panel>
                  )}
                  {staff && (
                    <Panel header="Staff">
                      <UserCard
                        id={staff.email}
                        displayName={staff.displayName}
                        photoUrl={staff.photoUrl}
                        type="Staff"
                      />
                    </Panel>
                  )}
                </div>
                {report.status === "Open" && (
                  <Panel header="Form">
                    <Form placeholder="Close Report" onSubmit={handleOnClose}>
                      <TextArea
                        name="response"
                        placeholder="Response"
                        value={form.response}
                        setForm={setForm}
                        error={errors.response}
                        setError={setErrors}
                        required
                      />
                    </Form>
                  </Panel>
                )}
                {report.status === "Closed" &&
                  report.closed_timestamp &&
                  report.response && (
                    <Panel header="Result">
                      <Table>
                        <TBody>
                          <TPair
                            header="Closed Timestamp"
                            value={timestampToString(report.closed_timestamp)}
                          />
                        </TBody>
                      </Table>
                      <Panel header="Description">
                        <p className="text-justify px-4 py-2 border rounded-lg shadow">
                          {report.response}
                        </p>
                      </Panel>
                    </Panel>
                  )}
              </div>
            </>
          ) : (
            <Feedback
              header="Report not found."
              message={`Report with rid "${rid}" is not found.`}
              type="Error"
            />
          )}
        </div>
      </Main>
    </StaffLayout>
  );
}

export default ReportDetail;
