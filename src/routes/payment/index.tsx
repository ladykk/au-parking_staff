import { PaymentStatusBadge, PaymentPreview } from "../../components/Payment";
import Table, {
  Pagination,
  TBody,
  THead,
  TRow,
  TSpan,
  usePagination,
} from "../../components/Table";
import { StaffLayout, Header, Main } from "../../components/Layout";
import { PaymentWithRef } from "../../types/payment";
import { timestampToString } from "../../utils/datetime";
import { useGetPendingPayment } from "../../helpers/payment";
import { useAppSelector } from "../../redux/store";
import { selectCustomers } from "../../redux/customers";

function PendingPaymentList() {
  // [States]
  const customers = useAppSelector(selectCustomers);

  // [Hooks]
  const { payments, updateTime } = useGetPendingPayment();

  // [Pagination]
  const { currentPage, setPage, currentItems, itemsPerPage } =
    usePagination<PaymentWithRef>(payments);

  return (
    <StaffLayout
      title="Pending Payments' List"
      select="Payments"
      isLoading={updateTime === "Updating..."}
    >
      <Main>
        <Header
          hideBack
          title={`Pending Payments' List (${payments.length})`}
          subTitle={`Updated on: ${updateTime}`}
        />
        <Table
          pagination={
            <Pagination
              currentPage={currentPage}
              setPage={setPage}
              itemsPerPage={itemsPerPage}
              totalItems={payments.length}
            />
          }
        >
          <THead columns={["Status", "Amount", "Timestamp", "Payer", "Slip"]} />
          <TBody>
            {currentItems.length > 0 ? (
              currentItems.map((payment, i) => {
                const customer = payment.paid_by
                  ? customers.find(
                      (customer) => customer.uid === payment.paid_by?.id
                    )
                  : undefined;
                return (
                  <TRow
                    key={i}
                    center
                    data={[
                      <PaymentStatusBadge status={payment.status} />,
                      `฿ ${payment.amount.toFixed(2)}`,
                      timestampToString(payment.timestamp),
                      customer ? customer.displayName : "-",
                      <PaymentPreview payment={payment} />,
                    ]}
                  />
                );
              })
            ) : (
              <TSpan colSpan={5} center>
                No pending payment.
              </TSpan>
            )}
          </TBody>
        </Table>
      </Main>
    </StaffLayout>
  );
}

export default PendingPaymentList;
