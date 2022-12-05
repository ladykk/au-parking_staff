import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
  onClear?: () => void;
};

export default function FilterPanel({ children, onClear }: Props) {
  return (
    <div className="hidden sm:flex px-4 py-1.5 justify-between items-center rounded-lg mb-4 text-gray-700 bg-gray-100 shadow-md sm:rounded-lg">
      <div className="flex items-center gap-3">{children}</div>
      <p
        className="text-sm hover:cursor-pointer hover:text-gray-500"
        onClick={onClear}
      >
        Clear
      </p>
    </div>
  );
}
