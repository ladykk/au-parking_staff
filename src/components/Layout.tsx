import { ReactNode, useEffect, useState } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import Loading from "../components/Loading";
import { useTitle } from "../utils/hooks";
import useAuth from "../contexts/auth";
import {
  ArrowRightOnRectangleIcon,
  ChartBarSquareIcon,
  UserGroupIcon,
  ReceiptPercentIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
  ChevronLeftIcon,
  UsersIcon,
  CreditCardIcon,
  Bars3Icon,
} from "@heroicons/react/24/solid";
import logo from "../assets/logo.png";
import { ProfilePhoto } from "../components/User";
import moment from "moment";
import { Node } from "../types/setting";
import { useAppDispatch } from "../redux/store";

// [Components]
// C - Staff heaader.
type HeaderProps = {
  title: string;
  subTitle?: string;
  hideBack?: boolean;
  btns?: ReactNode;
};
export function Header({
  title,
  subTitle,
  hideBack = false,
  btns,
}: HeaderProps) {
  // [Hooks]
  const navigate = useNavigate();

  return (
    <div className="flex flex-wrap md:flex-nowrap items-center mb-5 justify-between w-full gap-2">
      <div className="w-full flex items-center gap-2">
        {!hideBack && (
          <ChevronLeftIcon
            className="p-1 hover:bg-gray-300 hover:cursor-pointer rounded-lg w-12 h-12"
            onClick={() => navigate(-1)}
          />
        )}
        <div className="w-full flex flex-col">
          <h1 className="text-rose-500 text-4xl font-semibold my-4">{title}</h1>
          {subTitle && <p className="text-gray-400">{subTitle}</p>}
        </div>
      </div>
      {btns && (
        <div className="flex justify-center items-center min-h-[2.5rem] p-1 gap-2 mx-auto w-full shadow bg-gray-100 md:p-0 md:w-fit md:shadow-none md:bg-transparent rounded-md">
          {btns}
        </div>
      )}
    </div>
  );
}

// C - Main
export function Main({ children }: { children?: ReactNode }) {
  return <div className={`mx-auto w-full max-w-7xl px-5 py-2`}>{children}</div>;
}

// C - Panel
export function Panel({
  header,
  children,
  btns,
  hFull,
}: {
  header: string;
  children?: ReactNode;
  btns?: ReactNode;
  hFull?: boolean;
}) {
  return (
    <div className={`mb-5 w-full ${hFull ? "h-full" : "h-fit"}`}>
      <div className="flex items-center justify-between mb-5">
        <p className="text-xl font-semibold">{header}</p>
        {btns}
      </div>
      <div className={`flex flex-col gap-5 ${hFull && "h-[90%]"}`}>
        {children}
      </div>
    </div>
  );
}

// C - Navigation Bar
export type StaffNavBar =
  | "Dashboard"
  | "Transactions"
  | "Payments"
  | "Customers"
  | "Chat"
  | "Staffs"
  | "Settings";

type Menu = {
  name: StaffNavBar;
  link: string;
  Icon: any;
  admin: boolean;
  popup: boolean;
};

type NavBarProps = {
  select?: StaffNavBar;
};

