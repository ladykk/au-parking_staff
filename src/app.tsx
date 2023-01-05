import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./routes";
import TransactionList from "./routes/transaction";
import TransactionDetail from "./routes/transaction/[tid]";
import EditTransaction from "./routes/transaction/[tid]/edit";
import AddTransaction from "./routes/transaction/add";
import "./styles/globals.css";
import StaffList from "./routes/staff";
import AddStaff from "./routes/staff/add";
import StaffDetail from "./routes/staff/[email]";
import EditStaff from "./routes/staff/[email]/edit";
import Settings from "./routes/setting";
import NodeControl from "./routes/setting/[node]";
import Dashboard from "./routes/dashboard";
import CustomerList from "./routes/customer";
import CustomerDetail from "./routes/customer/[uid]";
import Loading from "./components/Loading";
import EntranceKiosk from "./routes/kiosk/entrance";
import ExitKiosk from "./routes/kiosk/exit";
import FourOhFour from "./routes/404";

function MyApp() {
  const router = createBrowserRouter([
    {
      path: "",
      element: <SignIn />,
    },
    {
      path: "customer",
      children: [
        { path: "", element: <CustomerList /> },
        { path: ":uid", element: <CustomerDetail /> },
      ],
    },
    {
      path: "dashboard",
      element: <Dashboard />,
    },
    {
      path: "kiosk",
      children: [
        {
          path: "entrance",
          element: <EntranceKiosk />,
        },
        {
          path: "exit",
          element: <ExitKiosk />,
        },
      ],
    },
    {
      path: "setting",
      children: [
        { path: "", element: <Settings /> },
        { path: "entrance", element: <NodeControl node="Entrance" /> },
        { path: "exit", element: <NodeControl node="Exit" /> },
      ],
    },
    {
      path: "staff",
      children: [
        { path: "", element: <StaffList /> },
        { path: "add", element: <AddStaff /> },
        {
          path: ":email",
          children: [
            { path: "", element: <StaffDetail /> },
            { path: "edit", element: <EditStaff /> },
          ],
        },
      ],
    },
    {
      path: "transaction",
      children: [
        { path: "", element: <TransactionList /> },
        { path: "add", element: <AddTransaction /> },
        {
          path: ":tid",
          children: [
            { path: "", element: <TransactionDetail /> },
            { path: "edit", element: <EditTransaction /> },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <FourOhFour />,
    },
  ]);
  return <RouterProvider fallbackElement={<Loading />} router={router} />;
}

export default MyApp;
