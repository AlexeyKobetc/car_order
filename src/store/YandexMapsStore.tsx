import { action, computed, makeObservable, observable } from "mobx";
import { IDrivers } from "../sharedcomponents/interfaces";

declare var ymaps: any;

type position = {
  latitude: number;
  longitude: number;
};

type address = {
  region: string;
  fullAddress: string;
  shortAddress: string;
};

type YMData = {
  defaultCoordinates: position;
  defaultAddress: address;
  userCoordinates: position;
  userAddress: address;
  clickCoordinates: position;
  clickAddress: address;
  destinationCoordinates: position;
  destinationAddress: address;
};

enum YmData {
  DEFAULT_ADDRESS = "defaultAddress",
  USER_ADDRESS = "userAddress",
  DESTINATION_ADDRESS = "destinationAddress",

  DEFAULT_COORDINATES = "defaultCoordinates",
  USER_COORDINATES = "userCoordinates",
  DESTINATION_COORDINATES = "destinationCoordinates"
}

class YandexMapsStore {
  ymScriptUrl = "https://api-maps.yandex.ru/2.1/?apikey=ba493d93-6641-43da-97fe-0d3f01ccf9b0&lang=ru_RU";

  ymData = {
    defaultCoordinates: { latitude: 56.85, longitude: 60.65 },
    defaultAddress: {
      region: "Россия, Свердловская область, Екатеринбург",
      fullAddress:
        "Россия, Свердловская область, Екатеринбург, Кировский район, микрорайон Втузгородок, Академическая улица, 16",
      shortAddress: "Академическая улица, 16"
    },
    userCoordinates: { longitude: 0, latitude: 0 },
    userAddress: {
      region: "",
      fullAddress: "",
      shortAddress: ""
    },
    destinationCoordinates: { longitude: 0, latitude: 0 },
    destinationAddress: {
      region: "",
      fullAddress: "",
      shortAddress: ""
    }
  } as YMData;

  ymCarsProps: {
    [carId: string]: { latitude: number; longitude: number; address: string; distance: number };
  } = {};
  ymCarsSortedIDs: { carId: string; distance: number }[] = [];

  ym: any = null;
  ymCarCollection: any = null;
  ymUserMapMarker: any = null;
  ymDestinationMapMarker: any = null;

  ymContainer: HTMLDivElement | null = null;

  isYmScriptLoad = false;
  isYmReady = false;
  isGeolocationTrySetCurrentPosition = false;

  initTimer: NodeJS.Timeout | null = null;

  constructor() {
    makeObservable(this, {
      ym: observable,
      ymData: observable,
      isYmReady: observable,
      ymCarsProps: observable,
      ymCarsSortedIDs: observable,

      setYmMapReady: action,
      setYmData: action,
      setYmContainer: action,

      isAddressUserValid: action,
      isAddressDestinationValid: action,

      setYmCarsProps: action,
      getYmCarsProps: computed,

      getYmData: computed,

      getDefaultCoordinates: computed,
      getDefaultAddress: computed,

      getDestinationCoordinates: computed,
      getDestinationAddress: computed,

      getUserCoordinates: computed,
      getUserAddress: computed,

      getDestinationCurrentCoords: computed,
      getDestinationCurrentAddress: computed,
      getUserCurrentCoords: computed,
      getUserCurrentAddress: computed
    });

    this.initGeo();
  }

  initGeo = () => {
    this.loadYmScript(this.ymScriptUrl);
    this.setUserPositionFromGeolocation();

    this.initTimer = setInterval(() => {
      if (this.isYmScriptLoad && this.ymContainer && this.isGeolocationTrySetCurrentPosition) {
        this.initYm();
        this.clearInitTimer(this.initTimer as NodeJS.Timeout);
      }
    }, 500);
  };

  loadYmScript(scriptUrl: string) {
    const script = document.createElement("script");

    script.src = scriptUrl;
    script.async = true;

    document.body.appendChild(script);
    script.onload = () => {
      this.isYmScriptLoad = true;
    };
  }

