import { FirebaseError } from "firebase/app";
import {
  onSnapshot,
  query,
  collection,
  doc,
  setDoc,
  DocumentData,
  deleteDoc,
  DocumentReference,
  CollectionReference,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Firestore } from "../utils/firebase";
import { setCars } from "../redux/cars";
import { AppDispatch } from "../redux/store";
import { Car, CarWithRef } from "../types/car";
import { isThaiLicenseNumber, keyOfLicenseNumber } from "../utils/car";
import { FormError, handleHelperError } from "../utils/error";

// [Car Helpers]

// [Collections]
export const customerCarsCollection = (uid: string) =>
  collection(Firestore, "customers", uid, "cars") as CollectionReference<Car>;

// [Snapshots]
// S - Cutsomer's cars snapshot by UID.
export const useCustomerCarSnapshotByUID = (uid: string) => {
  const [cars, setCars] = useState<Array<CarWithRef>>([]);
  useEffect(() => {
    (async () => {
      const snapshot = onSnapshot<Car>(
        query<Car>(customerCarsCollection(uid)),
        (querySnapshot) => {
          const cars: Array<CarWithRef> = querySnapshot.docs.map((doc) => ({
            ...doc.data(),
            _ref: doc.ref,
          }));
          setCars(cars);
        },
        (err) => handleHelperError("getCustomerCarSanpshotByUid", err)
      );
      return snapshot;
    })();
  }, [uid]);
  return cars;
};

// [Functions]
// F - Add car
export const addCar = async (
  form: Car,
  uid: string | undefined,
  cars: Array<CarWithRef>
) => {
  if (typeof uid === "undefined") {
    throw new FormError({ form: "Cannot detect user acccount." });
  }
  // Check is license number is valid.
  if (!isThaiLicenseNumber(form.license_number)) {
    throw new FormError({
      license_number: "Please enter valid license number.",
    });
  }
  // Check if duplicate key.
  const key = keyOfLicenseNumber(form.license_number);
  if (cars.some((car) => keyOfLicenseNumber(car._ref.id as string) === key)) {
    throw new FormError({
      license_number: "This license number already added.",
    });
  }
  const carRef = doc(Firestore, "customers", uid, "cars", key);
  await setDoc(carRef, form)
    .then(() => {
      return;
    })
    .catch((err) => {
      handleHelperError("addCar", err);
      throw new FormError({
        form: `Cannot add car.${
          err instanceof FirebaseError ? ` (${err.message})` : ""
        })`,
      });
    });
};

export const deleteCar = async (ref: DocumentReference<DocumentData>) => {
  await deleteDoc(ref);
};
