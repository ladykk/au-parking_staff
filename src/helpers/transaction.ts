import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  onSnapshot,
  orderBy,
  query,
  setDoc,
  updateDoc,
  where,
} from "firebase/firestore";
import { Moment } from "moment";
import { useEffect, useState } from "react";
import { Firestore } from "../utils/firebase";
import { setTransactions } from "../redux/transactions";
import { AppDispatch } from "../redux/store";
import { Payment, PaymentWithRef } from "../types/payment";
import {
  AddTransactionForm,
  EditTransaction,
  EditTransactionForm,
  NewTransaction,
  Transaction,
  TransactionWithRef,
} from "../types/transaction";
import { isThaiLicenseNumber, keyOfLicenseNumber } from "../utils/car";
import {
  getUpdateTime,
  inputToMoment,
  inputToTimestamp,
  timestampToMoment,
} from "../utils/datetime";
import { FormError, handleHelperError } from "../utils/error";
import { uploadTransactionImage } from "../utils/firebase";
import { isValidTimestamp } from "../utils/transaction";
import { transactionPaymentCollection } from "./payment";
import { setEntranceProcess } from "./setting";

// [Transaction Helpers]

// [Collections]
export const transactionCollection = () =>
  collection(Firestore, "transactions") as CollectionReference<Transaction>;

// [Documents]
export const transactionDocument = (tid: string) =>
  doc(Firestore, "transactions", tid) as DocumentReference<Transaction>;

// [Snapshots]
// S - Transactions snapshot.
export const getTransactionsSnapshot = (dispatch: AppDispatch) =>
  onSnapshot<Transaction>(
    query<Transaction>(
      transactionCollection(),
      orderBy("timestamp_in", "desc")
    ),
    (querySnapshot) => {
      const transactions = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        _ref: doc.ref,
      }));
      dispatch(setTransactions(transactions));
    },
    (err) => handleHelperError("getTransactionsSnapshot", err)
  );

// S - Transaction snapshot
export const useGetTransaction = (tid: string, model: "Staff" | "Customer") => {
  const [transaction, setTransaction] = useState<
    TransactionWithRef | undefined
  >();
  const [payments, setPayments] = useState<Array<PaymentWithRef>>([]);
  const [updateTime, setUpdateTime] = useState<string>("Updating...");

  // [Effects]
  // E - Fetch transaction.
  useEffect(() => {
    (async () => {
      const unsub = onSnapshot<Transaction>(
        transactionDocument(tid),
        (snapshot) => {
          try {
            setTransaction(
              snapshot.exists()
                ? { ...snapshot.data(), _ref: snapshot.ref }
                : undefined
            );
          } catch (err: any) {
            setTransaction(undefined);
          } finally {
            setUpdateTime(getUpdateTime());
          }
        },
        (err) => handleHelperError("useGetTransaction", err)
      );
      return unsub;
    })();
  }, [tid, model]);

  // E - Fetch payments.
  useEffect(() => {
    (async () => {
      if (transaction?.tid) {
        const unsub = onSnapshot<Payment>(
          query<Payment>(
            transactionPaymentCollection(transaction.tid),
            orderBy("timestamp", "desc")
          ),
          (querySnapshot) => {
            const payments = querySnapshot.docs.map((doc) => ({
              ...doc.data(),
              _ref: doc.ref,
            }));
            setPayments(payments);
            setUpdateTime(getUpdateTime());
          },
          (err) => handleHelperError("getTransactionPaymentsSnapshot", err)
        );

        return unsub;
      }
    })();
  }, [transaction?.tid, model]);

  return {
    transaction: transaction
      ? { ...transaction, payments: payments }
      : undefined,
    updateTime,
  };
};

