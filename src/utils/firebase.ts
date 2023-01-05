import { FirebaseOptions, initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
import { getFunctions } from "firebase/functions";
import { FormError, handleHelperError } from "./error";
import { ref, uploadBytes, getDownloadURL, getStorage } from "firebase/storage";
import { getUpdateTime, inputToMoment, momentToUploadString } from "./datetime";
import FileResizer from "react-image-file-resizer";
import { SendImage } from "../types/chat";

// Client Configuration.
const FIREBASE_CONFIG: FirebaseOptions = {
  apiKey: "AIzaSyAvG93gN6SFwfqVb_w8L5zILklrpVF9J2U",
  authDomain: "au-parking.firebaseapp.com",
  databaseURL:
    "https://au-parking-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "au-parking",
  storageBucket: "au-parking.appspot.com",
  messagingSenderId: "655310230312",
  appId: "1:655310230312:web:cc75927dc12e9192e9f61d",
  measurementId: "G-MLMRGNBV4X",
};

// Initialize App.
const App = initializeApp(FIREBASE_CONFIG);

// Export Services.
export const Authentication = getAuth(App);
export const Firestore = getFirestore(App);
export const RTDatabase = getDatabase(App);
export const Functions = getFunctions(App, "asia-southeast2");
export const Storage = getStorage(App);

// Functions
export const uploadStaffProfile = async (
  file: File,
  email: string
): Promise<string> => {
  const extension = file.name.split(".").pop();
  const metadata = {
    contentType: file.type,
  };
  const photoRef = ref(Storage, `/staffs/${email}/profile.${extension}`);
  const snapshot = await uploadBytes(photoRef, file, metadata).catch((err) => {
    throw new FormError({ photo: "Cannot upload the photo." });
  });
  return await getDownloadURL(snapshot.ref);
};

export const uploadTransactionImage = async (
  file: File,
  license_number: string,
  timestamp: string,
  type: "in" | "out"
): Promise<string | undefined> => {
  const extension = file.name.split(".").pop();
  const metadata = {
    contentType: file.type,
  };
  const moment = inputToMoment(timestamp);
  if (!moment) return undefined;
  const photoRef = ref(
    Storage,
    `/transactions/${moment.format(
      "YYYY-MM-DD"
    )}/${type}/${momentToUploadString(moment)}_${license_number}.${extension}`
  );
  const snapshot = await uploadBytes(photoRef, file, metadata).catch((err) => {
    handleHelperError("uploadTransactionImage", err);
    throw new FormError({
      [`timestamp_${type}`]: `Cannot upload timestamp ${type}'s photo.`,
    });
  });
  return await getDownloadURL(snapshot.ref);
};

export const uploadReportImage = async (
  rid: string,
  file: File
): Promise<SendImage> => {
  // Create preview.
  let preview = await new Promise<File>((resolve) => {
    try {
      FileResizer.imageFileResizer(
        file,
        800,
        800,
        "JPEG",
        100,
        0,
        (resizeImage) => {
          resolve(resizeImage as File);
        },
        "file"
      );
    } catch (err: any) {
      console.error(err);
      throw new Error("Cannot create preview image.");
    }
  });

  // Format refs.
  const name = `${getUpdateTime()}-${file.name}`;
  const photoRef = ref(Storage, `/reports/${rid}/${name}`);
  const previewPhotoRef = ref(Storage, `/reports/${rid}/preview-${name}`);

  // Upload photos.
  const snapshot = await uploadBytes(photoRef, file).catch((err) => {
    handleHelperError("uploadReportImage", err);
    throw new Error("Cannot upload image.");
  });
  const previewSnapshot = await uploadBytes(previewPhotoRef, preview).catch(
    (err) => {
      handleHelperError("uploadReportImage", err);
      throw new Error("Cannot upload image.");
    }
  );

  return {
    originalContentUrl: await getDownloadURL(snapshot.ref),
    previewImageUrl: await getDownloadURL(previewSnapshot.ref),
  };
};
