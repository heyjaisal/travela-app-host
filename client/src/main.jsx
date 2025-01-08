import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "./index.css";
import App from "./App.jsx";
import "leaflet/dist/leaflet.css";
import {store,persistor} from './redux/Store.jsx'; 
import { Provider } from 'react-redux'; 
import { PersistGate } from 'redux-persist/integration/react';
import "react-toastify/dist/ReactToastify.css";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <App />
    </LocalizationProvider>
    </PersistGate>
    </Provider>
  </StrictMode>
);
