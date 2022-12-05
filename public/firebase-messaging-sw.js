/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.2.0/firebase-messaging-compat.js"
);

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
  apiKey: "AIzaSyAvG93gN6SFwfqVb_w8L5zILklrpVF9J2U",
  authDomain: "au-parking.firebaseapp.com",
  databaseURL:
    "https://au-parking-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "au-parking",
  storageBucket: "au-parking.appspot.com",
  messagingSenderId: "655310230312",
  appId: "1:655310230312:web:cc75927dc12e9192e9f61d",
  measurementId: "G-MLMRGNBV4X",
});

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const isSupported = firebase.messaging.isSupported();
if (isSupported) {
  const messaging = firebase.messaging();
  messaging.onBackgroundMessage((payload) => {
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
      body: payload.notification.body,
      icon: "/logo512.png",
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
  });
}
