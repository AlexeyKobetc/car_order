import { observer } from "mobx-react";
import DriverCard from "../../sharedcomponents/DriverCard";
import { useContextRootStore } from "../../store/store";

const CarsComponet = observer(() => {
  const { drivers, getYmCarsSortedIDs } = useContextRootStore().rootStore;

  return (
    <div
      className="col-12 col-sm-4 col-md-3 d-flex flex-column justify-content-start align-items-center"
      style={{ minHeight: "60vh" }}
    >
      {getYmCarsSortedIDs.length
        ? getYmCarsSortedIDs.map(index => {
            const { carId } = index;
            return <DriverCard driverId={carId} key={`${carId}__${index}`} />;
          })
        : Object.keys(drivers).map((driverId: string, index: number) => {
            return <DriverCard driverId={driverId} key={`${driverId}__${index}`} />;
          })}
    </div>
  );
});

export default CarsComponet;
