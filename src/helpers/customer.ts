import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  onSnapshot,
  query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Firestore } from "../utils/firebase";
import { setCustomers } from "../redux/customers";
import { AppDispatch } from "../redux/store";
import { Car, CarWithRef } from "../types/car";
import {
  Customer,
  CustomerWithCarRef,
  CustomerWithRef,
} from "../types/customer";
import { getUpdateTime } from "../utils/datetime";
import { handleHelperError } from "../utils/error";
import { customerCarsCollection } from "./car";

// [Customer Helpers]

// [Collections]
export const customerCollection = () =>
  collection(Firestore, "customers") as CollectionReference<Customer>;

// [Documents]
export const customerDocument = (uid: string) =>
  doc(Firestore, "customers", uid) as DocumentReference<Customer>;

// [Snapshots]
// S - Customers snapshot.
export const getCustomersSnapshot = (dispatch: AppDispatch) =>
  onSnapshot<Customer>(
    query<Customer>(customerCollection()),
    (querySnapshot) => {
      const customers = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        _ref: doc.ref,
      }));
      dispatch(setCustomers(customers));
    },
    (err) => handleHelperError("getCustomersSnapshot", err)
  );

// S - Customer snapshot.
export const useGetCustomerByUID = (uid: string) => {
  const [customer, setCustomer] = useState<CustomerWithRef | undefined>();
  const [cars, setCars] = useState<Array<CarWithRef>>([]);
  const [updateTime, setUpdateTime] = useState<string>("Updating...");

  // [Effects]
  // E - Fetch customer.
  useEffect(() => {
    (async () => {
      const unsub = onSnapshot<Customer>(
        customerDocument(uid),
        (snapshot) => {
          try {
            setCustomer(
              snapshot.exists()
                ? {
                    ...snapshot.data(),
                    _ref: snapshot.ref,
                  }
                : undefined
            );
          } catch (err: any) {
            setCustomer(undefined);
          } finally {
            setUpdateTime(getUpdateTime());
          }
        },
        (err) => handleHelperError("useGetCustomerByUID", err)
      );
      return unsub;
    })();
  }, [uid]);

  // E - Fetch cars.
  useEffect(() => {
    (async () => {
      if (customer?.uid) {
        const unsub = onSnapshot<Car>(
          query<Car>(customerCarsCollection(customer.uid)),
          (querySnapshot) => {
            const cars = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              _ref: doc.ref,
            }));
            setCars(cars);
            setUpdateTime(getUpdateTime());
          },
          (err) => handleHelperError("useGetCustomerByUID", err)
        );
        return unsub;
      }
    })();
  }, [customer?.uid]);

  return {
    customer: customer
      ? ({ ...customer, cars: cars } as CustomerWithCarRef)
      : undefined,
    updateTime,
  };
};
