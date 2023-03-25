import { Link, useParams } from "react-router-dom";
import { AddCarModal, CarRemoveModal } from "../../components/Car";

import { ProfilePhoto } from "../../components/User";
import Table, {
  Pagination,
  TBody,
  THead,
  TPair,
  TRow,
  TSpan,
  usePagination,
} from "../../components/Table";
import { StaffLayout, Header, Main, Panel } from "../../components/Layout";
import Feedback from "../../components/Feedback";
import { useGetCustomerByUID } from "../../helpers/customer";
import { useGetCustomerPayments } from "../../helpers/payment";
import { PaymentStatusBadge, PaymentRefund } from "../../components/Payment";
import customers from "../../redux/customers";
import { timestampToString } from "../../utils/datetime";
import { PaymentWithRef } from "../../types/payment";

// P - Customer detail
export function CustomerDetail() {
  // [Hooks]
  const { uid } = useParams();
  const { customer, updateTime: customerUpdateTime } = useGetCustomerByUID(
    uid as string
  );
  const { payments, updateTime: paymentUpdateTime } = useGetCustomerPayments(
    uid as string
  );
  const { currentPage, setPage, currentItems, itemsPerPage } =
    usePagination<PaymentWithRef>(payments, 10);

  return (
    <StaffLayout
      title="Customer's Info"
      select="Customers"
      isLoading={
        customerUpdateTime === "Updating..." ||
        paymentUpdateTime === "Updating..."
      }
    >
      <Main>
        <Header
          title="Customer's Info"
          subTitle={`Updated on: ${customerUpdateTime}`}
        />

        <div className="w-full flex flex-col gap-3 justify-between lg:gap-5">
          {!customer ? (
            <Feedback
              header="Customer not found."
              message={`Customer with uid "${uid}" is not found.`}
              type="Error"
            />
          ) : (
            <>
              <div className="flex flex-col lg:flex-row lg:gap-5 flex-1 gap-3">
                <Panel header="Info">
                  <Table>
                    <TBody>
                      <TPair
                        header="Photo"
                        value={
                          <ProfilePhoto
                            src={customer.photoUrl}
                            size="md"
                            lineThumbnail
                          />
                        }
                      />
                      <TPair header="UID" value={customer.uid} />
                      <TPair header="Name" value={customer.displayName} />
                    </TBody>
                  </Table>
                </Panel>
                <Panel
                  header="Registered Cars"
                  btns={<AddCarModal customer={customer} />}
                >
                  <Table>
                    <THead
                      columns={[
                        "No.",
                        "License number",
                        "Province",
                        "Brand",
                        "Color",
                        "Actions",
                      ]}
                    />
                    <TBody>
                      {customer.cars ? (
                        customer.cars.length > 0 ? (
                          customer.cars.map((car, i) => (
                            <TRow
                              key={i}
                              data={[
                                i + 1,
                                car.license_number,
                                car.province,
                                car.brand,
                                car.color,
                                <CarRemoveModal car={car} user="Staff" />,
                              ]}
                              center
                            />
                          ))
                        ) : (
                          <TSpan colSpan={6} center>
                            No registered car.
                          </TSpan>
                        )
                      ) : (
                        <TSpan colSpan={6} center>
                          No registered car.
                        </TSpan>
                      )}
                    </TBody>
                  </Table>
                </Panel>
              </div>
              <div className="flex flex-col flex-1 gap-3">
                <Panel header="Payments">
                  <Table
                    pagination={
                      <Pagination
                        currentPage={currentPage}
                        setPage={setPage}
                        itemsPerPage={itemsPerPage}
                        totalItems={customers.length}
                      />
                    }
                  >
                    <THead
                      columns={[
                        "Status",
                        "Amount",
                        "Timestamp",
                        "TID",
                        "Refund",
                      ]}
                    />
                    <TBody>
                      {currentItems.length > 0 ? (
                        currentItems.map((payment, i) => (
                          <TRow
                            key={i}
                            center
                            data={[
                              <PaymentStatusBadge status={payment.status} />,
                              payment.amount
                                ? `${payment.amount.toFixed(2)} ฿`
                                : "-",
                              timestampToString(payment.timestamp),
                              <Link
                                to={`/transaction/${payment._ref.parent.parent?.id}`}
                                className="underline"
                              >
                                {payment._ref.parent.parent?.id}
                              </Link>,
                              <PaymentRefund payment={payment} />,
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
          )}
        </div>
      </Main>
    </StaffLayout>
  );
}

export default CustomerDetail;
