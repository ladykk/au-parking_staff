import { DocumentReference } from "firebase/firestore";
import { WithRef } from "./base";

export type StaffRole = "Administrator" | "Staff";

export type StaffWithRef = Staff & WithRef<Staff>;

export type Staff = {
  [index: string]: string | boolean | DocumentReference<Staff> | undefined;
  email: string;
  role: StaffRole;
  displayName: string;
  phone_number: string;
  photoUrl?: string;
  disabled: boolean;
  add_by?: DocumentReference<Staff>;
};

export type StaffSignInForm = {
  [index: string]: string;
  email: string;
  password: string;
};

export type StaffSignInErrors = {
  [index: string]: string;
  email: string;
  password: string;
  form: string;
};

export type AddStaff = {
  [index: string]: string | File | null | undefined;
  email: string;
  password: string;
  role: StaffRole;
  displayName: string;
  phone_number: string;
  photoUrl?: string;
  add_by?: string;
};

export type AddStaffForm = {
  [index: string]: string | File | null | undefined;
  displayName: string;
  email: string;
  phone_number: string;
  role: string;
  photo?: File | null;
  password: string;
  confirm_password?: string;
  add_by?: string;
};

export type AddStaffErrors = {
  [index: string]: string | undefined;
  displayName?: string;
  email?: string;
  phone_number?: string;
  role?: string;
  photo?: string;
  password?: string;
  confirm_password?: string;
  form?: string;
};

export type EditStaff = {
  [index: string]: string | boolean | undefined;
  target_email?: string;
  displayName?: string;
  phone_number?: string;
  role?: string;
  disabled?: boolean;
  new_password?: string;
  photoUrl?: string;
};

export type EditStaffForm = {
  [index: string]: string | boolean | File | null | undefined;
  displayName?: string;
  phone_number?: string;
  role?: string;
  photo?: File | null;
  disabled?: boolean;
  new_password?: string;
  confirm_password?: string;
};

export type EditStaffErrors = {
  [index: string]: string | undefined;
  displayName?: string;
  phone_number?: string;
  role?: string;
  photo?: string;
  disabled?: string;
  new_password?: string;
  confirm_password?: string;
  form?: string;
};
