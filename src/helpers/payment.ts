import { FirebaseError } from "firebase/app";
import {
  collection,
  collectionGroup,
  DocumentData,
  onSnapshot,
  query,
  DocumentReference,
  updateDoc,
  where,
  orderBy,
  CollectionReference,
  Query,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Firestore } from "../utils/firebase";
import { Payment, PaymentStatus, PaymentWithRef } from "../types/payment";
import { getUpdateTime } from "../utils/datetime";
import { handleHelperError } from "../utils/error";

// [Collections]
export const transactionPaymentCollection = (tid: string) =>
  collection(
    Firestore,
    "transactions",
    tid,
    "payments"
  ) as CollectionReference<Payment>;

export const paymentsCollection = () =>
  collectionGroup(Firestore, "payments") as Query<Payment>;

// S - Pending Payment Snapshot.
export const useGetPendingPayment = () => {
  const [payments, setPayments] = useState<Array<PaymentWithRef>>([]);
  const [updateTime, setUpdateTime] = useState<string>("Updating...");

  // [Effects]
  // E - Fetch pending payments.
  useEffect(() => {
    (async () => {
      const unsub = onSnapshot<Payment>(
        query<Payment>(
          paymentsCollection(),
          where("status", "==", "Pending"),
          orderBy("timestamp", "desc")
        ),
        (snapshot) => {
          const payments = snapshot.docs.map((doc) => ({
            ...doc.data(),
            _ref: doc.ref,
          }));
          setPayments(payments);
          setUpdateTime(getUpdateTime());
        },
        (err) => handleHelperError("useGetPendingPayments", err)
      );
      return unsub;
    })();
  }, []);

  return { payments, updateTime };
};

// [Functions]
// F - Update payment.
export const updatePayment = async (
  ref: DocumentReference<DocumentData>,
  to: PaymentStatus
) => {
  await updateDoc(ref, { status: to, is_edit: true }).catch((err) => {
    handleHelperError("updatePayment", err);
    throw new Error(
      `Cannot update payment.${
        err instanceof FirebaseError ? ` (${err.message})` : ""
      })`
    );
  });
};