const NavBar = ({ select }: NavBarProps) => {
  // [Data]
  const MENUS = [
    {
      name: "Dashboard",
      link: "/dashboard",
      Icon: ChartBarSquareIcon,
      admin: false,
      popup: false,
    },
    {
      name: "Transactions",
      link: "/transaction",
      Icon: ReceiptPercentIcon,
      admin: false,
      popup: false,
    },
    {
      name: "Payments",
      link: "/payment",
      Icon: CreditCardIcon,
      admin: false,
      popup: false,
    },
    {
      name: "Customers",
      link: "/customer",
      Icon: UserGroupIcon,
      admin: false,
      popup: false,
    },
    {
      name: "Chat",
      link: "https://chat.line.biz/U6ea5dae36089af76f9e63d4aeba4c5ec",
      Icon: ChatBubbleLeftRightIcon,
      admin: false,
      popup: true,
    },
    { name: "Staffs", link: "/staff", Icon: UsersIcon, admin: true },
    {
      name: "Settings",
      link: "/setting",
      Icon: Cog6ToothIcon,
      admin: true,
      popup: false,
    },
  ] as Array<Menu>;

  // [States]
  const [isShowMenu, setShowMenu] = useState<boolean>(false);

  // [Hooks]
  const { user, isAdmin, logout } = useAuth();

  // [Effects]
  // E - Rerender when auth change.
  useEffect(() => {}, [user]);

  // CASE: no auth.
  // DO: not return UI.
  if (!user) return <></>;

  return (
    <div className="flex flex-col gap-2 sticky bottom-0 left-0 right-0 p-3 lg:px-5 border-t rounded-t-lg shadow bg-white z-50">
      <div
        className={`${
          isShowMenu ? "flex" : "hidden"
        } gap-2 justify-center items-center border-b pb-3 lg:hidden`}
      >
        {MENUS.map((MENU, i) =>
          MENU.admin && !isAdmin ? (
            <></>
          ) : (
            (() => {
              const content = (
                <div
                  className={`flex gap-1 justify-center items-center p-2 h-11 ${
                    select === MENU.name
                      ? "bg-rose-500 hover:bg-rose-400"
                      : "bg-zinc-100 hover:bg-gray-300"
                  } rounded-md hover:cursor-pointer`}
                >
                  <MENU.Icon
                    className={`w-auto h-full aspect-square ${
                      select === MENU.name && "text-white"
                    }`}
                  />
                  <p
                    className={`hidden md:block ${
                      select === MENU.name && "text-white"
                    } text-sm`}
                  >
                    {MENU.name}
                  </p>
                </div>
              );
              return MENU.popup ? (
                <a href={MENU.link} target="_blank" key={i}>
                  {content}
                </a>
              ) : (
                <Link to={MENU.link} key={i}>
                  {content}
                </Link>
              );
            })()
          )
        )}
      </div>
      <div className="flex items-center justify-between ">
        <div className="flex items-center gap-2 lg:min-w-[300px]">
          <Bars3Icon
            onClick={() => setShowMenu((p) => !p)}
            className="lg:hidden w-11 h-11 p-2 rounded-md bg-zinc-100 hover:bg-gray-300 hover:cursor-pointer"
          />
          <div className="hidden sm:flex gap-2 items-center">
            <img src={logo} alt="" style={{ width: "48px" }} />
            <div className="">
              <p className="text-rose-500 font-medium text-xl">AU PARKING</p>
              <p className="text-zinc-500 font-normal text-xs">FOR STAFF</p>
            </div>
          </div>
        </div>
        <div className={`hidden lg:flex gap-2 justify-center items-center`}>
          {MENUS.map((MENU, i) =>
            MENU.admin && !isAdmin ? (
              <></>
            ) : (
              (() => {
                const content = (
                  <div
                    className={`flex gap-1 justify-center items-center p-2 w-fit h-11 ${
                      select === MENU.name
                        ? "bg-rose-500 hover:bg-rose-400"
                        : "bg-zinc-100 hover:bg-gray-300"
                    } rounded-md hover:cursor-pointer`}
                  >
                    <MENU.Icon
                      className={`w-full h-full ${
                        select === MENU.name && "text-white"
                      }`}
                    />
                    <p
                      className={`hidden 2xl:block ${
                        select === MENU.name && "text-white"
                      }`}
                    >
                      {MENU.name}
                    </p>
                  </div>
                );
                return MENU.popup ? (
                  <a href={MENU.link} target="_blank" key={i}>
                    {content}
                  </a>
                ) : (
                  <Link to={MENU.link} key={i}>
                    {content}
                  </Link>
                );
              })()
            )
          )}
        </div>
        <div className="rounded-xl flex justify-end items-center gap-2 lg:min-w-[300px]">
          <Link to={`/staff/${user.email}`}>
            <div>
              <p className="text-md text-right">{`${user.displayName}`}</p>
              <p className="font-light text-sm text-zinc-500 text-right">
                {isAdmin ? "Administrator" : "Staff"}
              </p>
            </div>
          </Link>
          <ProfilePhoto src={user.photoURL} size="sm" />
          <ArrowRightOnRectangleIcon
            className="w-11 h-11 p-2 rounded-md bg-zinc-100 hover:bg-gray-300 hover:cursor-pointer"
            onClick={logout}
          />
        </div>
      </div>
    </div>
  );
};

