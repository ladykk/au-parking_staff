import { onValue, ref, set } from "firebase/database";
import { onSnapshot } from "firebase/firestore";
import { useEffect, useState } from "react";
import { RTDatabase } from "../utils/firebase";
import { NodeInfo, Node, SettingsInfo, SettingsForm } from "../types/setting";
import { Transaction, TransactionWithRef } from "../types/transaction";
import { getUpdateTime } from "../utils/datetime";
import { handleHelperError } from "../utils/error";
import { transactionDocument } from "./transaction";

// [Snapshots]
// S - Setting info.
export const useSettingsInfo = () => {
  const [info, setInfo] = useState<SettingsInfo | undefined>();
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const snapshot = onValue(ref(RTDatabase, "settings"), (snapshot) => {
        const data: SettingsInfo = snapshot.val();
        setInfo(data);
        setLoading(false);
      });
      return snapshot;
    })();
  }, []);

  return { info, isLoading };
};

// S - Node info.
export const useNodeInfo = (node: Node) => {
  const [info, setInfo] = useState<NodeInfo | undefined>();
  const [updateTime, setUpdatetime] = useState<string>("Updating...");
  const [isLoading, setLoading] = useState<boolean>(true);
  const [transaction, setTransaction] = useState<
    TransactionWithRef | undefined
  >();

  useEffect(() => {
    (async () => {
      if (node) {
        const snapshot = onValue(
          ref(RTDatabase, node.toLowerCase()),
          (snapshot) => {
            const data: NodeInfo = {
              node: node,
              ...snapshot.val(),
            };
            setInfo(data);
            setLoading(false);
          }
        );
        setUpdatetime(getUpdateTime());
        return snapshot;
      }
    })();
  }, [node]);

  useEffect(() => {
    (async () => {
      switch (info?.state.status.current_state) {
        case "failed":
        case "get":
        case "payment":
        case "success":
          if (info.state.status.info.tid) {
            const unsub = onSnapshot<Transaction>(
              transactionDocument(info.state.status.info.tid),
              (snapshot) => {
                try {
                  setLoading(true);
                  setTransaction(
                    snapshot.exists()
                      ? { ...snapshot.data(), _ref: snapshot.ref }
                      : undefined
                  );
                } catch (err: any) {
                  setTransaction(undefined);
                } finally {
                  setLoading(false);
                }
              },
              (err) => handleHelperError("useNodeInfo", err)
            );
            setUpdatetime(getUpdateTime());
            return unsub;
          } else {
            setTransaction(undefined);
          }
          break;
        default:
          setTransaction(undefined);
      }
    })();
  }, [info]);

  return { info, isLoading, transaction, updateTime };
};

// [Functions]
// F - Control Barricade.
export const controlBarricade = async (
  node: Node,
  option: "open" | "close"
) => {
  await set(
    ref(RTDatabase, `${node.toLowerCase()}/controller/command`),
    `${option}_barricade`
  ).catch((err) => {
    handleHelperError("controlBarricade", err);
  });
};

// F - Set Hover Cms.
export const setHoverCms = async (node: Node, input: number) => {
  if (input <= 0) return;
  await set(
    ref(RTDatabase, `${node.toLowerCase()}/controller/command`),
    `set_hover_cms:${input}`
  ).catch((err) => {
    handleHelperError("setHoverCms", err);
  });
};

// F - Set Car Cms.
export const setCarCms = async (node: Node, input: number) => {
  if (input <= 0) return;
  await set(
    ref(RTDatabase, `${node.toLowerCase()}/controller/command`),
    `set_car_cms:${input}`
  ).catch((err) => {
    handleHelperError("setCarCms", err);
  });
};

// F - Clear License Number.
export const clearLicenseNumber = async (node: Node) => {
  await set(
    ref(RTDatabase, `${node.toLowerCase()}/alpr/command`),
    `clear`
  ).catch((err) => {
    handleHelperError("clearLicenseNumber", err);
  });
};

// F - Set Settings.
export const setSettings = async (form: SettingsForm) => {
  await set(ref(RTDatabase, "settings"), form).catch((err) => {
    handleHelperError("setSettings", err);
  });
};

// F - Set Entrance Process
export const setEntranceProcess = async (license_number: string) => {
  await set(
    ref(RTDatabase, "entrance/state/command"),
    `set_process:${license_number}`
  ).catch((err) => handleHelperError("setEntranceProcess", err));
};

// F - Set Exit Get
export const setExitGet = async (tid: string, license_number: string) => {
  await set(
    ref(RTDatabase, "exit/state/command"),
    `set_get:${tid},${license_number}`
  ).catch((err) => handleHelperError("setExitProcess", err));
};

// F - Set State Initial
export const setStateInitial = async (node: Node) => {
  await set(
    ref(RTDatabase, `${node.toLowerCase()}/state/command`),
    "set_idle"
  ).catch((err) => handleHelperError("setStateInitial", err));
};
