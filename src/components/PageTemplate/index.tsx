import React from "react";
import CarsComponet from "../CarsComponent";
import MapComponent from "../MapComponent";
import OrderDataComponet from "../OrderDataComponet";
import SubmitButtonComponent from "../SubmitButtonComponent";

const rowStyles = "row d-flex flex-row flex-wrap justify-content-center align-items-stretch pt-2 pb-2";

const PageTemplate = () => {
  return (
    <div className="container-fluid">
      <div className={rowStyles}>
        <OrderDataComponet />
      </div>
      <div className={rowStyles}>
        <MapComponent />
        <CarsComponet />
      </div>
      <div className={rowStyles}>
        <SubmitButtonComponent />
      </div>
    </div>
  );
};

export default PageTemplate;