  setUserPositionFromGeolocation = () => {
    if (navigator.geolocation) {
      const options = {
        enableHighAccuracy: true
      };

      const error = (error: GeolocationPositionError) => {
        this.isGeolocationTrySetCurrentPosition = true;
      };

      const success = async (position: GeolocationPosition) => {
        const { coords } = position;
        const { latitude, longitude } = coords;
        this.setYmData({ latitude, longitude }, YmData.USER_COORDINATES);
        this.isGeolocationTrySetCurrentPosition = true;
      };
      //navigator.geolocation.getCurrentPosition(success, error, options);

      setTimeout(() => {
        this.isGeolocationTrySetCurrentPosition = true;
      }, 9000);
    } else {
      this.isGeolocationTrySetCurrentPosition = true;
    }
  };

  initYm = () => {
    const { latitude, longitude } = this.getUserCurrentCoords;

    ymaps
      .ready()
      .then(() => {
        this.ym = new ymaps.Map(this.ymContainer, {
          center: [latitude, longitude],
          zoom: 15,
          controls: ["smallMapDefaultSet"]
        });
      })
      .then(() => {
        this.setYmMapReady();
        this.ym.events.add("click", this.ymHandler);

        //this.setUserPositionFromYandex();
        this.setUserPosition(this.getUserCurrentCoords);
      })
      .catch((error: Error) => console.log(error.message));
  };

  setUserPositionFromYandex = () => {
    let geolocation = ymaps.geolocation;

    geolocation
      .get({
        provider: "yandex",
        mapStateAutoApply: true
      })
      .then((position: any) => {
        const coords: number[] = position.geoObjects.position;
        this.setUserPosition({ latitude: coords[0], longitude: coords[1] });
      })
      .catch((error: Error) => console.log(error.message));
  };

  setUserPosition = (coords: { latitude: number; longitude: number }, address?: any) => {
    const { latitude, longitude } = coords;

    this.setYmData(
      {
        latitude,
        longitude
      },
      YmData.USER_COORDINATES
    );

    this.drawUserMapMarker(this.getUserCurrentCoords);

    const setProps = (address: any) => {
      const { description, name, text } = address;

      this.setYmData({ region: description, fullAddress: text, shortAddress: name }, YmData.USER_ADDRESS);

      this.ymUserMapMarker.properties.set(
        "iconContent",
        "Вы здесь: " + this.getUserCurrentAddress.shortAddress
      );
      this.ymUserMapMarker.properties.set("hintContent", this.getUserCurrentAddress.fullAddress);
    };

    if (!address) {
      this.coordsToAddressCodding(this.getUserCurrentCoords)
        .then((address: any) => {
          setProps(address);
        })
        .catch((error: Error) => console.log(error.message));
    } else {
      setProps(address);
    }
  };

  setDestinationPosition = (coords: { latitude: number; longitude: number }, address?: any) => {
    const { latitude, longitude } = coords;

    this.setYmData(
      {
        latitude,
        longitude
      },
      YmData.DESTINATION_COORDINATES
    );

    this.drawDestinationMapMarker(this.getDestinationCurrentCoords);

    const setProps = (address: any) => {
      const { description, name, text } = address;
      this.setYmData(
        { region: description, fullAddress: text, shortAddress: name },
        YmData.DESTINATION_ADDRESS
      );

      this.ymDestinationMapMarker.properties.set(
        "iconContent",
        "Вам нужно сюда: " + this.getDestinationCurrentAddress.shortAddress
      );
      this.ymDestinationMapMarker.properties.set(
        "hintContent",
        this.getDestinationCurrentAddress.fullAddress
      );
    };

    if (!address) {
      this.coordsToAddressCodding(this.getDestinationCurrentCoords)
        .then((address: any) => {
          setProps(address);
        })
        .catch((error: Error) => console.log(error.message));
    } else {
      setProps(address);
    }
  };

  createMapMarker = (
    markerType: string,
    markerId: string,
    markerContent: string = "",
    markerHoverContent: string = "",
    draggAble: boolean = true,
    coords: { latitude: number; longitude: number }
  ) => {
    const { latitude, longitude } = coords;
    return new ymaps.GeoObject(
      {
        geometry: {
          type: "Point",
          coordinates: [latitude, longitude]
        },
        properties: {
          iconContent: markerContent,
          hintContent: markerHoverContent,
          id: markerId
        }
      },
      {
        preset: markerType,
        draggable: draggAble
      }
    );
  };

