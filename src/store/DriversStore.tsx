import { action, computed, makeObservable, observable } from "mobx";
import { drivers } from "../sharedcomponents/initComponents";

class DriversStore {
  driversStore = drivers;
  constructor() {
    makeObservable(this, {
      driversStore: observable,

      setDriversProps: action,
      setActiveDriver: action,

      getDrivers: computed
    });
  }

  get getDrivers() {
    return this.driversStore;
  }

  get getActiveDriver() {
    let activeDriver: string = "";

    Object.keys(this.driversStore).forEach((driverId: string) => {
      if (this.driversStore[driverId].isActive) activeDriver = driverId;
    });

    return activeDriver;
  }

  setActiveDriver = (activeDriverId: string) => {
    Object.keys(this.driversStore).forEach((driverId: string) => {
      this.driversStore = {
        ...this.driversStore,
        [driverId]: {
          ...this.driversStore[driverId],
          isActive: activeDriverId === driverId
        }
      };
    });
  };

  setDriversProps = (
    driverId: string,
    coords: { latitude: number; longitude: number },
    distance: number,
    address: string
  ) => {
    const { latitude, longitude } = coords;
    this.driversStore = {
      ...this.driversStore,
      [driverId]: {
        ...this.driversStore[driverId],
        lat: latitude,
        lon: longitude,
        address,
        distance
      }
    };
  };
}

export default DriversStore;
