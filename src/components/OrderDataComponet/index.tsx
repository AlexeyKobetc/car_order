import { observer } from "mobx-react";
import React from "react";
import DriverCard from "../../sharedcomponents/DriverCard";
import Input from "../../sharedcomponents/Input";
import { useContextRootStore } from "../../store/store";

const OrderDataComponet = observer(() => {
  const { getActiveDriver } = useContextRootStore().rootStore;

  return (
    <React.Fragment>
      <div className="col-12 col-sm-11 mt-2 mb-2">
        <Input name={"inputAddress"} />
      </div>
      <div className="col-12 col-sm-11 mt-2 mb-2">
        <Input name={"destinationAddress"} />
      </div>
      <div className="col-12 col-sm-11 mt-2 mb-2">
        <Input name={"inputName"} />
      </div>

      <div className="col-12 col-sm-11 mt-2 mb-2">
        <Input name={"inputPhone"} />
      </div>
      <div className="col-12 col-sm-11 mt-2 mb-2">
        {getActiveDriver ? <DriverCard driverId={getActiveDriver} /> : null}
      </div>
    </React.Fragment>
  );
});

export default OrderDataComponet;
