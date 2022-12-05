import { useNavigate, useParams } from "react-router-dom";
import { StaffLayout, Header, Main, Panel } from "../../../components/Layout";
import { timestampToInput, timestampToString } from "../../../utils/datetime";
import {
  EditTransactionErrors,
  EditTransactionForm,
} from "../../../types/transaction";
import ImageViewer from "../../../components/ImageViewer";
import {
  PaymentStatusBadge,
  PaymentPreview,
} from "../../../components/Payment";
import Table, {
  TPair,
  THead,
  TBody,
  TRow,
  TSpan,
} from "../../../components/Table";
import {
  TransactionStatusBadge,
  TransactionCancelModal,
} from "../../../components/Transaction";
import { Form, Input, TextArea, FileInput } from "../../../components/Form";
import { useEffect, useState } from "react";
import { useUpdateFilePreview } from "../../../utils/hooks";
import {
  editTransaction,
  useGetTransaction,
} from "../../../helpers/transaction";
import { FormError, handleFormError } from "../../../utils/error";
import Feedback from "../../../components/Feedback";
import { useAppSelector } from "../../../redux/store";
import { selectCustomers } from "../../../redux/customers";

// [Default States]
const formState = {
  license_number: "",
  timestamp_in: "",
  timestamp_out: "",
  image_in: null,
  image_out: null,
  remark: "",
};

const errorsState = {
  license_number: "",
  timestamp_in: "",
  timestamp_out: "",
  image_in: "",
  image_out: "",
  remark: "",
  form: "",
};

// P - Edit transaction.
function EditTransaction() {
  // [States]
  const customers = useAppSelector(selectCustomers);
  const [form, setForm] = useState<EditTransactionForm>(formState);
  const [errors, setErrors] = useState<EditTransactionErrors>(errorsState);
  const [imageInPreview, setImageInPreview] = useState<string>("");
  const [imageOutPreview, setImageOutPreview] = useState<string>("");
  const [isRequest, setIsRequest] = useState<boolean>(true);

  // [Hooks]
  const { tid } = useParams();
  const navigate = useNavigate();
  const { transaction, updateTime } = useGetTransaction(tid as string, "Staff");
  useUpdateFilePreview(form.image_in, setImageInPreview);
  useUpdateFilePreview(form.image_out, setImageOutPreview);

  // [Effects]
  // E - Set transaction into form.
  useEffect(() => {
    if (typeof transaction?.tid === "string") {
      setIsRequest(false);
      setForm((f) => {
        return {
          ...f,
          license_number: transaction.license_number,
          timestamp_in: timestampToInput(transaction.timestamp_in),
          timestamp_out: timestampToInput(transaction.timestamp_out),
          remark: transaction.remark ? transaction.remark : "",
        };
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transaction?.tid]);

  // [Functions]
  // F - On submit.
  const handleOnSubmit = async () => {
    try {
      setIsRequest(true);
      if (transaction) {
        await editTransaction(form, transaction);
        navigate(-1);
      } else {
        throw new FormError({ form: "Cannot detect transaction." });
      }
    } catch (err) {
      handleFormError(err, Object.keys(errors), setErrors);
    } finally {
      setIsRequest(false);
    }
  };

  return (
    <StaffLayout
      select="Transactions"
      title="Edit Transaction"
      isLoading={
        updateTime === "Updating..." || isRequest || transaction?.is_edit
      }
    >
      <Main>
        <Header
          title="Edit Transaction"
          subTitle={`TID: ${tid}`}
          btns={<TransactionCancelModal transaction={transaction} />}
        />

        {transaction ? (
          transaction.is_cancel ? (
            <Feedback
              header="Cancelled Transaction."
              message="Cannot edit a transaction that been cancelled."
              type="Error"
            />
          ) : (
            <div className="w-full flex flex-col gap-3 lg:flex-row justify-between lg:gap-5">
              <div className="flex flex-col gap-3 flex-1">
                <div className="flex gap-5">
                  <Panel header="Image-In">
                    <ImageViewer
                      title="Image In"
                      src={
                        imageInPreview ? imageInPreview : transaction.image_in
                      }
                    />
                  </Panel>
                  <Panel header="Image-Out">
                    <ImageViewer
                      title="Image Out"
                      src={
                        imageOutPreview
                          ? imageOutPreview
                          : transaction.image_out
                      }
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
                        header="Add by"
                        value={transaction.add_by ? "Staff" : "System"}
                      />
                    </TBody>
                  </Table>
                </Panel>
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
                        transaction.payments?.map((payment, i) => (
                          <TRow
                            key={i}
                            center
                            data={[
                              <PaymentStatusBadge status={payment.status} />,
                              payment.amount ? `${payment.amount} ฿` : "-",
                              timestampToString(payment.timestamp),
                              payment.paid_by
                                ? customers.find(
                                    (customer) =>
                                      customer.uid === payment.paid_by?.id
                                  )?.displayName ?? "-"
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
              <div className="flex-1">
                <Panel header="Form">
                  <Form placeholder="Edit" onSubmit={handleOnSubmit}>
                    <Input
                      name="license_number"
                      placeholder="License number"
                      value={form.license_number}
                      setForm={setForm}
                      error={errors.license_number}
                      setError={setErrors}
                      required
                    />
                    <Input
                      name="timestamp_in"
                      placeholder="Timestamp-In"
                      value={form.timestamp_in}
                      type="datetime-local"
                      setForm={setForm}
                      error={errors.timestamp_in}
                      setError={setErrors}
                      required
                    />
                    <Input
                      name="timestamp_out"
                      placeholder="Timestamp-Out"
                      value={form.timestamp_out}
                      type="datetime-local"
                      setForm={setForm}
                      error={errors.timestamp_out}
                      setError={setErrors}
                      disabled={transaction.status !== "Paid"}
                    />
                    <FileInput
                      name="image_in"
                      placeholder="Image-In"
                      setForm={setForm}
                      limitMB={5}
                      error={errors.image_in}
                      setError={setErrors}
                    />
                    <FileInput
                      name="image_out"
                      placeholder="Image-Out"
                      setForm={setForm}
                      limitMB={5}
                      disabled={transaction.status !== "Paid"}
                      error={errors.image_out}
                      setError={setErrors}
                    />
                    <TextArea
                      name="remark"
                      placeholder="Remark"
                      value={form.remark}
                      setForm={setForm}
                      error={errors.remark}
                      setError={setErrors}
                    />
                  </Form>
                </Panel>
              </div>
            </div>
          )
        ) : (
          <Feedback
            header="Transaction not found."
            message={`Transaction with tid "${tid}" is not found.`}
            type="Error"
          />
        )}
      </Main>
    </StaffLayout>
  );
}

export default EditTransaction;
