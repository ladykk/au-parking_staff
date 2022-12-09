import type { Payment, PaymentStatus, PaymentWithRef } from "../types/payment";
import { timestampToString } from "../utils/datetime";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Modal, { Body, Footer, handleModalFunction } from "./Modal";
import { Size } from "../types/tailwind";
import Badge from "./Badge";
import no_img from "../assets/no-image.jpg";
import { Button } from "./Form";
import { updatePayment } from "../helpers/payment";
import Loading from "./Loading";
import { UserCard } from "./User";
import { useAppSelector } from "../redux/store";
import { selectCustomers } from "../redux/customers";
import { selectTransactions } from "../redux/transactions";
import { TransactionCard } from "./Transaction";

type PaymentCardProps = {
  payment: PaymentWithRef;
};
export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    payment && (
      <div className="w-full h-24 py-2 px-4 border-b flex items-center justify-between gap-2 hover:bg-zinc-50">
        <div className="flex flex-col">
          <div className="flex gap-1 items-center">
            <PaymentStatusBadge status={payment.status} />
          </div>
          <p>
            <span className="font-medium">Amount:</span> ฿{" "}
            {payment.amount.toFixed(2)}
          </p>
          <p>
            <span className="font-medium">Timestamp:</span>{" "}
            {timestampToString(payment.timestamp)}
          </p>
        </div>
        <PaymentPreview payment={payment} />
      </div>
    )
  );
}

// C - Payment preview
type PaymentPreviewProps = { payment: PaymentWithRef };
export function PaymentPreview({ payment }: PaymentPreviewProps) {
  // [States]
  const customers = useAppSelector(selectCustomers);
  const transactions = useAppSelector(selectTransactions);
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [isConfirmModalShow, setConfirmModalShow] = useState<boolean>(false);
  const [status, setStatus] = useState<PaymentStatus | undefined>();
  const [isRequest, setRequest] = useState<boolean>(false);

  // [Data]
  const customer = customers.find(
    (customer) => customer.uid === payment.paid_by?.id
  );
  const transaction = transactions.find(
    (transaction) => transaction.tid === payment._ref.parent.parent?.id
  );

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow, () => {});
  const handleConfirmModal = handleModalFunction(
    setConfirmModalShow,
    (isOpen) => {
      if (!isOpen) {
        setStatus(undefined);
      }
    }
  );
  const handleConfirmChange = (input: PaymentStatus) => {
    setStatus(input);
    handleConfirmModal(true);
    handleModal(false);
  };

  return (
    <>
      <Loading isLoading={isRequest} />
      <PhotoIcon
        className="w-9 h-9 md:w-8 md:h-8 p-1 rounded-md text-black hover:bg-gray-300 hover:cursor-pointer"
        onClick={() => handleModal()}
      />
      <Modal
        title="Confirmation"
        isShow={isConfirmModalShow}
        setShow={setConfirmModalShow}
        maxSize="md"
      >
        <Body>
          <div className="flex flex-col gap-5 py-2 items-center">
            <p>Are you sure to change payment status.</p>
            <div className="flex gap-2">
              <PaymentStatusBadge status={payment.status} />
              <p>to</p>
              <PaymentStatusBadge status={status} />
            </div>
          </div>
        </Body>
        <Footer>
          <Button
            color="green"
            onClick={async () => {
              setRequest(true);
              if (status) {
                await updatePayment(payment._ref, status);
                handleConfirmModal(false);
              }
              setRequest(false);
            }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              handleConfirmModal(false);
            }}
          >
            Cancel
          </Button>
        </Footer>
      </Modal>
      <Modal
        title={`฿ ${payment.amount.toFixed(2)} on ${timestampToString(
          payment.timestamp
        )}`}
        isShow={isModalShow}
        setShow={setModalShow}
      >
        <Body>
          <div className="flex flex-col gap-3">
            <img
              src={payment.slip ? payment.slip : no_img}
              alt=""
              className="mx-auto w-fit h-[55vh] object-scale-down border"
            />
            {customer && (
              <UserCard
                id={customer.uid}
                displayName={customer.displayName}
                photoUrl={customer.photoUrl}
                type="Customer"
              />
            )}
            {transaction && <TransactionCard transaction={transaction} box />}
          </div>
        </Body>

        {payment.status === "Pending" && (
          <Footer>
            <Button
              color="green"
              onClick={() => handleConfirmChange("Approve")}
            >
              Approve
            </Button>
            <Button onClick={() => handleConfirmChange("Reject")}>
              Reject
            </Button>
          </Footer>
        )}
        {payment.status === "Approve" && (
          <Footer>
            <Button color="gray" onClick={() => handleConfirmChange("Refund")}>
              Refund
            </Button>
          </Footer>
        )}
      </Modal>
    </>
  );
}

// C - Payment status.
type PaymentStatusBadgeProps = {
  status?: PaymentStatus;
  size?: Size;
  expand?: boolean;
};
export function PaymentStatusBadge({
  status,
  size = "sm",
  expand = false,
}: PaymentStatusBadgeProps) {
  return (
    <Badge
      size={size}
      color={
        status === "Approve"
          ? "green"
          : status === "Reject"
          ? "red"
          : status === "Pending"
          ? "yellow"
          : status === "Refund"
          ? "gray"
          : "gray"
      }
      expand={expand}
    >
      {status ? status : "Process"}
    </Badge>
  );
}
