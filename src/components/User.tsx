import no_profile from "../assets/no-profile.png";

type Size = "sm" | "md" | "lg";
type Props = {
  src?: string | null;
  size?: Size;
  lineThumbnail?: boolean;
};
export function ProfilePhoto({
  src,
  size = "md",
  lineThumbnail = false,
}: Props) {
  return (
    <img
      src={
        src
          ? !lineThumbnail
            ? src
            : `${src}/${size === "sm" ? "small" : "large"}`
          : no_profile
      }
      alt=""
      className={`${
        size === "sm"
          ? "w-[51px] h-[51px]"
          : size === "md"
          ? "w-[128px] h-[128px]"
          : "w-[200px] h-[200px]"
      } flex-0 aspect-square rounded-md border object-cover`}
    />
  );
}

import { useNavigate } from "react-router-dom";

type UserCardProps = {
  id?: string;
  displayName: string;
  photoUrl?: string | null;
  type: "Customer" | "Staff";
  staff?: boolean;
};
// C - User card.
export function UserCard({ id, displayName, photoUrl, type }: UserCardProps) {
  // [Hooks]
  const navigate = useNavigate();

  // [Functions]
  const handleNavigate = () => {
    if (!id) return;
    navigate(`/${type.toLowerCase()}/${id}`);
  };

  return (
    <div
      className={`flex border rounded-lg px-3 py-2 gap-4 items-center hover:bg-zinc-50 shadow ${
        id && "cursor-pointer"
      }`}
      onClick={handleNavigate}
    >
      <ProfilePhoto
        src={photoUrl}
        size="sm"
        lineThumbnail={type === "Customer"}
      />
      <p className="text-lg w-full truncate ...">{displayName}</p>
    </div>
  );
}
