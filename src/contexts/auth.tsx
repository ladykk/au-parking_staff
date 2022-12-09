import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useIdToken,
  useSignInWithEmailAndPassword,
  useSignOut,
} from "react-firebase-hooks/auth";
import { Authentication } from "../utils/firebase";
import { User } from "firebase/auth";
import { getCustomersSnapshot } from "../helpers/customer";
import { useAppDispatch } from "../redux/store";
import { getStaffsSnapshot } from "../helpers/staff";
import { FormError } from "../utils/error";
import { getTransactionsSnapshot } from "../helpers/transaction";
import { clearStaffs } from "../redux/staffs";
import { FirebaseError } from "firebase/app";
import { clearTransactions } from "../redux/transactions";
import { clearCustomers } from "../redux/customers";

// [Context]
interface AuthContextType {
  user?: User | null;
  isAdmin: boolean;
  loading: boolean;
  loadingInitial: boolean;
  error?: string;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);
const useAuth = () => useContext(AuthContext);
export default useAuth;

// [Provider]
export function AuthProvider({
  children,
}: {
  children: ReactNode;
}): JSX.Element {
  // [States]
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [loadingInitial, setLoadingInitial] = useState<boolean>(true);

  // [Hooks]
  const [signOut] = useSignOut(Authentication);
  const [user] = useIdToken(Authentication, {
    onUserChanged: async (user: User | null) => {
      try {
        // CASE: no user.
        // DO: throw no user.
        if (!user) {
          throw new Error();
        }

        // Check is staff.
        const { staff, admin } = (await user.getIdTokenResult()).claims;
        // CASE: is not a staff.
        // DO: sign out and throw unauthorized user.
        if (!staff) {
          await signOut();
          throw new Error("not a staff.");
        }

        // Set is_admin there is claim.
        setIsAdmin(typeof admin === "boolean" ? admin : false);
      } catch (err: any) {
        // CASE: no user or invalid credential
        // DO: reset auth values to default.
        setDefault();

        // CASE: error has message.
        // DO: set error.
        if (err instanceof FirebaseError && err.message) setError(err.message);
      } finally {
        setLoadingInitial(false);
      }
    },
  });
  const [signInWithEmailAndPassword, _, loading, authError] =
    useSignInWithEmailAndPassword(Authentication);
  const dispatch = useAppDispatch();

  // [Functions]
  // F - Set default.
  // DO: set default auth states.
  const setDefault = useCallback(() => {
    setIsAdmin(false);
    dispatch(clearStaffs());
    dispatch(clearTransactions());
    dispatch(clearCustomers());
  }, [dispatch]);

  // F - Login.
  // DO: login with email and password.
  const login = async (email: string, password: string) => {
    await signInWithEmailAndPassword(email, password);
    if (authError) {
      switch (authError.message) {
        case "Firebase: Error (auth/wrong-password).":
          throw new FormError({ form: "Email or password is incorrect." });
        case "Firebase: Error (auth/user-disabled).":
          throw new FormError({ form: "This account has been disabled." });
        default:
          throw new FormError({ form: authError.message });
      }
    }
  };

  // F - Logout.
  // DO: remove auth context.
  const logout = async () => await signOut();

  // [Effects]
  // E - Clear error.
  // DO: clear error when page changed.
  useEffect(() => {
    if (error) setError("");
  }, [location.pathname, error]);

  // E - Set snapshots.
  // DO: register snapshot when user sign in.
  useEffect(() => {
    // CASE: no user.
    // DO: reject.
    if (!user) return;

    // Register snapshots.
    // -> customers
    const customers_unsub = getCustomersSnapshot(dispatch);
    // -> staffs
    const staffs_unsub = getStaffsSnapshot(dispatch);
    // -> transactions
    const transactions_unsub = getTransactionsSnapshot(dispatch);

    // Return unsubscribers
    return () => {
      customers_unsub();
      staffs_unsub();
      transactions_unsub();
    };
  }, [user, dispatch]);

  // [Memos]
  const memoedValue = useMemo(
    () => ({
      user,
      isAdmin,
      loading,
      loadingInitial,
      error,
      login,
      logout,
    }),
    [user, isAdmin, loading, loadingInitial, error]
  );

  return (
    <AuthContext.Provider value={memoedValue}>{children}</AuthContext.Provider>
  );
}
