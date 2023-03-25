import moment from "moment";
import { StaffLayout, Header, Main, Panel } from "../../components/Layout";
import { useGetPendingPayment } from "../../helpers/payment";
import { useAppSelector } from "../../redux/store";
import {
  selectTransactions,
  selectTransactionsUpdateTime,
} from "../../redux/transactions";
import { Color } from "../../types/tailwind";

function Dashboard() {
  const transactions = useAppSelector(selectTransactions);
  const updateTime = useAppSelector(selectTransactionsUpdateTime);
  const { payments } = useGetPendingPayment();
  // [Format Data]
  // > Transaction
  const today_transactions = transactions.filter((transaction) =>
    moment(transaction.timestamp_in.toDate()).isSameOrAfter(
      moment().hour(0).minute(0).second(0).millisecond(0)
    )
  );
  const exists_transactions = transactions.filter(
    (transaction) =>
      transaction.timestamp_out === null && !transaction.is_cancel
  );
  const unpaid_transactions = transactions.filter(
    (transaction) => transaction.status === "Unpaid"
  );
  const paid_transactions = transactions.filter(
    (transaction) => transaction.status === "Paid"
  );
  const total_transactions = transactions.filter(
    (transaction) => !transaction.is_cancel
  );

  // > Payment
  const { approve, pending, remain } = (() => {
    let approve = 0;
    let pending = 0;
    let remain = 0;
    transactions.forEach((transaction) => {
      if (transaction.status === "Paid") approve += transaction.fee;
      else if (transaction.status === "Unpaid") remain += transaction.fee;
    });
    payments.forEach((payment) => (pending += payment.amount));
    return { approve: approve - pending, pending, remain };
  })();
  return (
    <StaffLayout select="Dashboard" title="Dashboard">
      <Main>
        <Header
          title="Dashboard"
          subTitle={`Updated on: ${updateTime}`}
          hideBack
        />
        <div className="flex gap-5 lg:gap-10 flex-col md:max-w-none mx-auto lg:flex-row">
          <div className="flex flex-col sm:flex-row gap-5 lg:flex-col lg:gap-0 lg:min-w-[50vh] lg:max-w-[50vh] flex-1">
            <Panel header="Entrance">
              <iframe
                className="w-full h-full aspect-video border rounded-lg shadow"
                src="/kiosk/entrance"
                title="kiosk-entrance"
              />
            </Panel>
            <Panel header="Exit">
              <iframe
                className="w-full h-full aspect-video border rounded-lg shadow"
                src="/kiosk/exit"
                title="kiosk-exit"
              />
            </Panel>
          </div>
          <div className="w-full">
            <Panel header="Transactions">
              <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 gap-3">
                {" "}
                <Card
                  header="Unpaid"
                  value={unpaid_transactions.length.toFixed(0)}
                  color="rose"
                />
                <Card
                  header="Paid"
                  value={paid_transactions.length.toFixed(0)}
                  color="green"
                />
              </div>
              <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Card
                  header="Today"
                  value={today_transactions.length.toFixed(0)}
                  color="blue"
                />
                <Card
                  header="Exists"
                  value={exists_transactions.length.toFixed(0)}
                  color="yellow"
                />

                <Card
                  header="Total"
                  value={total_transactions.length.toFixed(0)}
                  color="gray"
                />
              </div>
            </Panel>
            <Panel header="Payments">
              <div className="w-full h-fit grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                <Card
                  header="Approved"
                  value={`${approve.toFixed(2)} ฿`}
                  color="green"
                />
                <Card
                  header="Pending"
                  value={`${pending.toFixed(2)} ฿`}
                  color="yellow"
                />

                <Card
                  header="Remain"
                  value={`${remain.toFixed(2)} ฿`}
                  color="rose"
                />
              </div>
            </Panel>
          </div>
        </div>
      </Main>
    </StaffLayout>
  );
}

function Card({
  header,
  value,
  color,
}: {
  header: string;
  value: any;
  color?: Color;
}) {
  return (
    <div
      className={`w-full shadow-md p-4 rounded-lg flex flex-col gap-2 ${
        color ? `bg-${color}-500` : ""
      }`}
    >
      <h1
        className={`text-lg font-semibold ${
          color ? "text-white" : "text-gray-500"
        }`}
      >
        {header}
      </h1>
      <p
        className={`text-4xl font-semibold text-end ${
          color ? "text-white" : ""
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export default Dashboard;
