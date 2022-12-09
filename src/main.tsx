import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import MyApp from "./app";
import { AuthProvider } from "./contexts/auth";
import store from "./redux/store";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <MyApp />
      </AuthProvider>
    </Provider>
  </React.StrictMode>
);

serviceWorkerRegistration.register();