  drawUserMapMarker = (coords: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = coords;

    if (!this.ymUserMapMarker) {
      this.ymUserMapMarker = this.createMapMarker(
        "islands#darkGreenStretchyIcon",
        "UserMapMarker",
        "Вы здесь: " + this.getUserCurrentAddress.shortAddress,
        this.getUserCurrentAddress.fullAddress,
        true,
        coords
      );
      this.ym.geoObjects.add(this.ymUserMapMarker);
      this.ymUserMapMarker.events.add("dragend", this.ymHandler);
    } else {
      this.ym.geoObjects.each((placeMark: any) => {
        if (placeMark.properties.get("id") === "UserMapMarker") {
          placeMark.geometry.setCoordinates([latitude, longitude]);
        }
      });
      this.ym.setCenter([latitude, longitude]);
    }
  };

  drawDestinationMapMarker = (coords: { latitude: number; longitude: number }) => {
    const { latitude, longitude } = coords;

    if (!this.ymDestinationMapMarker) {
      this.ymDestinationMapMarker = this.createMapMarker(
        "islands#yellowStretchyIcon",
        "DestinationMapMarker",
        "Вам нужно сюда: " + this.getDestinationCurrentAddress.shortAddress + " ?",
        this.getDestinationCurrentAddress.fullAddress,
        true,
        coords
      );
      this.ym.geoObjects.add(this.ymDestinationMapMarker);
      this.ymDestinationMapMarker.events.add("dragend", this.ymHandler);
    } else {
      this.ym.geoObjects.each((placeMark: any) => {
        if (placeMark.properties.get("id") === "DestinationMapMarker") {
          placeMark.geometry.setCoordinates([latitude, longitude]);
        }
      });
    }
  };

  setYmMapReady() {
    this.isYmReady = true;
  }

  get getYmCarsProps() {
    return this.ymCarsProps;
  }

  get getYmData() {
    return this.ymData;
  }

  get getDefaultCoordinates() {
    return this.ymData.defaultCoordinates;
  }
  get getUserCoordinates() {
    return this.ymData.userCoordinates;
  }
  get getDestinationCoordinates() {
    return this.ymData.destinationCoordinates;
  }

  get getDefaultAddress() {
    return this.ymData.defaultAddress;
  }
  get getUserAddress() {
    return this.ymData.userAddress;
  }
  get getDestinationAddress() {
    return this.ymData.destinationAddress;
  }

  get getDestinationCurrentCoords() {
    const { latitude, longitude } = this.getDestinationCoordinates;
    return latitude && longitude ? this.getDestinationCoordinates : this.getDefaultCoordinates;
  }

  get getDestinationCurrentAddress() {
    const { region, fullAddress, shortAddress } = this.getDestinationAddress;
    return region && fullAddress && shortAddress ? this.getDestinationAddress : this.getDefaultAddress;
  }

  get getUserCurrentCoords() {
    const { latitude, longitude } = this.getUserCoordinates;
    return latitude && longitude ? this.getUserCoordinates : this.getDefaultCoordinates;
  }

  get getUserCurrentAddress() {
    const { region, fullAddress, shortAddress } = this.getUserAddress;
    return region && fullAddress && shortAddress ? this.getUserAddress : this.getDefaultAddress;
  }

  clearInitTimer = (timer: NodeJS.Timeout) => {
    clearInterval(timer);
  };

  async isAddressUserValid<T>(address: string): Promise<T> {
    return (await ymaps.geocode(this.getUserCurrentAddress.region + address)) as Promise<T>;
  }
  async isAddressDestinationValid<T>(address: string): Promise<T> {
    return (await ymaps.geocode(this.getDestinationCurrentAddress.region + address)) as Promise<T>;
  }

  async adressToCoordsCodding<T>(address: string): Promise<T> {
    const responce = await ymaps.geocode(address);
    return await (responce.geoObjects.get(0).geometry.getCoordinates() as Promise<T>);
  }

  async coordsToAddressCodding<T>(coords: { latitude: number; longitude: number }): Promise<T> {
    const { latitude, longitude } = coords;
    const responce = await ymaps.geocode([latitude, longitude]);
    return await (responce.geoObjects.get(0).properties.getAll() as Promise<T>);
  }

  setYmContainer = (ymContainer: HTMLDivElement) => {
    this.ymContainer = ymContainer;
  };

