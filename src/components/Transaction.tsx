import type { Transaction, TransactionStatus } from "../types/transaction";
import { timestampToString } from "../utils/datetime";
import { LicensePlate } from "./Car";
import { Size } from "../types/tailwind";
import Badge from "./Badge";
import {
  ArrowRightCircleIcon,
  ArrowRightIcon,
  ChevronDownIcon,
  ComputerDesktopIcon,
  ShareIcon,
} from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Button, Input, Select } from "./Form";
import Modal, { Body, Footer, handleModalFunction } from "./Modal";
import { useNavigate } from "react-router-dom";
import Loading from "./Loading";
import { ArchiveBoxXMarkIcon } from "@heroicons/react/24/solid";
import { cancelTransaction } from "../helpers/transaction";
import {
  CancelTransactionErrors,
  TransactionWithRef,
} from "../types/transaction";
import { handleFormError } from "../utils/error";
import { setExitGet } from "../helpers/setting";
import QRCode from "react-qr-code";

// C - Transaction card
type TransactionCardProps = {
  transaction: Transaction;
  noNavigate?: boolean;
  box?: boolean;
};
export function TransactionCard({
  transaction,
  noNavigate = false,
  box,
}: TransactionCardProps) {
  const navigate = useNavigate();

  return (
    transaction && (
      <div
        className={`w-full h-24 py-2 px-4 ${
          box ? "border shadow rounded-lg" : "border-b"
        } flex items-center gap-2 hover:bg-zinc-50 relative cursor-pointer`}
        onClick={() =>
          !noNavigate &&
          transaction.tid &&
          navigate(`/transaction/${transaction.tid}`)
        }
      >
        <div className="w-[70px] flex flex-col gap-2 items-center justify-center">
          <TransactionStatusBadge status={transaction.status} expand />
        </div>
        <div className="flex flex-col">
          <p>
            <span className="font-medium">Time-In:</span>{" "}
            {timestampToString(transaction.timestamp_in)}
          </p>
          {transaction.timestamp_out && (
            <p>
              <span className="font-medium">Time-Out:</span>{" "}
              {timestampToString(transaction.timestamp_out)}
            </p>
          )}

          <p>
            <span className="font-medium">Fee:</span> {transaction.fee}฿
          </p>
        </div>
        <div className="absolute top-0 right-0 bottom-0 flex opacity-20 lg:opacity-100 px-4 py-3 z-10">
          <LicensePlate license_number={transaction.license_number} />
        </div>
      </div>
    )
  );
}

// C - Transaction Status Badge
type TransactionStatusBadgeProps = {
  status: TransactionStatus;
  size?: Size;
  expand?: boolean;
};
export function TransactionStatusBadge({
  status,
  size = "sm",
  expand = false,
}: TransactionStatusBadgeProps) {
  return (
    <Badge
      size={size}
      color={status === "Paid" ? "green" : status === "Unpaid" ? "red" : "gray"}
      expand={expand}
    >
      {status ? status : "Process"}
    </Badge>
  );
}

