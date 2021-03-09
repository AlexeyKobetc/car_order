import { action, computed, makeObservable, observable, reaction, runInAction } from "mobx";
import { IDriver, IDrivers, IOrderForm, TDrivers } from "../sharedcomponents/interfaces";
import ButtonsStore from "./ButtonStore";
import DriversStore from "./DriversStore";

import InputsStore from "./InputsStore";
import YandexMapsStore from "./YandexMapsStore";

class RootStore {
  inputsStore = new InputsStore();
  buttonStore = new ButtonsStore();
  driversStore = new DriversStore();
  yandexMapsStore = new YandexMapsStore();

  orderData: IOrderForm = {
    orderId: "",
    orderTime: "",
    clientName: "",
    clientContacts: "",
    sourceAddress: "",
    sourceCoordinates: { latitude: 0, longitude: 0 },
    destinationAddress: "",
    destinationCoordinates: { latitude: 0, longitude: 0 },
    selectDriver: {
      car_mark: "",
      car_model: "",
      car_color: "",
      car_number: "",
      driver_name: "",
      driver_phone: "",
      lat: 0,
      lon: 0,
      distance: 0,
      address: "",
      isActive: true
    }
  };
  isOrderComplite = false;

  constructor() {
    makeObservable(this, {
      orderData: observable,
      isOrderComplite: observable,
      getOrderData: computed,
      getIsOrderComplite: computed,
      setIsOrderComplite: action,

      getIsAllInputsValid: computed,

      inputs: computed,
      buttons: computed,
      drivers: computed,

      getActiveDriver: computed,

      getYmCarsSortedIDs: computed,

      inputsHandler: action,
      buttonsHandler: action,

      setYmContainer: action,
      getisYmReady: computed
    });

    reaction(
      () => this.yandexMapsStore.isYmReady,
      () => {
        this.yandexMapsStore.createDriversOnMap(this.drivers);
      }
    );

    reaction(
      () => this.yandexMapsStore.getYmCarsProps,
      getYmCarsProps => {
        Object.keys(getYmCarsProps).forEach((driverId: string) => {
          const { latitude, longitude, distance, address } = getYmCarsProps[driverId];

          this.driversStore.setDriversProps(driverId, { latitude, longitude }, distance, address);
        });

        this.driversStore.setActiveDriver(this.getYmCarsSortedIDs[0].carId);
      }
    );

    reaction(
      () => this.yandexMapsStore.getUserCurrentAddress,
      getUserCurrentAddress => {
        this.inputsStore.setInputValue("inputAddress", getUserCurrentAddress.fullAddress, true);
      }
    );

    reaction(
      () => this.yandexMapsStore.getDestinationCurrentAddress,
      getDestinationCurrentAddress => {
        this.inputsStore.setInputValue("destinationAddress", getDestinationCurrentAddress.fullAddress, true);
      }
    );

    reaction(
      () => this.inputsStore.isAllInputsValid,
      () => {
        this.buttonStore.setButtonsDisabled("ok", !this.inputsStore.isAllInputsValid);
      }
    );
  }

  setIsOrderComplite = (isComplite: boolean) => {
    this.isOrderComplite = isComplite;
  };

  get getYmCarsSortedIDs() {
    return this.yandexMapsStore.ymCarsSortedIDs;
  }

  get getIsAllInputsValid() {
    return this.inputsStore.getIsAllInputsValid;
  }

  get getOrderData() {
    return this.orderData;
  }

  get getIsOrderComplite() {
    return this.isOrderComplite;
  }

  get getisYmReady() {
    return this.yandexMapsStore.isYmReady;
  }

  get inputs() {
    return this.inputsStore.getInputs;
  }

  get buttons() {
    return this.buttonStore.getButtons;
  }

  get drivers() {
    return this.driversStore.getDrivers;
  }

  get getActiveDriver() {
    return this.driversStore.getActiveDriver;
  }

  setYmContainer = (mapDivContainer: HTMLDivElement) => {
    this.yandexMapsStore.setYmContainer(mapDivContainer);
  };

  cardHandler = (event: React.MouseEvent<HTMLDivElement>) => {
    const { currentTarget } = event;
    const { id } = currentTarget;

    this.driversStore.setActiveDriver(id);
  };

