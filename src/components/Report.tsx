import type { Report, ReportStatus, ReportWithRef } from "../types/report";
import { timestampToString } from "../utils/datetime";
import { Size } from "../types/tailwind";
import Badge from "./Badge";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
  ArrowDownIcon,
  ChatBubbleOvalLeftEllipsisIcon,
  MapIcon,
  PaperAirplaneIcon,
  PlusIcon,
} from "@heroicons/react/24/solid";
import { FormEvent, useEffect, useRef, useState } from "react";
import Modal, { Body, Footer, handleModalFunction } from "./Modal";
import { Chat } from "../types/chat";
import { sendReportImage, sendReportMessage } from "../helpers/chat";
import useAuth from "../contexts/auth";
import { useAppSelector } from "../redux/store";
import { selectCustomers } from "../redux/customers";
import { ProfilePhoto } from "./User";

import ImageViewer from "./ImageViewer";
import { getLINEContent } from "../utils/line";
import Spinner from "./Spinner";
import { uploadReportImage } from "../utils/firebase";
import { Timestamp } from "firebase/firestore";
import {
  ArchiveBoxArrowDownIcon,
  ArchiveBoxXMarkIcon,
} from "@heroicons/react/24/solid";
import { claimReport } from "../helpers/report";
import { selectStaffs } from "../redux/staffs";
import { Button } from "./Form";
import Loading from "./Loading";

// C - Report card.
type ReportCardProps = {
  report: Report;
  index?: number;
};
export function ReportCard({ report, index }: ReportCardProps) {
  // [Hooks]
  const navigate = useNavigate();

  return (
    report && (
      <div
        className="w-full h-24 py-2 px-4 border-b flex items-center gap-2 hover:bg-zinc-50"
        onClick={() => report.rid && navigate(`/report/${report.rid}`)}
      >
        <div className="w-[80px] flex flex-col gap-2 items-center justify-center">
          {typeof index == "number" && (
            <p className="font-medium">#{index + 1}</p>
          )}
          <ReportStatusBadge status={report.status} expand />
        </div>
        <div className="w-3/4 flex flex-col">
          <p>
            <span className="font-medium">Topic:</span> {report.topic}
          </p>
          <p>
            <span className="font-medium">Created:</span>{" "}
            {timestampToString(report.created_timestamp)}
          </p>
          {report.response && (
            <p className="truncate ...">
              <span className="font-medium">Response:</span> {report.response}
            </p>
          )}
        </div>
      </div>
    )
  );
}

// C - Report status.
type ReportStatusBadgeProps = {
  status?: ReportStatus;
  size?: Size;
  expand?: boolean;
};
export function ReportStatusBadge({
  status,
  size = "sm",
  expand = false,
}: ReportStatusBadgeProps) {
  return (
    <Badge
      size={size}
      color={
        status === "Open"
          ? "green"
          : status === "Closed"
          ? "red"
          : status === "Pending"
          ? "yellow"
          : "blue"
      }
      expand={expand}
    >
      {status}
    </Badge>
  );
}