// C - Transaction Select
type TransactionSelectProps = {
  transactions: Array<Transaction> | undefined;
  loading: boolean;
  name: string;
  placeholder: string;
  value: string | undefined;
  setForm: Dispatch<SetStateAction<any>>;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  setError?: Dispatch<SetStateAction<any>>;
};
export function TransactionSelect({
  transactions = [],
  loading,
  name = "",
  placeholder = "",
  value,
  setForm,
  required = false,
  disabled = false,
  error,
  setError,
}: TransactionSelectProps) {
  // [States]
  const [isShow, setShow] = useState<boolean>(false);
  const [allowClear, setAllowClear] = useState<boolean>(false);

  // [Data]
  const selectedIndex = transactions.findIndex(
    (transaction) => transaction.tid === value
  );

  // [Settings]
  const color = error ? "rose" : "gray";

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setShow);

  // F - On input change
  const handleOnChange = (tid: string | undefined) => {
    setError &&
      setError((errors: any) => ({ ...errors, [name]: "", form: "" }));

    setForm((f: any) => ({ ...f, [name]: tid ?? "" }));
    handleModal(false);
  };

  // F - Handle clear selected.
  const clearSelected = () => {
    if (!allowClear) return;
    setForm((f: any) => ({ ...f, [name]: undefined }));
    handleModal(false);
  };

  // [Effects]
  // E - Set allow clear when transaction loaded.
  useEffect(() => {
    if (!loading) setAllowClear(true);
  }, [loading]);

  // E - Clear when transaction not found.
  useEffect(() => {
    if (selectedIndex <= -1) clearSelected();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedIndex]);

  return (
    <div className="mb-4">
      <Modal title="Select Transaction" isShow={isShow} setShow={setShow}>
        <Body hFull>
          {transactions.map((transaction, i) => (
            <div key={i} onClick={() => handleOnChange(transaction.tid)}>
              <TransactionCard transaction={transaction} noNavigate />
            </div>
          ))}
        </Body>
        <Footer>
          <Button onClick={() => clearSelected()}>Clear</Button>
        </Footer>
      </Modal>
      <label className={`block mb-2 text-sm font-medium text-${color}-600`}>
        {placeholder} {required && <span className="text-rose-500">*</span>}
      </label>
      <div
        onClick={() => handleModal(true)}
        className={`flex justify-between items-center gap-2 ${
          selectedIndex > -1 ? "bg-white" : "bg-gray-50"
        } border border-${color}-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full min-h-[48px] md:min-h-[40px] p-2.5`}
      >
        {selectedIndex > -1 ? (
          <TransactionCard
            transaction={transactions[selectedIndex]}
            noNavigate
          />
        ) : (
          <p>Not selected</p>
        )}
        <ChevronDownIcon className="w-4 text-gray-500" />
      </div>
    </div>
  );
}

// C - Transaction Cancel Modal
type TransactionCancelModalProps = {
  transaction: TransactionWithRef | undefined;
};
export function TransactionCancelModal({
  transaction,
}: TransactionCancelModalProps) {
  const errorsState = { form: "" };

  // [States]
  const [isShowModal, setShowModal] = useState<boolean>(false);
  const [errors, setErrors] = useState<CancelTransactionErrors>(errorsState);
  const [isRequest, setRequest] = useState<boolean>(false);

  // [Hooks]
  const navigate = useNavigate();

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setShowModal, () =>
    setErrors(errorsState)
  );

  // F - Handle on cancel.
  const handleOnCancel = async () => {
    try {
      setRequest(true);
      if (transaction) {
        await cancelTransaction(transaction.tid);
        navigate("/transaction", { replace: true });
      }
    } catch (err: any) {
      handleFormError(err, Object.keys(errors), setErrors);
    } finally {
      setRequest(false);
    }
  };

  return transaction?.status === "Unpaid" ? (
    <>
      <Loading isLoading={isRequest} />
      <Modal
        title={`${errors.form && "Error on "}Cancel Transaction`}
        isShow={isShowModal}
        setShow={setShowModal}
        handleModal={handleModal}
      >
        <Body center>
          {errors.form ? (
            <>
              <p className="text-rose-500">{errors.form}</p>
              <p className="my-3 text-gray-500 italic">
                (TID: {transaction.tid})
              </p>
            </>
          ) : transaction.paid === 0 ? (
            <>
              <p>Are you sure to cancel this transaction?</p>
              <p className="my-3 text-gray-500 italic">
                (TID: {transaction.tid})
              </p>
              <p>
                Once you cancel the transaction, it will disabled edit mode on
                this transaction.
              </p>
            </>
          ) : (
            <p>
              Transaction cannot be canceled if payments are not reviewed or
              refunded.
            </p>
          )}
        </Body>
        <Footer>
          {errors.form ? (
            <Button onClick={handleModal}>Confirm</Button>
          ) : transaction.paid === 0 ? (
            <>
              <Button onClick={handleOnCancel}>Cancel Transaction</Button>
              <Button variant="outline" onClick={handleModal}>
                Keep Transaction
              </Button>
            </>
          ) : (
            <Button onClick={handleModal}>I'm understand</Button>
          )}
        </Footer>
      </Modal>
      <ArchiveBoxXMarkIcon
        className="w-10 h-10 p-1 rounded-md hover:bg-gray-200 hover:cursor-pointer"
        onClick={() => handleModal()}
      />
    </>
  ) : (
    <></>
  );
}

