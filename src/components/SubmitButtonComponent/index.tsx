import React from "react";
import Button from "../../sharedcomponents/Button";

const SubmitButtonComponent = () => {
  return (
    <React.Fragment>
      <div className="col-12 col-sm-6 mt-4 mb-4 d-grid">
        <Button name={"ok"} dataBsToggle={"modal"} dataBsTarget={"#modal_order"} />
      </div>
      <div className="col-12 col-sm-6 mt-4 mb-4 d-grid">
        <Button name={"help"} dataBsToggle={"modal"} dataBsTarget={"#modal_help"} />
      </div>
    </React.Fragment>
  );
};

export default SubmitButtonComponent;
