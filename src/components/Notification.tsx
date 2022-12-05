import {
  clearMessage,
  selectMessages,
  selectMessagesUpdateTime,
} from "../redux/messages";
import { useAppDispatch, useAppSelector } from "../redux/store";
import {
  XMarkIcon,
  BellIcon,
  ChatBubbleLeftRightIcon,
  ComputerDesktopIcon,
} from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import { Message } from "../types/messages";
import { selectCustomers } from "../redux/customers";
import { selectReports } from "../redux/reports";
import no_profile from "../assets/no-profile.png";
import logo from "../assets/logo2.png";
import { useNavigate } from "react-router-dom";

export function NotificationPane() {
  const messages = useAppSelector(selectMessages);
  const updateTime = useAppSelector(selectMessagesUpdateTime);
  const [isOpen, setOpen] = useState<boolean>(false);

  useEffect(() => {
    if (messages.length > 0) setOpen(true);
    else setOpen(false);
  }, [messages]);
  return (
    <>
      <div
        onClick={() => setOpen((f) => !f)}
        className={`w-11 h-11 p-2 rounded-md relative ${
          isOpen
            ? "bg-rose-500 hover:bg-rose-400 text-white"
            : "bg-zinc-100 hover:bg-gray-300"
        } hover:cursor-pointer`}
      >
        {messages.length > 0 && !isOpen && (
          <div className="bg-rose-500 absolute top-[25%] right-[25%] w-2 h-2 border border-white rounded-full"></div>
        )}
        <BellIcon />
      </div>

      {isOpen && (
        <div className="px-3 py-4 w-full max-w-xs text-gray-500 bg-white rounded-lg shadow-md fixed top-5 left-0 right-0 mx-auto md:right-5 md:mx-0 md:left-auto">
          <div className="flex items-center mb-3">
            <div className="mb-1">
              <p className="font-semibold text-rose-500">Notification</p>
              <p className="text-gray-500 text-xs">
                Updated Time: {updateTime}
              </p>
            </div>
            <button
              type="button"
              className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8"
              onClick={() => setOpen(false)}
            >
              <span className="sr-only">Close</span>
              <XMarkIcon className="w-5 h-5" />
            </button>
          </div>
          <div className="flex flex-col">
            {messages.length > 0 ? (
              messages.map((message, index) => (
                <Notification key={index} message={message} setOpen={setOpen} />
              ))
            ) : (
              <p className="text-gray-500 text-center text-sm my-2">
                No notification
              </p>
            )}
          </div>
        </div>
      )}
    </>
  );
}

function Notification({
  message,
  setOpen,
}: {
  message: Message;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) {
  // [States]
  const customers = useAppSelector(selectCustomers);
  const reports = useAppSelector(selectReports);
  const [currentTime, setCurrentTime] = useState<string>("");

  // [Hooks]
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  // [Datas]
  const report = reports.find(
    (report) =>
      (message.type === "report/create" || message.type === "report/message") &&
      message.rid === report.rid
  );
  const customer = customers.find(
    (customer) => customer.uid === report?.customer.id
  );

  // [Effects]
  // E - Update time.
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(message.timestamp ? message.timestamp.fromNow() : "");
    });

    return () => clearInterval(interval);
  }, []);

  const handleClearMessage = () => {
    dispatch(clearMessage(message.id));
    setOpen(false);
  };

  return (
    <div className="border-b flex items-center gap-1">
      <div
        className="flex items-start flex-1 w-[60%] px-1 py-2 hover:bg-gray-50 hover:cursor-pointer"
        onClick={() => {
          switch (message.type) {
            case "report/create":
              navigate(`/report/${message.rid}`);
            case "report/message":
              navigate(`/report/${message.rid}?chat=open`);
            default:
              handleClearMessage();
          }
        }}
      >
        <div className="inline-block relative shrink-0">
          <img
            className="w-12 h-12 rounded-full"
            src={
              message.type === "report/create" ||
              message.type === "report/message"
                ? customer?.photoUrl
                  ? customer.photoUrl
                  : no_profile
                : logo
            }
            alt=""
          />
          <span className="inline-flex absolute right-0 bottom-0 justify-center items-center w-6 h-6 bg-rose-600 rounded-full">
            {message.type === "report/create" ||
            message.type === "report/message" ? (
              <ChatBubbleLeftRightIcon className="w-4 h-4 text-white" />
            ) : message.type === "call_staff" ? (
              <ComputerDesktopIcon className="w-4 h-4 text-white" />
            ) : null}
            <span className="sr-only">Message icon</span>
          </span>
        </div>
        <div className="ml-3 text-sm font-normal w-[80%]">
          <div className="text-sm font-medium text-gray-900">
            {message.type === "report/create"
              ? "New Report"
              : message.type === "report/message"
              ? `${customer?.displayName}`
              : message.type === "call_staff"
              ? "Call at Kiosk"
              : "New Notification"}
          </div>
          <div className="text-sm font-normal">
            {message.type === "report/create"
              ? `RID: ${report?.rid}\nTopic: ${report?.topic}`
              : message.body}
          </div>
          <span className="text-xs text-rose-500">{currentTime}</span>
        </div>
      </div>
      <button
        type="button"
        className="ml-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex h-8 w-8 flex-0"
        onClick={handleClearMessage}
      >
        <span className="sr-only">Close</span>
        <XMarkIcon className="w-5 h-5" />
      </button>
    </div>
  );
}
