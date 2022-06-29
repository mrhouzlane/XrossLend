import "../polyfill";

import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { HashRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import { RecoilRoot } from "recoil";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ChakraProvider>
      <RecoilRoot>
        <HashRouter>
          <App />
        </HashRouter>
      </RecoilRoot>
    </ChakraProvider>
  </React.StrictMode>
);

reportWebVitals();
