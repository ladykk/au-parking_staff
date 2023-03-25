import type { Payment, PaymentStatus, PaymentWithRef } from "../types/payment";
import { timestampToString } from "../utils/datetime";
import { PhotoIcon, ReceiptRefundIcon } from "@heroicons/react/24/solid";
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
import Table, { TPair } from "./Table";

// C - Payment refund
type PaymentRefundProps = { payment: PaymentWithRef };
export function PaymentRefund({ payment }: PaymentRefundProps) {
  // [States]
  const customers = useAppSelector(selectCustomers);
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [isRequest, setRequest] = useState<boolean>(false);

  // [Data]
  const customer = customers.find(
    (customer) => customer.uid === payment.paid_by?.id
  );

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow, () => {});

  return (
    <>
      <Loading isLoading={isRequest} />
      {payment.status === "Success" && (
        <ReceiptRefundIcon
          className="w-9 h-9 md:w-8 md:h-8 p-1 rounded-md text-black hover:bg-gray-300 hover:cursor-pointer"
          onClick={() => handleModal()}
        />
      )}
      <Modal
        title="Payment Refund"
        isShow={isModalShow}
        setShow={setModalShow}
        maxSize="md"
      >
        <Body>
          <div className="flex flex-col gap-5 py-2">
            <p className="text-center">Are you sure to refund this payment?</p>
            <Table>
              <TPair header="PID" value={payment.pid} />
              <TPair header="Amount" value={`${payment.amount.toFixed(2)} ฿`} />
              <TPair
                header="Timestamp"
                value={timestampToString(payment.timestamp)}
              />
            </Table>
            {customer && (
              <UserCard
                type="Customer"
                id={customer.uid}
                displayName={customer.displayName}
                photoUrl={customer.photoUrl}
              />
            )}
          </div>
        </Body>
        <Footer>
          <Button
            color="green"
            onClick={async () => {
              setRequest(true);
              updatePayment(payment._ref, "Refund");
              setRequest(false);
              handleModal(false);
            }}
          >
            Confirm
          </Button>
          <Button
            onClick={() => {
              handleModal(false);
            }}
          >
            Cancel
          </Button>
        </Footer>
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
        status === "Success"
          ? "green"
          : status === "Failed"
          ? "red"
          : status === "Pending" || status === "Process"
          ? "yellow"
          : status === "Refund" || status === "Canceled"
          ? "gray"
          : "gray"
      }
      expand={expand}
    >
      {status ? status : "Process"}
    </Badge>
  );
}
