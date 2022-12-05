import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import Modal from "./Modal";
import no_img from "../assets/no-image.jpg";

// C - Image viewer.
type Props = {
  src?: string;
  title?: string;
  button?: boolean;
  originalAspect?: boolean;
};
export default function ImageViewer({
  src,
  title = "",
  button = false,
  originalAspect = false,
}: Props) {
  // [States]
  const [isShow, setIsShow] = useState<boolean>(false);

  const handleToggleImage = () => {
    if (src) setIsShow(!isShow);
  };

  return (
    <>
      {button ? (
        <PhotoIcon
          className="w-12 md:w-10 h-12 md:h-10 p-2 rounded-lg bg-gray-50 border border-gray-300 hover:text-rose-500 hover:bg-gray-100 hover:cursor-pointer flex-shrink-0"
          onClick={handleToggleImage}
        />
      ) : (
        <img
          src={src ? src : no_img}
          alt=""
          className={`${
            originalAspect ? "w-[70%] h-auto" : "w-full aspect-video"
          } object-cover border  rounded-md ${
            src && "hover:border-rose-500 hover:cursor-pointer"
          }`}
          onClick={handleToggleImage}
        />
      )}
      {isShow && (
        <Modal title={title} isShow={isShow} setShow={setIsShow} maxSize="2xl">
          <img
            src={src ? src : no_img}
            className="w-full max-h-[80vh] object-scale-down bg-gray-100"
            alt=""
          />
        </Modal>
      )}
    </>
  );
}
