import { XCircleIcon } from "@heroicons/react/24/solid";
import { useEffect, useState } from "react";
import Loading from "../../components/Loading";
import Spinner from "../../components/Spinner";
import { useNodeInfo } from "../../helpers/setting";
import { KioskLayout, KioskStaffCalled } from "../../components/Layout";
import { secondsFromNow, timestampToString } from "../../utils/datetime";
import line_qr from "../../assets/line-qr.png";
import app_1 from "../../assets/app-1.png";
import app_2 from "../../assets/app-2.png";
import QRCode from "react-qr-code";
import { useWebRTC } from "../../utils/webrtc";

const LIFF_URI = import.meta.env.VITE_LIFF_URI;

function ExitKiosk() {
  // [States]
  const [currentTimeout, setCurrentTimeout] = useState<number>(0);

  // [Hooks]
  const { info, isLoading, transaction } = useNodeInfo("Exit");
  const { feedRef, isFeedConnected } = useWebRTC("Exit");

  // [Effects]
  useEffect(() => {
    if (info?.node === "Exit") {
      let interval: NodeJS.Timer | null = null;
      switch (info.state.status.current_state) {
        case "detect":
          interval = setInterval(
            () =>
              setCurrentTimeout(
                secondsFromNow(info.state.status.enter_timestamp, 60)
              ),
            1000
          );
          return () => clearInterval(interval as NodeJS.Timer);
        case "payment":
          interval = setInterval(
            () =>
              setCurrentTimeout(
                secondsFromNow(info.state.status.enter_timestamp, 120)
              ),
            1000
          );
          return () => clearInterval(interval as NodeJS.Timer);
        case "failed":
          interval = setInterval(
            () =>
              setCurrentTimeout(
                secondsFromNow(info.state.status.enter_timestamp, 10)
              ),
            1000
          );
          return () => clearInterval(interval as NodeJS.Timer);
        default:
          break;
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [info?.state.status.current_state, info?.state.status.enter_timestamp]);

  return (
    <KioskLayout node="Exit">
      <Loading isLoading={isLoading} />
      <div className="absolute top-0 h-[13vh] flex justify-center items-center text-gray-500 text-[3vh]">
        State: {info?.state.status.current_state}
      </div>
      {!isLoading && info?.node === "Exit" ? (
        // [S0]: Idle
        info.state.status.current_state === "idle" ? (
          <div className="flex gap-[5vw] items-center justify-center">
            <div className="flex h-[70vh] text-white text-[2.5vh] text-center">
              <img src={app_1} alt="" className="h-full w-auto" />
              <img src={app_2} alt="" className="h-full w-auto" />
            </div>
            <div className="flex flex-col max-w-[43vw] gap-[2vh] justify-center items-center">
              <p className="text-rose-500 font-medium text-[6vh] text-center">
                Welcome to AU Parking
              </p>
              <p className="text-gray-500 text-[2.5vh] text-center font-light">
                New way to park at Assumption University with automatic system
                that let you pay whenever you like before exit the system.
              </p>
              <hr className="border-[1px] w-full my-[2vh]" />
              <div className="flex w-[38vw] items-center gap-[2vw]">
                <img
                  src={line_qr}
                  alt=""
                  className="w-fit h-[20vh] aspect-square"
                />
                <div className="flex flex-col gap-[1vh]">
                  <p className="text-[3vh] text-green-500 font-medium">
                    Add our LINE official account
                  </p>
                  <p className="text-[2.2vh] text-justify text-gray-500 font-light">
                    To received notfication of your car and make a payment on
                    your hand.
                  </p>
                </div>
              </div>
            </div>
          </div>
        ) : // [S1]: Detect
        info.state.status.current_state === "detect" ? (
          <div className="flex gap-[5vw] items-center justify-center">
            {isFeedConnected && (
              <div className="flex flex-col gap-[2vh]">
                <video
                  className="w-[55vw] h-[55vh] aspect-video object-cover rounded-lg shadow-md"
                  ref={feedRef}
                  muted
                />
                <p className="text-gray-500 text-[3vh] font-light text-center">
                  Make sure your license plate visible to the camera.
                </p>
              </div>
            )}
            <div className="flex flex-col gap-[5vh]">
              <p className="text-rose-500 font-medium text-[6vh] text-center">
                Detected License Plate
              </p>
              <div className="flex border-[0.6vh] text-[7vh] font-medium border-black w-fit mx-auto px-[4vw] py-[1.5vw] rounded-[2vh]">
                {info.alpr.status.candidate_key}
              </div>
              <p className="text-[4vh] text-center text-gray-500">
                Checking transaction in the system.
              </p>
              <p className="text-[2.5vh] text-center text-gray-500 font-light">
                Remaining process time {currentTimeout}{" "}
                {currentTimeout > 1 ? "seconds" : "second"}.
              </p>
            </div>
          </div>
        ) : // [S2]: Get Transaction
        info.state.status.current_state === "get" ? (
          <div className="flex gap-[3vw] items-center justify-center flex-col">
            <div className="flex flex-col gap-[3vh] items-center">
              <div className="flex border-[1vh] text-[10vh] font-medium border-black w-fit mx-auto px-[4vw] py-[1.5vw] rounded-[2vh]">
                {info.state.status.info.license_number}
              </div>
              <p className="text-[6vh] text-gray-500 font-light">
                TID: {info.state.status.info.tid}
              </p>
            </div>
            <div className="w-auto h-[8vh] aspect-square">
              <Spinner resize />
            </div>
            <p className="text-rose-500 font-medium text-[8vh] text-center">
              Checking Payment
            </p>
          </div>
        ) : // [S3]: Success
        info.state.status.current_state === "success" ? (
          <div className="flex gap-[5vw] items-center justify-center">
            {transaction?.image_out && (
              <div className="flex flex-col gap-[2vh]">
                <img
                  src={transaction.image_out}
                  className="w-[50vw] h-[50vh] aspect-video object-cover rounded-[2vh] shadow-lg"
                  alt=""
                />
              </div>
            )}
            <div className="flex flex-col gap-[5vh]">
              <p className="text-rose-500 font-medium text-[6vh] text-center">
                Transaction Closed
              </p>
              {transaction && (
                <>
                  <div className="flex border-[0.6vh] text-[7vh] font-medium border-black w-fit mx-auto px-[4vw] py-[1.5vw] rounded-[2vh]">
                    {transaction.license_number}
                  </div>
                  <div className="flex flex-col gap-[2vh]">
                    <p className="text-[4vh] text-center text-gray-500">
                      Timestamp-In:{" "}
                      {timestampToString(transaction.timestamp_in)}
                    </p>
                    <p className="text-[4vh] text-center text-gray-500">
                      Timestamp-Out:{" "}
                      {timestampToString(transaction.timestamp_out)}
                    </p>
                  </div>
                </>
              )}

              <p className="text-[2.5vh] text-center text-gray-500 font-light">
                TID: {info.state.status.info.tid}
              </p>
            </div>
          </div>
        ) : info.state.status.current_state === "payment" ? (
          <div className="flex gap-[5vw] items-center justify-center">
            {info.state.status.info.call_staff && <KioskStaffCalled />}
            <div className="flex flex-col gap-[4vh]">
              <div className="bg-white p-[2vh] rounded-[2vh] w-auto h-[45vh] aspect-square flex justify-center items-center mx-auto shadow-lg border-[0.2vh]">
                <QRCode
                  value={`${LIFF_URI}/payment/${transaction?.tid}`}
                  size={256}
                  style={{
                    height: "auto",
                    maxWidth: "100%",
                    width: "100%",
                  }}
                  viewBox={`0 0 256 256`}
                />
              </div>
              <p className="text-[4vh] text-gray-500 text-center">
                Scan the QR Code with{" "}
                <span className="text-green-500 font-medium">LINE</span> or
                Camera
                <br />
                or hold your mobile near the kiosk (NFC)
              </p>
            </div>
            <div className="flex flex-col gap-[4vh] w-[40vw]">
              <div className="flex flex-col gap-[2vh]">
                <p className="text-rose-500 font-medium text-[6vh] text-center">
                  Required Payment
                </p>
                <p className="text-[2.5vh] text-center text-gray-500 font-light">
                  Please process within {currentTimeout}{" "}
                  {currentTimeout > 1 ? "seconds" : "second"}.
                </p>
              </div>
              {transaction && (
                <>
                  <div className="flex border-[0.6vh] text-[7vh] font-medium border-black w-fit mx-auto px-[4vw] py-[1.5vw] rounded-[2vh]">
                    {transaction.license_number}
                  </div>
                  <p className="text-[4vh] text-center text-gray-500">
                    Timestamp-In: {timestampToString(transaction.timestamp_in)}
                  </p>
                  {transaction?.timestamp_out && (
                    <p className="text-[4vh] text-center text-gray-500">
                      Timestamp-Out:{" "}
                      {timestampToString(transaction.timestamp_out)}
                    </p>
                  )}
                </>
              )}

              <p className="text-[2.5vh] text-center text-gray-500 font-light">
                TID: {info.state.status.info.tid}
              </p>
            </div>
          </div>
        ) : (
          // [S4]: Failed
          <div className="flex flex-col gap-[4vh] w-[40vw]">
            {info.state.status.info.call_staff && <KioskStaffCalled />}
            <div className="flex flex-col gap-[2vh]">
              <XCircleIcon className="text-rose-500 w-auto h-[18vh] mb-[4vh]" />
              <p className="text-rose-500 font-medium text-[6vh] text-center">
                Close Transaction Failed
              </p>
              <p className="text-[3vh] text-center text-gray-500 font-light">
                Cannot close transaction in the system.
              </p>
              <p className="text-[4vh] text-center text-gray-500">
                Reason: {info.state.status.info.reason}
              </p>
              <p className="text-[2.5vh] text-center text-gray-500 font-light">
                Display will change within {currentTimeout}{" "}
                {currentTimeout > 1 ? "seconds" : "second"}.
              </p>
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-col gap-[4vh] w-[40vw]">
          <div className="flex flex-col gap-[2vh]">
            <XCircleIcon className="text-rose-500 w-auto h-[18vh] mb-[4vh]" />
            <p className="text-rose-500 font-medium text-[6vh] text-center">
              Fetch Node Info Failed
            </p>
            <p className="text-[3vh] text-center text-gray-500 font-light">
              Cannot fetch node's info from the system.
            </p>
          </div>
        </div>
      )}
    </KioskLayout>
  );
}

export default ExitKiosk;
