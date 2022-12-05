import { FormError } from "./error";

export const validatePassword = (
  password: string,
  confirm_password: string
) => {
  // Check if has change password.
  if (password.length > 0 || confirm_password.length > 0) {
    // Check if both have entered.
    if (password && confirm_password) {
      // Check if password match
      if (password === confirm_password) {
        return;
      } else {
        //Throw password not match.
        throw new FormError({
          password: "Password are not match.",
          new_password: "Password are not match",
          confirm_password: "Password are not match.",
        });
      }
    } else {
      // Throw the empty field.
      if (!password) {
        throw new FormError({
          new_password: "This field is needed to change password.",
        });
      }
      if (!confirm_password) {
        throw new FormError({
          confirm_password: "This field is needed to change password.",
        });
      }
    }
  }
};