  ymHandler = (ymEvent: any) => {
    const mapClickCoordinates: number[] = ymEvent.get("coords");
    const type: string = ymEvent.get("type");
    const target: any = ymEvent.get("target");

    if (type === "click" && mapClickCoordinates.length) {
      this.setDestinationPosition({
        latitude: mapClickCoordinates[0],
        longitude: mapClickCoordinates[1]
      });
    }

    if (type === "dragend") {
      const id: string = target.properties.get("id");
      const markDragCoordinates: number[] = target.geometry.getCoordinates();

      if (id === "UserMapMarker") {
        this.setUserPosition({
          latitude: markDragCoordinates[0],
          longitude: markDragCoordinates[1]
        });
      }

      if (id === "DestinationMapMarker") {
        this.setDestinationPosition({
          latitude: markDragCoordinates[0],
          longitude: markDragCoordinates[1]
        });
      }
    }
  };

  setYmCarsProps = (
    carId: string,
    coords: { latitude: number; longitude: number },
    distance: number,
    address: string
  ) => {
    const { latitude, longitude } = coords;

    let driver: { carId: string; distance: number } = { carId, distance };
    let innerIndex = -1;

    if (!this.ymCarsSortedIDs.length) {
      this.ymCarsSortedIDs.push(driver);
    } else {
      if (driver.distance <= this.ymCarsSortedIDs[0].distance) {
        this.ymCarsSortedIDs.unshift(driver);
      } else if (driver.distance >= this.ymCarsSortedIDs[this.ymCarsSortedIDs.length - 1].distance) {
        this.ymCarsSortedIDs.push(driver);
      } else {
        for (let index = 0; index < this.ymCarsSortedIDs.length - 1; index++) {
          if (
            driver.distance >= this.ymCarsSortedIDs[index].distance &&
            driver.distance < this.ymCarsSortedIDs[index + 1].distance
          ) {
            innerIndex = index + 1;
          }
        }
      }
      if (innerIndex >= 0) {
        this.ymCarsSortedIDs = ([] as { carId: string; distance: number }[]).concat(
          this.ymCarsSortedIDs.slice(0, innerIndex),
          driver,
          this.ymCarsSortedIDs.slice(innerIndex)
        );
      }
    }

    this.ymCarsProps = {
      ...this.ymCarsProps,
      [carId]: {
        latitude,
        longitude,
        address,
        distance
      }
    };
  };

  createDriversOnMap = (drives: IDrivers) => {
    this.ymCarCollection = new ymaps.GeoObjectCollection();

    Object.keys(drives).forEach((driverId: string) => {
      const coords = [
        this.getUserCurrentCoords.latitude + (0.5 - Math.random()) / 50,
        this.getUserCurrentCoords.longitude + (0.5 - Math.random()) / 50
      ];
      let distance = "";
      let meters = 0;

      ymaps
        .route([[this.getUserCurrentCoords.latitude, this.getUserCurrentCoords.longitude], coords])
        .then((data: any) => {
          distance = data.getHumanLength().replace("&#160;", "");
          meters = 0;

          if (distance.indexOf("км") !== -1) {
            meters = parseFloat(distance.replace("км", "")) * 1000;
          } else {
            meters = parseFloat(distance.replace("м", ""));
          }
        })
        .then(() => {
          this.coordsToAddressCodding({ latitude: coords[0], longitude: coords[1] })
            .then((address: any) => {
              const { name, text } = address;

              this.setYmCarsProps(driverId, { latitude: coords[0], longitude: coords[1] }, meters, name);

              this.ymCarCollection.add(
                new ymaps.GeoObject(
                  {
                    geometry: {
                      type: "Point",
                      coordinates: coords
                    },
                    properties: {
                      iconContent: name + ", " + distance,
                      hintContent: name + ", " + distance
                    }
                  },
                  {
                    preset: "islands#orangeAutoIcon",
                    draggable: false
                  }
                )
              );
            })
            .catch((error: Error) => console.log(error.message));
        })
        .catch((error: Error) => console.log(error.message));
    });

    this.ym.geoObjects.add(this.ymCarCollection);
  };

  setYmData = (data: position | address, namePosition: YmData) => {
    if ("latitude" in data && "longitude" in data) {
      const { longitude, latitude } = data;
      this.ymData = {
        ...this.ymData,
        [namePosition]: { longitude, latitude }
      };
    } else if ("region" in data && "fullAddress" in data && "shortAddress" in data) {
      const { region, fullAddress, shortAddress } = data;
      this.ymData = {
        ...this.ymData,
        [namePosition]: { region, fullAddress, shortAddress }
      };
    }
  };
}

export default YandexMapsStore;
