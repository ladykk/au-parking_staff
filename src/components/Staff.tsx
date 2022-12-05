import { Size } from "../types/tailwind";
import Badge from "./Badge";

// C - Staff status.
type StaffStatusBadgeProps = {
  disabled?: boolean;
  size?: Size;
  expand?: boolean;
};
export function StaffStatusBadge({
  disabled,
  size = "sm",
  expand = false,
}: StaffStatusBadgeProps) {
  return (
    <Badge
      size={size}
      color={
        typeof disabled === "boolean" ? (disabled ? "red" : "green") : "blue"
      }
      expand={expand}
    >
      {typeof disabled === "boolean"
        ? disabled
          ? "Disabled"
          : "Active"
        : "Process"}
    </Badge>
  );
}
