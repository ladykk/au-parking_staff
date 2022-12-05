import { ReactNode } from "react";
import { Color, Size } from "../types/tailwind";

// C - Badge
type Props = {
  children?: ReactNode;
  color?: Color;
  size?: Size;
  expand?: boolean;
};
export default function Badge({
  children,
  color = "blue",
  size = "xs",
  expand = false,
}: Props) {
  // [Settings]
  const colors = {
    blue: `bg-blue-100 text-blue-800`,
    gray: `bg-gray-100 text-gray-800`,
    red: `bg-red-100 text-red-800`,
    green: `bg-green-100 text-green-800`,
    yellow: `bg-yellow-100 text-yellow-800`,
    indigo: `bg-indigo-100 text-indigo-800`,
    purple: `bg-purple-100 text-purple-800`,
    pink: `bg-pink-100 text-pink-800`,
    rose: `bg-rose-100 text-rose-800`,
  };
  const sizes = `text-${size}`;

  return (
    <span
      className={`${
        colors[color]
      } font-semibold px-2.5 py-0.5 rounded h-fit ${sizes} text-center ${
        expand && "w-full"
      }`}
    >
      {children}
    </span>
  );
}