// C - Report chat bubble.
type ReportChatBubbleProps = {
  chat: Chat;
  uid: string | undefined;
};
function ReportChatBubble({ chat, uid }: ReportChatBubbleProps) {
  // [States]
  const customers = useAppSelector(selectCustomers);
  const [content, setContent] = useState<string>("");
  const [isContentLoad, setContentLoad] = useState<boolean>(true);

  // [Data]
  const customer = customers.find((customer) => customer.uid === uid);

  // [Effects]
  useEffect(() => {
    (async () => {
      if (chat.source === "received") {
        switch (chat.message.type) {
          case "audio":
          case "image":
          case "video":
            if (chat.message.provider === "line") {
              const result = await getLINEContent(chat.messageId);
              if (result) setContent(URL.createObjectURL(result));
            }
            break;
          default:
        }
      }
      setContentLoad(false);
    })();
  }, [chat]);

  return (
    <div
      className={`${
        chat.source === "received" ? "justify-start" : "justify-end"
      } flex gap-2`}
    >
      {chat.source === "received" && (
        <ProfilePhoto src={customer?.photoUrl} size="sm" lineThumbnail />
      )}
      <div
        className={`${
          chat.source === "received" ? "items-start" : "items-end"
        } flex flex-col gap-1 max-w-[60%]`}
      >
        {chat.source === "received" && (
          <p className="text-sm">{customer?.displayName}</p>
        )}
        <div
          className={`flex ${chat.source === "response" ? "justify-end" : ""}`}
        >
          {chat.message.type === "text" ? (
            <p
              className={`px-3 py-2 shadow-md w-fit rounded-xl text-sm ${
                chat.source === "received"
                  ? "bg-white rounded-tl-none"
                  : "bg-rose-300 rounded-tr-none"
              } `}
            >
              {chat.message.text}
            </p>
          ) : chat.message.type === "image" && chat.source === "received" ? (
            <ImageViewer src={content} title="Image" originalAspect />
          ) : chat.message.type === "image" && chat.source === "response" ? (
            <ImageViewer
              src={chat.message.originalContentUrl}
              title="Image"
              originalAspect
            />
          ) : chat.message.type === "video" ? (
            <video
              src={content}
              controls
              className="w-full max-w-[70%] h-auto m-0 rounded-lg shadow-md"
            ></video>
          ) : chat.message.type === "audio" ? (
            <audio
              src={content}
              controls
              className="shadow-md rounded-lg bg-white p-2 rounded-tl-none"
            />
          ) : chat.message.type === "location" ? (
            <div className="px-3 py-2 shadow-md w-fit rounded-xl text-sm bg-white rounded-tl-none">
              <div className="border-b mb-1 pb-1 flex items-center justify-between gap-2">
                <p>
                  {chat.message.title ? chat.message.title : "No place name"}
                </p>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${chat.message.location.latitude},${chat.message.location.longitude}`}
                  target="_blank"
                  rel="noreferrer"
                >
                  <MapIcon className=" w-7 h-7 p-1 hover:bg-gray-300 hover:rounded-md" />
                </a>
              </div>

              <p className="text-gray-500">{chat.message.address}</p>
            </div>
          ) : (
            <p className="text-sm bg-gray-200 px-3 py-2 rounded-lg rounded-tl-none shadow-md border border-gray-500">
              Unsupport message. (
              {chat.message.type === "others"
                ? chat.message.kind
                : chat.message.type}
              )
            </p>
          )}
        </div>
        <div className="flex">
          {(chat.source === "response" && !chat.is_send) || isContentLoad ? (
            <div className="w-3 h-3">
              <Spinner resize />
            </div>
          ) : (
            <p className="text-[10px] text-gray-500">
              {timestampToString(chat.timestamp as Timestamp)}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// C - Report chat.
type ReportChatProps = {
  report: Report | undefined;
  chats: Array<Chat>;
};
export function ReportChat({ report, chats }: ReportChatProps) {
  // [States]
  const [message, setMessage] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const [loadFirst, setLoadFirst] = useState<boolean>(true);
  const [isUpload, setUpload] = useState<boolean>(false);
  const [isScrollButton, setScrollButton] = useState<boolean>(false);

  // [Hooks]
  const { user } = useAuth();
  const [searchParams] = useSearchParams();

  // [Refs]
  const chatsRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLInputElement>(null);

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow, (isOpen) => {
    if (!isOpen) setLoadFirst(true);
  });

  // F - Handle send message.
  const handleSendMessage = async () => {
    try {
      setError("");
      if (message && report?.rid) {
        const m = message;
        setMessage("");
        await sendReportMessage(
          report.rid,
          {
            name: user?.displayName as string,
            iconUrl: user?.photoURL ? user.photoURL : undefined,
          },
          m
        );
      }
    } catch (err: any) {
      if (err.message) setError(err.message);
    }
  };

  // F - Handle send image.
  const handleSendImage = async (e: FormEvent<HTMLInputElement>) => {
    try {
      setUpload(true);
      setError("");

      // Get file.
      let file: File | null | undefined = e.currentTarget.files?.item(0);

      // Check is has file.
      // CASE: no file.
      // DO: reject.
      if (!file) throw new Error("Image not selected.");
      if (!report?.rid) throw new Error("Cannot detect rid.");

      // Check size.
      const sizeMB = file.size / 1000000;
      // CASE: size more than 10 MB.
      // DO: reject.
      if (sizeMB > 10)
        throw new Error(`Image size is too large. (${sizeMB.toFixed(2)} MB.)`);

      // Upload image.
      const result = await uploadReportImage(report.rid, file);

      // Send image.
      await sendReportImage(
        report.rid,
        {
          name: user?.displayName as string,
          iconUrl: user?.photoURL ? user.photoURL : undefined,
        },
        result
      );
    } catch (err: any) {
      if (err.message) setError(err.message);
      else setError("Cannot send image.");
    } finally {
      setUpload(false);
    }
  };

  // F - Scroll to bottom.
  const scrollChatToBottom = () =>
    chatsRef.current &&
    (chatsRef.current.scrollTop = chatsRef.current.scrollHeight);

  // [Effects]
  // E - Scroll chats to bottom.
  useEffect(() => {
    if (chatsRef.current) {
      // console.log(chatsRef.current.scrollTop + chatsRef.current.clientHeight);
      // console.log(chatsRef.current.scrollHeight);
      if (loadFirst) {
        chatsRef.current.scrollTop = chatsRef.current.scrollHeight;
        scrollChatToBottom();
      } else if (
        chatsRef.current.scrollTop + chatsRef.current.clientHeight >
        chatsRef.current.scrollHeight - 100
      ) {
        scrollChatToBottom();
      }
    }
  }, [isModalShow, loadFirst, chats]);

  // E - Open Chat.
  useEffect(() => {
    if (searchParams.get("chat") === "open" && report?.status === "Open") {
      setModalShow(true);
    }
  }, [searchParams, report]);

  return (
    <>
      <Modal
        title="Chats"
        isShow={isModalShow}
        setShow={setModalShow}
        maxSize="md"
      >
        <div className="w-full h-[80vh] max-h-[800px] flex flex-col">
          <div
            className="w-full bg-gray-100 flex-1 px-3 py-2 flex flex-col gap-4 relative overflow-y-scroll"
            ref={chatsRef}
            onScroll={(e) => {
              if (
                e.currentTarget.scrollTop + e.currentTarget.clientHeight <
                e.currentTarget.scrollHeight - 100
              ) {
                setScrollButton(true);
              } else {
                setScrollButton(false);
              }
            }}
          >
            {isScrollButton && (
              <div
                className="sticky top-0 left-0 right-0 flex gap-2 bg-rose-500 w-fit mx-auto items-center justify-center p-2 shadow-md rounded-full hover:cursor-pointer z-50"
                onClick={scrollChatToBottom}
              >
                <ArrowDownIcon className="w-auto h-5 text-white" />
              </div>
            )}

            {chats.length > 0 ? (
              chats.map((chat, i) => (
                <ReportChatBubble
                  key={i}
                  chat={chat}
                  uid={report?.customer?.id}
                />
              ))
            ) : (
              <p className="mx-auto text-gray-500">Start chatting...</p>
            )}
          </div>
          {error && (
            <p className="px-2 py-1 text-rose-500 text-center border-t text-sm">
              {error}
            </p>
          )}
          <div className="h-12 flex pt-2 px-2 border-t gap-1 items-center">
            <div
              onClick={() => (isUpload ? null : imageRef.current?.click())}
              className="h-full w-auto aspect-square p-1.5 rounded-md hover:bg-gray-300 hover:cursor-pointer flex-shrink-0"
            >
              {isUpload ? <Spinner resize /> : <PlusIcon />}
            </div>

            <input
              className="hidden"
              accept="image/*"
              type="file"
              onChange={handleSendImage}
              ref={imageRef}
            />
            <input
              type="text"
              className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-rose-500 focus:border-rose-500 block w-full h-full p-2.5"
              placeholder="Enter message..."
              value={message}
              onChange={(e: FormEvent<HTMLInputElement>) => {
                setError("");
                setMessage(e.currentTarget.value);
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSendMessage();
              }}
            />
            <PaperAirplaneIcon
              className="h-full w-auto aspect-square p-1.5 rounded-md hover:bg-gray-300 hover:cursor-pointer flex-shrink-0"
              onClick={() => handleSendMessage()}
            />
          </div>
        </div>
      </Modal>
      {report?.status === "Open" && (
        <ChatBubbleOvalLeftEllipsisIcon
          className="w-10 h-10 p-1 hover:bg-gray-300 rounded-md hover:cursor-pointer"
          onClick={() => handleModal()}
        />
      )}
    </>
  );
}

export function ClaimReportModal({
  report,
}: {
  report: ReportWithRef | undefined;
}) {
  // [States]
  const [error, setError] = useState<string>("");
  const [isRequest, setRequest] = useState<boolean>(false);
  const [isModalShow, setModalShow] = useState<boolean>(false);
  const staffs = useAppSelector(selectStaffs);

  // [Hooks]
  const { user } = useAuth();

  // [Data]
  const staff = staffs.find((staff) => staff.email === report?.staff?.id);
  const isUnclaim = report?.staff?.id === user?.email;
  const Icon = isUnclaim ? ArchiveBoxXMarkIcon : ArchiveBoxArrowDownIcon;

  // [Functions]
  // F - Handle modal.
  const handleModal = handleModalFunction(setModalShow, (isOpen) => {
    if (!isOpen) setError("");
  });

  // F - Handle on submit.
  const handleClaimReport = async () => {
    try {
      setRequest(true);
      handleModal(false);
      if (report)
        await claimReport(
          report,
          isUnclaim ? undefined : (user?.email as string)
        );
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
        title={
          error
            ? "Claim Report Error"
            : isUnclaim
            ? "Unclaim Report"
            : "Claim Report"
        }
        isShow={isModalShow}
        setShow={setModalShow}
        maxSize="md"
      >
        <Body center>
          {error ? (
            <p>{error}</p>
          ) : (
            <p>
              {!isUnclaim &&
                staff &&
                `If you claim this report, ${staff.displayName} (${staff.email}) will be taken by you. `}{" "}
              Are you sure to {isUnclaim ? "unclaim" : "claim"} this report?
            </p>
          )}

          <p className="text-gray-500">RID: {report?.rid}</p>
        </Body>
        <Footer>
          <Button onClick={handleClaimReport}>
            {isUnclaim ? "Unclaim" : "Claim"}
          </Button>
          <Button variant="outline" onClick={() => handleModal(false)}>
            Cancel
          </Button>
        </Footer>
      </Modal>
      {report?.status !== "Closed" && (
        <Icon
          className="w-10 h-10 p-1 hover:bg-gray-300 rounded-md hover:cursor-pointer"
          onClick={() => handleModal()}
        />
      )}
    </>
  );
}
