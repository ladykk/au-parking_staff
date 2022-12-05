import Spinner from "./Spinner";
import logo from "../assets/logo.png";
import header from "../assets/header.jpg";

// C - Loading
type Props = {
  isLoading?: boolean;
  app?: "Customer" | "Staff";
};
export default function Loading({ isLoading = true, app }: Props) {
  return isLoading ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 bg-gray-300 bg-opacity-50 flex items-center justify-center z-50">
      {app ? (
        <div className="w-full h-full bg-white">
          <div className="w-full h-full max-h-[32vh] sm:max-w-[50vw] sm:max-h-[100vh] sm:h-[100vh] relative sm:flex">
            <img
              src={header}
              alt=""
              className="w-full h-full object-cover shadow-xl"
            />
            <img
              src={logo}
              alt=""
              className="w-auto h-auto -translate-y-1/2 max-w-[35vw] max-h-[35vh] mx-auto sm:-translate-y-0 sm:absolute sm:top-0 sm:left-0 sm:right-0 sm:bottom-0 sm:m-auto sm:hidden"
            />
          </div>
          <div className="absolute sm:flex top-[0vh] mt-[46vh] sm:mt-0 left-0 sm:left-[50vw] right-0 bottom-0 mx-auto w-fit sm:w-auto sm:h-auto sm:my-auto flex flex-col items-center justify-between sm:justify-center pb-[10vh] sm:pb-0 sm:gap-[10vh]">
            <div>
              <img
                src={logo}
                alt=""
                className="hidden w-auto h-auto max-w-[18vw] max-h-[18vh] mb-[2vh] mx-auto sm:block"
              />
              <p className="text-rose-500 text-[8vw] sm:text-[5vh] font-semibold text-center">
                AU Parking
              </p>
              <p className="text-rose-500 text-[6vw] sm:text-[3vh] font-semibold text-center">
                For {app}
              </p>
            </div>
            <Spinner />
            <div className="flex flex-col gap-1">
              <p className="text-[3vw] sm:text-[2vh] text-center text-gray-500">
                VINCENT MARY SCHOOL OF ENGINEERING
              </p>
              <p className="text-[3vw] sm:text-[2vh] text-center text-gray-500">
                ASSUMPTION UNIVERSITY
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white p-3 shadow rounded-lg flex flex-col items-center justify-center gap-3">
          <Spinner />
        </div>
      )}
    </div>
  ) : (
    <></>
  );
}
