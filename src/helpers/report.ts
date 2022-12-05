import { FirebaseError } from "firebase/app";
import {
  addDoc,
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  getDocs,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  updateDoc,
  where,
} from "firebase/firestore";
import { useEffect, useState } from "react";
import { Firestore } from "../utils/firebase";
import { setReports } from "../redux/reports";
import { AppDispatch } from "../redux/store";
import { Chat } from "../types/chat";
import { Customer } from "../types/customer";
import {
  CreateReport,
  CreateReportForm,
  Report,
  ReportWithRef,
} from "../types/report";
import { Transaction } from "../types/transaction";
import { getUpdateTime } from "../utils/datetime";
import { FormError, handleHelperError } from "../utils/error";
import { modelChat } from "./chat";

// [Report Helpers]

// [Collections]
export const reportCollection = () =>
  collection(Firestore, "reports") as CollectionReference<Report>;

// [Documents]
export const reportDocument = (rid: string) =>
  doc(Firestore, "reports", rid) as DocumentReference<Report>;

// [Snapshots]
// S - Reports snapshot
export const getReportsSnapshot = (dispatch: AppDispatch) =>
  onSnapshot<Report>(
    query<Report>(reportCollection(), orderBy("created_timestamp", "desc")),
    (querySnapshot) => {
      const reports = querySnapshot.docs.map((doc) => ({
        ...doc.data(),
        _ref: doc.ref,
      }));
      dispatch(setReports(reports));
    },
    (err) => handleHelperError("getReportsSnapshot", err)
  );

// S - Report snapshot by rid.
export const useGetReport = (rid: string, model: "Staff" | "Customer") => {
  const [report, setReport] = useState<ReportWithRef | undefined>();
  const [chats, setChats] = useState<Array<Chat>>([]);
  const [updateTime, setUpdateTime] = useState<string>("Updating...");

  // [Effects]
  // E - Fetch report.
  useEffect(() => {
    (async () => {
      const unsub = onSnapshot<Report>(
        reportDocument(rid),
        (snapshot) => {
          try {
            setReport(
              snapshot.exists()
                ? { ...snapshot.data(), _ref: snapshot.ref }
                : undefined
            );
          } catch (err) {
            setReport(undefined);
          } finally {
            setUpdateTime(getUpdateTime());
          }
        },
        (err) => handleHelperError("useGetReport", err)
      );
      return unsub;
    })();
  }, [rid, model]);

  // E - Fetch chats.
  useEffect(() => {
    (async () => {
      if (report?.rid && model === "Staff") {
        const unsub = onSnapshot(
          query(
            collection(Firestore, "reports", report.rid, "chats"),
            orderBy("timestamp", "asc")
          ),
          (querySnapshot) => {
            const chats = querySnapshot.docs.map((doc) => modelChat(doc));
            setChats(chats);
            setUpdateTime(getUpdateTime());
          },
          (err: any) => handleHelperError("useGetReport", err)
        );
        return unsub;
      }
    })();
  }, [report?.rid, model]);

  return { report, chats, updateTime };
};

// [Functions]
// F - Claim report.
export const claimReport = async (
  report: ReportWithRef,
  staff: string | undefined
) => {
  if (report._ref) {
    // CASE: new claim report.
    // DO: check whether customer already has open report.
    if (!report.staff && staff) {
      const reportSnapshots = await getDocs(
        query(
          collection(Firestore, "reports"),
          where("customer", "==", report.customer),
          where("status", "==", "Open")
        )
      );

      // CASE: have open report.
      // DO: throw error.
      if (reportSnapshots.size > 0) {
        throw new Error(
          "Customer already has an opened report. That report needed to be close or unclaim before claiming this report."
        );
      }
    }

    // Claim report.
    await updateDoc(report._ref, {
      staff: staff ? doc(Firestore, "staffs", staff) : null,
      is_edit: true,
    }).catch((err) => {
      handleHelperError("claimReport", err);
      throw new Error(
        `Cannot ${staff ? "claim" : "unclaim"} the report.${
          err instanceof FirebaseError ? ` (${err.message})` : ""
        }`
      );
    });
  }
};

// F - Close report.
export const closeReport = async (report: ReportWithRef, response: string) => {
  await updateDoc(report._ref, {
    response: response,
    closed_timestamp: serverTimestamp(),
    is_edit: true,
  }).catch((err) => {
    handleHelperError("claimReport", err);
    throw new Error(
      `Cannot close the report.${
        err instanceof FirebaseError ? ` (${err.message})` : ""
      }`
    );
  });
};
