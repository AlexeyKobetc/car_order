export interface IInputs {
  [name: string]: IInput;
}

export interface IInput {
  name?: string;
  textarea?: boolean;
  labelText?: string;
  placeHolder?: string;
  helpText?: string;
  errorLabel?: string;
  value?: string;
  isValid?: boolean | null;
  maxLen?: number;
  regEx?: RegExp[];
  isYandex: boolean;
}

export interface IButtons {
  [name: string]: IButton;
}

export interface IButton {
  labelText?: string;
  fill?: boolean;
  rounded?: boolean;
  bootStrapColor?: string;
  disabled?: boolean;
  name?: string;
  customButtonsHandler?: () => void;
  modal?: boolean;
}

export type TDrivers = Array<IDriver>;

export interface IDrivers {
  [name: string]: IDriver;
}

export interface IDriver {
  car_mark: string;
  car_model: string;
  car_color: string;
  car_number: string;
  driver_name: string;
  driver_phone: string;
  lat: number;
  lon: number;
  distance: number;
  address: string;
  isActive: boolean;
}

export interface IOrderForm {
  orderId: string;
  orderTime: string;
  clientName?: string;
  clientContacts?: string;
  sourceAddress: string;
  sourceCoordinates: { latitude: number; longitude: number };
  destinationAddress: string;
  destinationCoordinates: { latitude: number; longitude: number };
  selectDriver: IDriver;
}
