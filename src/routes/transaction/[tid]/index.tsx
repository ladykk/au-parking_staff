import { Link, useParams } from "react-router-dom";
import { LicensePlate } from "../../../components/Car";
import ImageViewer from "../../../components/ImageViewer";
import Table, {
  TBody,
  THead,
  TPair,
  TRow,
  TSpan,
} from "../../../components/Table";
import { StaffLayout, Header, Main, Panel } from "../../../components/Layout";
import { timestampToString } from "../../../utils/datetime";
import {
  SetTransactionExitModal,
  ShareTransaction,
  TransactionStatusBadge,
} from "../../../components/Transaction";
import {
  PaymentStatusBadge,
  PaymentPreview,
} from "../../../components/Payment";
import { PencilSquareIcon } from "@heroicons/react/24/solid";
import { TextArea } from "../../../components/Form";
import Feedback from "../../../components/Feedback";
import { useGetTransaction } from "../../../helpers/transaction";
import { useAppSelector } from "../../../redux/store";
import { selectCustomers } from "../../../redux/customers";
import { selectStaffs } from "../../../redux/staffs";

// P - Transaction detail
function TransactionDetail() {
  // [States]
  const customers = useAppSelector(selectCustomers);
  const staffs = useAppSelector(selectStaffs);
  // [Hooks]
  const { tid } = useParams();
  const { transaction, updateTime } = useGetTransaction(tid as string, "Staff");

  // [Data]
  const staff = staffs.find((staff) => staff.email === transaction?.add_by?.id);

  return (
    <StaffLayout
      select="Transactions"
      title={"Transaction Detail"}
      isLoading={updateTime === "Updating..." || transaction?.is_edit}
    >
      <Main>
        <Header
          title="Transaction's Detail"
          subTitle={`Updated on: ${updateTime}`}
          btns={[
            <SetTransactionExitModal transaction={transaction} />,
            <ShareTransaction tid={transaction?.tid} />,
            transaction && transaction.status !== "Cancel" && (
              <Link to={`/transaction/${tid ? `${tid}/edit` : ""}`}>
                <PencilSquareIcon className="w-10 h-10 p-1 rounded-md hover:bg-gray-200 hover:cursor-pointer" />
              </Link>
            ),
          ]}
        />

        <div className="w-full flex flex-col gap-3 lg:flex-row justify-between lg:gap-5">
          {transaction ? (
            <>
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex gap-5">
                  <Panel header="Image-In">
                    <ImageViewer title="Image In" src={transaction.image_in} />
                  </Panel>
                  <Panel header="Image-Out">
                    <ImageViewer
                      title="Image Out"
                      src={transaction.image_out}
                    />
                  </Panel>
                </div>
                <Panel header="Info">
                  <Table>
                    <TBody>
                      <TPair header="TID" value={transaction.tid} />
                      <TPair
                        header="Status"
                        value={
                          <TransactionStatusBadge status={transaction.status} />
                        }
                      />
                      <TPair
                        header="License Number"
                        value={
                          <LicensePlate
                            license_number={transaction.license_number}
                          />
                        }
                      />
                      <TPair
                        header="Timestamp-In"
                        value={timestampToString(transaction.timestamp_in)}
                      />
                      <TPair
                        header="Timestamp-Out"
                        value={timestampToString(transaction.timestamp_out)}
                      />
                      <TPair
                        header="Add by"
                        value={
                          staff ? (
                            <Link
                              to={`/staff/${staff.email}`}
                              className="underline"
                            >
                              {staff.displayName}
                            </Link>
                          ) : (
                            "System"
                          )
                        }
                      />
                    </TBody>
                  </Table>
                </Panel>
              </div>
              <div className="flex-1">
                {transaction.remark && (
                  <Panel header="Remark">
                    <TextArea
                      name=""
                      placeholder=""
                      value={transaction.remark}
                      setForm={() => {}}
                    />
                  </Panel>
                )}
                <Panel header="Payment">
                  <Table>
                    <TBody>
                      <TPair header="Fee" value={`${transaction.fee} ฿`} />
                      <TPair
                        header="Paid"
                        value={
                          transaction.paid
                            ? `${transaction.paid} ฿`
                            : "Not been paid."
                        }
                      />
                    </TBody>
                  </Table>
                  <Table>
                    <THead
                      columns={[
                        "Status",
                        "Amount",
                        "Timestamp",
                        "Payer",
                        "Slip",
                      ]}
                    />
                    <TBody>
                      {transaction.payments &&
                      transaction.payments.length > 0 ? (
                        transaction.payments.map((payment, i) => (
                          <TRow
                            key={i}
                            center
                            data={[
                              <PaymentStatusBadge status={payment.status} />,
                              payment.amount
                                ? `${payment.amount.toFixed(2)} ฿`
                                : "-",
                              timestampToString(payment.timestamp),
                              payment.paid_by
                                ? (() => {
                                    const customer = customers.find(
                                      (customer) =>
                                        customer.uid === payment.paid_by?.id
                                    );
                                    return customer ? (
                                      <Link
                                        to={`/customer/${customer.uid}`}
                                        className="underline"
                                      >
                                        {customer.displayName}
                                      </Link>
                                    ) : (
                                      "-"
                                    );
                                  })()
                                : "-",
                              <PaymentPreview payment={payment} />,
                            ]}
                          />
                        ))
                      ) : (
                        <TSpan colSpan={5} center>
                          No payments
                        </TSpan>
                      )}
                    </TBody>
                  </Table>
                </Panel>
              </div>
            </>
          ) : (
            <Feedback
              header="Transaction not found."
              message={`Transaction with tid "${tid}" is not found.`}
              type="Error"
            />
          )}
        </div>
      </Main>
    </StaffLayout>
  );
}

export default TransactionDetail;