// C - Set Transaction Exit
export function SetTransactionExitModal({
  transaction,
}: {
  transaction: TransactionWithRef | undefined;
}) {
  // [States]
  const [error, setError] = useState<string>("");
  const [isRequest, setRequest] = useState<boolean>(false);
  const [isModalShow, setModalShow] = useState<boolean>(false);

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow, (isOpen) => {
    if (!isOpen) setError("");
  });

  // F - Handle on submit.
  const handleSetTransactionExit = async () => {
    try {
      setRequest(true);
      handleModal(false);
      if (transaction)
        await setExitGet(transaction.tid, transaction.license_number);
    } catch (err: any) {
      if (err.message) setError(err.message);
      else setError("Error occured.");
      handleModal(true);
    } finally {
      setRequest(false);
    }
  };

  return (
    <>
      <Loading isLoading={isRequest} />
      <Modal
        title={error ? "Error" : "Set Exit Transaction"}
        isShow={isModalShow}
        setShow={setModalShow}
        maxSize="md"
      >
        <Body center>
          {error ? (
            <p>{error}</p>
          ) : (
            <p>
              Are you sure to show "{transaction?.license_number}" on the exit?
            </p>
          )}

          <p className="text-gray-500">TID: {transaction?.tid}</p>
        </Body>
        <Footer>
          <Button onClick={handleSetTransactionExit}>Confirm</Button>
          <Button variant="outline" onClick={() => handleModal(false)}>
            Cancel
          </Button>
        </Footer>
      </Modal>

      <ComputerDesktopIcon
        className="w-10 h-10 p-1 hover:bg-gray-300 rounded-md hover:cursor-pointer"
        onClick={() => handleModal()}
      />
    </>
  );
}

// C - Share Transaction
type ShareOption = {
  type: "Transaction" | "Payment";
  app: "Customer" | "Staff";
};
export function ShareTransaction({ tid }: { tid?: string }) {
  const CUSTOMER_URI = import.meta.env.VITE_LIFF_URI;
  const STAFF_URI = import.meta.env.VITE_STAFF_URI;

  // [States]
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [form, setForm] = useState<ShareOption>({
    type: "Payment",
    app: "Customer",
  });

  const LINK = `${form.app === "Customer" ? CUSTOMER_URI : STAFF_URI}/${
    form.app === "Customer" && form.type === "Payment"
      ? "payment"
      : "transaction"
  }/${tid}`;

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow);

  return (
    <>
      <ShareIcon
        className="w-10 h-10 p-1 hover:bg-gray-300 rounded-md hover:cursor-pointer"
        onClick={() => handleModal()}
      />
      <Modal
        title="Share"
        isShow={isModalShow}
        setShow={setModalShow}
        maxSize="md"
      >
        <Body>
          <div className="bg-white p-2 w-[65%] rounded-lg h-auto aspect-square flex justify-center items-center mx-auto shadow-md border relative mb-5">
            <QRCode
              value={LINK}
              size={256}
              style={{
                height: "auto",
                maxWidth: "100%",
                width: "100%",
              }}
              viewBox={`0 0 256 256`}
            />
          </div>
          <Button onClick={() => navigator.clipboard.writeText(LINK)}>
            Copy to Clipboard
          </Button>
          <div className="w-full"></div>
        </Body>
        <Footer>
          <div className="w-full flex flex-col gap-2">
            {form.app === "Customer" && (
              <Select
                name="type"
                placeholder="Type"
                value={form.type}
                setForm={setForm}
                options={["Payment", "Transaction"]}
                noSpacer
              />
            )}

            <Select
              name="app"
              placeholder="App"
              value={form.app}
              setForm={setForm}
              options={["Customer", "Staff"]}
              noSpacer
            />
          </div>
        </Footer>
      </Modal>
    </>
  );
}

// C - TID Input
export function TIDInput() {
  const navigate = useNavigate();
  const [form, setForm] = useState<{ input: string }>({ input: "" });
  return (
    <div className="flex items-center">
      <Input
        name="input"
        placeholder="TID"
        value={form.input}
        setForm={setForm}
        sidePlaceHolder
        noSpacer
      />
      <ArrowRightIcon
        className="w-10 h-10 px-2 py-1 hover:bg-gray-300 rounded-md hover:cursor-pointer border border-gray-300 bg-gray-50"
        onClick={() => form.input && navigate(`/transaction/${form.input}`)}
      />
    </div>
  );
}
