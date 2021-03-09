import React from "react";
import ReactDOM from "react-dom";

import FirstHelp from "./components/FirstHelp";
import PageTemplate from "./components/PageTemplate";
import OrderComplite from "./components/OrderComplite";

const App = () => {
  return (
    <React.Fragment>
      <OrderComplite />
      <FirstHelp />
      <PageTemplate />
    </React.Fragment>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
