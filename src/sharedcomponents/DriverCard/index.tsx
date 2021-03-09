import { observer } from "mobx-react";
import { useContextRootStore } from "../../store/store";

const DriverCard = observer(({ driverId }: { driverId: string }) => {
  const { cardHandler, drivers } = useContextRootStore().rootStore;
  const {
    car_mark,
    car_model,
    car_color,
    car_number,
    driver_name,
    driver_phone,
    address,
    distance
  } = drivers[driverId];

  return (
    <div className="card mb-3 w-100" onClick={cardHandler} id={driverId} style={{ cursor: "pointer" }}>
      <div className="card-header">{`${car_mark} ${car_model} ${car_color} ${car_number}`}</div>
      <div className="card-body">
        <h5 className="card-title">{`${driver_name}`}</h5>
        <h6 className="card-subtitle mb-2 text-muted">{`${driver_phone}`}</h6>
        <h6 className="card-subtitle mb-2 text-muted">{`Сейчас находится: ${address}`}</h6>
      </div>
      <div className="card-footer text-muted">{`Расстояние: ${distance} м`}</div>
    </div>
  );
});

export default DriverCard;
