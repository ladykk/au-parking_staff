import { XMarkIcon } from "@heroicons/react/24/solid";
import { Dispatch, SetStateAction, ReactNode } from "react";
import { Size } from "../types/tailwind";

// [Functions]
export const handleModalFunction =
  (
    setShow: Dispatch<SetStateAction<boolean>>,
    callBack?: (isOpen?: boolean) => void
  ) =>
  (isOpen?: boolean) => {
    if (callBack) callBack(isOpen);
    setShow((s) => (typeof isOpen === "boolean" ? isOpen : !s));
  };

// C - Modal.
type ModalProps = {
  children?: ReactNode;
  title: string;
  isShow: boolean;
  setShow: Dispatch<SetStateAction<boolean>>;
  handleModal?: (boolean?: boolean) => void;
  maxSize?: Size;
};
export default function Modal({
  children,
  title = "",
  isShow,
  setShow,
  handleModal,
  maxSize,
}: ModalProps) {
  // [Functions]
  const handleCloseModal = () =>
    handleModal ? handleModal(false) : handleModalFunction(setShow)(false);

  return isShow ? (
    <div className="fixed top-0 left-0 right-0 bottom-0 z-50 p-3 bg-gray-300 bg-opacity-50 flex flex-col justify-center items-center">
      <div
        className={`flex w-full h-auto flex-col rounded-lg shadow-md bg-white py-3 ${
          maxSize ? `max-w-${maxSize}` : "max-w-2xl"
        }`}
      >
        <div className="pb-2 px-4 flex justify-between items-center border-b">
          <p className="text-xl text-rose-500 font-semibold">{title}</p>
          <XMarkIcon
            className="w-8 h-8 p-1 rounded-md text-black hover:bg-gray-300 hover:cursor-pointer"
            onClick={handleCloseModal}
          />
        </div>
        {children}
      </div>
    </div>
  ) : (
    <></>
  );
}

// C - Modal body.
type BodyProps = { children: ReactNode; center?: boolean; hFull?: boolean };
export function Body({ children, center = false, hFull = false }: BodyProps) {
  return (
    <div
      className={`p-4 ${center ? "text-center" : ""} ${
        hFull ? "h-full overflow-y-auto" : ""
      }`}
    >
      {children}
    </div>
  );
}

// C - Footer body.
type FooterProps = { children: ReactNode };
export function Footer({ children }: FooterProps) {
  return (
    <div className="pt-2 px-4 flex justify-between gap-3 items-center border-t">
      {children}
    </div>
  );
}
