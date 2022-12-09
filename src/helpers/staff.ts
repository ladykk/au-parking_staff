import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDoc,
  onSnapshot,
  query,
} from "firebase/firestore";
import { Firestore, Functions, RTDatabase } from "../utils/firebase";
import { setStaffs } from "../redux/staffs";
import { AppDispatch } from "../redux/store";
import {
  AddStaff,
  AddStaffForm,
  EditStaff,
  EditStaffForm,
  Staff,
  StaffRole,
  StaffWithRef,
} from "../types/staff";
import { FormError, handleHelperError } from "../utils/error";
import { uploadStaffProfile } from "../utils/firebase";
import axios from "axios";
import { httpsCallable } from "firebase/functions";
import { FirebaseError } from "firebase/app";
import { ref, set } from "firebase/database";

// [Staff Helpers]

// [API]
// A - Staff API.
export const StaffAPI = axios.create({
  baseURL: "https://asia-southeast2-au-parking.cloudfunctions.net/staff",
});

// [Collections]
export const staffCollections = collection(
  Firestore,
  "staffs"
) as CollectionReference<Staff>;

// [Documents]
export const staffDocument = (email: string) =>
  doc(Firestore, "staffs", email) as DocumentReference<Staff>;

// [Snapshots]
// S - Staffs snapshot.
export const getStaffsSnapshot = (dispatch: AppDispatch) =>
  onSnapshot<Staff>(
    query<Staff>(staffCollections),
    (querySnapshot) => {
      const staffs = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        _ref: doc.ref,
      }));
      dispatch(setStaffs(staffs));
    },
    (err: any) => handleHelperError("getStaffsSnapshot", err)
  );

// [Functions]
// F - Add staff.
export const addStaff = async (form: AddStaffForm) => {
  try {
    // Format data.
    let data: AddStaff = {
      email: form.email,
      password: form.password,
      role: form.role as StaffRole,
      displayName: form.displayName,
      phone_number: form.phone_number,
      add_by: form.add_by,
    };
    // Upload profile.
    if (form.photo)
      data.photoUrl = await uploadStaffProfile(form.photo, form.email);

    // Call function.
    await httpsCallable(Functions, "staffs-addStaff")(data);
  } catch (err: any) {
    handleHelperError("addStaff", err);
    throw new FormError(
      `Cannot add staff.${err instanceof FirebaseError && ` (${err.message})`}`
    );
  }
};

// F - Edit staff.
export const editStaff = async (form: EditStaffForm, staff: Staff) => {
  try {
    // Format changes.
    const changes: EditStaff = {};
    for (let attribute in form) {
      switch (attribute) {
        case "new_password":
          if (form[attribute]) changes[attribute] = form[attribute];
          break;
        case "confirm_password":
          break;
        case "photo":
          // Upload new profile.
          const file = form[attribute];
          if (file)
            changes.photoUrl = await uploadStaffProfile(file, staff.email);
          break;
        default:
          if (form[attribute] !== staff[attribute])
            changes[attribute] = form[attribute] as string | boolean;
          break;
      }
    }
    // CASE: there is no changes.
    // DO: return;
    if (Object.keys(changes).length === 0) return;

    // Call function.
    changes.target_email = staff.email;
    await httpsCallable(Functions, "staffs-editStaff")(changes);
  } catch (err: any) {
    handleHelperError("editStaff", err);
    throw new FormError(
      `Cannot edit staff.${err instanceof FirebaseError && ` (${err.message})`}`
    );
  }
};