// [Functions]
// F - Add transaction.
export const addTransaction = async (
  form: AddTransactionForm,
  transactions: Array<TransactionWithRef>
) => {
  // Validate
  // CASE: license number is invalid.
  // DO: throw form error.
  if (!isThaiLicenseNumber(form.license_number))
    throw new FormError({ license_number: "Invalid license number." });
  // CASE: not detect add staff.
  // DO: throw form error.
  if (!form.add_by) throw new FormError({ form: "Cannot detect staff." });

  // Format data.
  const license_number = keyOfLicenseNumber(form.license_number);
  let transaction: NewTransaction = {
    license_number: license_number,
    timestamp_in: inputToTimestamp(form.timestamp_in),
    add_by: form.add_by as string,
  };
  // Check if exists.
  const in_system_transactions = transactions.filter(
    (transaction) => transaction.timestamp_out === null
  );
  if (
    in_system_transactions.some(
      (transaction) => transaction.license_number === license_number
    )
  )
    throw new FormError({
      license_number: "This license number is now in the system.",
    });

  // CASE: not mannual add.
  // DO: set entrance process and return.
  if (!form.mannual) {
    await setEntranceProcess(transaction.license_number);
    return;
  }

  // CASE: have image_in.
  // DO: upload image and assign path.
  if (form.image_in) {
    transaction.image_in = await uploadTransactionImage(
      form.image_in,
      form.license_number,
      form.timestamp_in,
      "in"
    );
  }

  // Add transaction.
  await addDoc(collection(Firestore, "transactions"), transaction).catch(
    (err) => {
      handleHelperError("addTransaction", err);
      throw new FormError({
        form: `Cannot add transaction.${
          err instanceof FirebaseError ? ` (${err.message})` : ""
        })`,
      });
    }
  );
};

// F - Edit transaction.
export const editTransaction = async (
  form: EditTransactionForm,
  transaction: TransactionWithRef
) => {
  // Validate

  // Format data
  const changes: EditTransaction = {};
  for (let attribute in form) {
    switch (attribute) {
      case "image_in":
      case "image_out":
        const file = form[attribute];
        if (file) {
          changes[attribute] = await uploadTransactionImage(
            file,
            transaction.tid,
            form[attribute === "image_in" ? "timestamp_in" : "timestamp_out"],
            attribute === "image_in" ? "in" : "out"
          );
        }
        break;
      case "timestamp_in":
      case "timestamp_out":
        const timestamp_form = inputToMoment(form[attribute]);
        const timestamp_transaction = timestampToMoment(transaction[attribute]);
        if (!timestamp_form) break;
        if (
          (timestamp_transaction &&
            !timestamp_form.isSame(timestamp_transaction)) ||
          (!timestamp_transaction &&
            attribute === "timestamp_out" &&
            timestamp_form)
        ) {
          changes[attribute] = inputToTimestamp(form[attribute]);
        }
        break;
      case "license_number":
        if (form[attribute] !== transaction[attribute]) {
          changes[attribute] = keyOfLicenseNumber(form[attribute]);
        }
        break;
      default:
        if (form[attribute] !== transaction[attribute]) {
          changes[attribute] = form[attribute] as string;
        }
    }
  }
  // CASE: no changes.
  // DO: return.
  if (Object.keys(changes).length === 0) return;

  // Validate
  // -> timestamp_in and timestamp_out
  if (changes.timestamp_in && changes.timestamp_out) {
    if (!isValidTimestamp(changes.timestamp_in, changes.timestamp_out))
      throw new FormError({
        timestamp_out: "Timestamp out is before timestamp in.",
      });
  }
  // -> timestamp_in
  else if (changes.timestamp_in) {
    if (!isValidTimestamp(changes.timestamp_in))
      throw new FormError({
        timestamp_in: "Timestamp in is after timestamp now.",
      });
  }
  // -> timestamp_out
  else if (changes.timestamp_out) {
    if (
      !isValidTimestamp(
        inputToTimestamp(form.timestamp_in),
        changes.timestamp_out
      )
    )
      throw new FormError({
        timestamp_out: "Timestamp out is before timestamp in.",
      });
  }

  // Update transaction.
  if (changes && transaction._ref) {
    await updateDoc(transaction._ref, { ...changes, is_edit: true }).catch(
      (err) => {
        handleHelperError("editTransaction", err);
        throw new FormError({
          form: `Cannot update transaction.${
            err instanceof FirebaseError ? ` (${err.message})` : ""
          })`,
        });
      }
    );
  }
};

// F - Cancel transaction.
export const cancelTransaction = async (tid: string) => {
  // Cancel transaction.
  await setDoc(
    doc(Firestore, "transactions", tid),
    { is_cancel: true, is_edit: true },
    { merge: true }
  ).catch((err) => {
    handleHelperError("cancelTransaction", err);
    throw new FormError({
      form: `Cannot cancel the transaction.${
        err instanceof FirebaseError ? ` (${err.message})` : ""
      })`,
    });
  });
};