// C - Staff Layout.
type LayoutProps = {
  children?: ReactNode;
  title?: string;
  select?: StaffNavBar;
  isLoading?: boolean;
};

export function StaffLayout({
  children,
  title = "Untitle",
  select,
  isLoading = false,
}: LayoutProps) {
  // [Hooks]
  useTitle(title);
  const { user, loading, error } = useAuth();
  const location = useLocation();
  const dispatch = useAppDispatch();

  // CASE: auth loading.
  // DO: show loading screen.
  if (loading) return <Loading isLoading={loading} />;

  // CASE: no auth.
  // DO: redirect to sign-in page.
  if (!user && location.pathname !== "/") {
    const redirectUrl = location.pathname;
    return (
      <Navigate to={redirectUrl ? `/?redirect=${redirectUrl}` : "/"} replace />
    );
  } else if (location.pathname.length < 1)
    return <Navigate to="/dashboard" replace />;

  // CASE: error.
  // DO: return error.
  if (error)
    return (
      <div>
        <h1>Staff Layout - Error occured.</h1>
        <p>{error}</p>
      </div>
    );

  return (
    <div className="w-screen h-screen flex flex-col-reverse gap-2">
      <NavBar select={select} />
      {isLoading && <Loading />}
      <div className=" h-full overflow-y-auto">{children}</div>
    </div>
  );
}

type KioskLayoutProps = {
  node: Node;
  current_state?: string;
  children?: ReactNode;
};

export function KioskLayout({
  node,
  current_state,
  children,
}: KioskLayoutProps) {
  const [time, setTime] = useState<string>(
    moment().format("dddd, MMMM DD YYYY, HH:mm:ss")
  );

  useEffect(() => {
    const interval = setInterval(
      () => setTime(moment().format("dddd, MMMM DD YYYY, HH:mm:ss")),
      1000
    );
    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <div className="w-screen h-screen">
      <div className="h-[87vh] flex flex-col justify-center items-center">
        {children}
      </div>
      <div className="flex justify-between items-center border-t shadow-md h-[13vh]">
        <div className="flex gap-[1vw] px-[1.5vw] items-center w-fit">
          <img src={logo} alt="" className="w-[9vh] h-[9vh]" />
          <div>
            <p className="text-[4vh] text-rose-500 font-medium">AU Parking</p>

            <p className="text-[2vh] text-gray-500 font-light">
              Automatic Parking System
            </p>
          </div>
        </div>
        <div className="px-[1.5vw] flex flex-col items-end">
          <p className="text-[4.5vh] text-rose-500 font-medium">{node}</p>
          <p className="text-[2vh] font-light text-gray-500 ">{time}</p>
        </div>
        {current_state && (
          <div className="absolute bottom-0 left-0 right-0 h-[13vh] flex justify-center items-center text-gray-500 font-light text-[3vh]">
            State:{" "}
            {current_state.charAt(0).toUpperCase() + current_state.slice(1)}
          </div>
        )}
      </div>
    </div>
  );
}

export function KioskStaffCalled() {
  return (
    <div
      className="py-[2vh] px-[1vw] text-[3vh] text-green-700 bg-green-100 rounded-lg absolute top-[2vh] shadow-lg"
      role="alert"
    >
      <span className="font-medium">Staff Called!</span> They will come help you
      soon.
    </div>
  );
}