  buttonsHandler = (event: React.MouseEvent<HTMLButtonElement>) => {
    const { currentTarget } = event;
    const { name } = currentTarget;
    const { resetInputsValues, isInputsValid } = this.inputsStore;

    if (name === "ok") {
      this.buttonStore.setButtonsDisabled("ok", !this.inputsStore.isAllInputsValid);
      if (isInputsValid() && this.driversStore.getActiveDriver !== "") {
        const date = new Date();
        const orderId = "" + date.getTime();
        const { inputName, inputPhone } = this.inputsStore.getInputs;
        const orderTime =
          date.getFullYear() +
          ("" + date.getMonth()).padStart(2, "0") +
          ("" + date.getDate()).padStart(2, "0") +
          ("" + date.getHours()).padStart(2, "0") +
          ("" + date.getMinutes()).padStart(2, "0") +
          ("" + date.getSeconds()).padStart(2, "0");

        const {
          car_mark,
          car_model,
          car_color,
          car_number,
          driver_name,
          driver_phone,
          lat,
          lon,
          distance,
          address,
          isActive
        } = this.drivers[this.getActiveDriver];

        runInAction(() => {
          this.orderData = {
            orderId: orderId,
            orderTime: orderTime,
            clientName: inputName.value,
            clientContacts: inputPhone.value,
            sourceAddress: this.yandexMapsStore.getUserCurrentAddress.fullAddress,
            sourceCoordinates: {
              latitude: this.yandexMapsStore.getUserCurrentCoords.latitude,
              longitude: this.yandexMapsStore.getUserCurrentCoords.longitude
            },
            destinationAddress: this.yandexMapsStore.getDestinationCurrentAddress.fullAddress,
            destinationCoordinates: {
              latitude: this.yandexMapsStore.getDestinationCurrentCoords.latitude,
              longitude: this.yandexMapsStore.getDestinationCurrentCoords.longitude
            },
            selectDriver: {
              car_mark,
              car_model,
              car_color,
              car_number,
              driver_name,
              driver_phone,
              lat,
              lon,
              distance,
              address,
              isActive
            }
          };
        });

        this.setIsOrderComplite(true);

        resetInputsValues();
      }
    }
  };

  inputsHandler = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { type, currentTarget } = event;
    const { name, value } = currentTarget;
    const { maxLen, regEx, isYandex } = this.inputs[name];
    const { setInputValue } = this.inputsStore;

    const isInputValueRegExpValid =
      regEx?.reduce((isValid: boolean, reg: RegExp) => {
        return isValid || reg.test(value.trim());
      }, false) || false;

    const checkAddresFromValue = (inputName: string, value: string, isBlur: boolean = false) => {
      const checkAddress = (geoData: any, inputName: string) => {
        const geoObject = geoData.geoObjects.get(0);
        const geoObjectAddress = geoObject.properties.getAll();
        const { text } = geoObjectAddress;
        const geoObjectCoordinates = geoObject.geometry.getCoordinates();

        if (geoObject) {
          let precision = geoObject.properties.get("metaDataProperty.GeocoderMetaData.precision");

          if (precision === "other") {
            this.inputsStore.setIsValidInput(inputName, false);
          } else {
            this.inputsStore.setIsValidInput(inputName, true);
            if (isBlur) {
              setInputValue(inputName, text, true);

              inputName === "inputAddress" &&
                this.yandexMapsStore.setUserPosition(
                  { latitude: geoObjectCoordinates[0], longitude: geoObjectCoordinates[1] },
                  geoObjectAddress
                );
              inputName === "destinationAddress" &&
                this.yandexMapsStore.setDestinationPosition(
                  { latitude: geoObjectCoordinates[0], longitude: geoObjectCoordinates[1] },
                  geoObjectAddress
                );
            }
          }
        }
      };

      if (inputName === "inputAddress") {
        this.yandexMapsStore
          .isAddressUserValid(value)
          .then((geoData: any) => {
            checkAddress(geoData, inputName);
          })
          .catch((error: Error) => console.log(error.message));
      } else if (inputName === "destinationAddress") {
        this.yandexMapsStore
          .isAddressDestinationValid(value)
          .then((geoData: any) => {
            checkAddress(geoData, inputName);
          })
          .catch((error: Error) => console.log(error.message));
      }
    };

    if (type === "change") {
      if (value.trim().length < (maxLen || 150)) {
        setInputValue(name, value, isInputValueRegExpValid);
        if (isYandex) checkAddresFromValue(name, value);
      }
    }

    if (type === "blur") {
      if (isYandex) {
        checkAddresFromValue(name, value, true);
      }
    }
  };
}

export default RootStore;
