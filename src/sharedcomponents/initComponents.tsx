import { IButtons, IDrivers, IInputs } from "./interfaces";

export const inputs: IInputs = {
  inputAddress: {
    textarea: false,
    labelText: "Откуда Вас забрать.",
    placeHolder: "Откуда Вас забрать.",
    helpText: "Введите адрес откуда Вас забрать.",
    errorLabel: "Уточните адрес",
    value: "",
    isValid: null,
    maxLen: 150,
    regEx: [/^[\u0400-\u04FFa-zA-Z0-9.,\- ]+$/],
    isYandex: true
  },
  destinationAddress: {
    textarea: false,
    labelText: "Куда Вы поедете.",
    placeHolder: "Куда Вы поедете.",
    helpText: "Введите адрес куда Вы поедете.",
    errorLabel: "Уточните адрес",
    value: "",
    isValid: null,
    maxLen: 150,
    regEx: [/^[\u0400-\u04FFa-zA-Z0-9.,\- ]+$/],
    isYandex: true
  },
  inputName: {
    textarea: false,
    labelText: "Ваше имя.",
    placeHolder: "Ваше имя.",
    helpText: "Как к Вам обращаться.",
    errorLabel: "Уточните имя",
    value: "",
    isValid: null,
    maxLen: 50,
    regEx: [/^[\u0400-\u04FF ]+$/],
    isYandex: false
  },
  inputPhone: {
    textarea: false,
    labelText: "Ваш E-Mail или номер телефона",
    placeHolder: "Ваш E-Mail или номер телефона",
    helpText: "Введите вашу электронную почту или номер телефона.",
    errorLabel: "name@server.com или +7XXXXXXXXXX",
    value: "",
    isValid: null,
    maxLen: 50,
    regEx: [
      /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      /^((\+7|7|8)+([0-9]){10})$/
    ],
    isYandex: false
  }
  // inputComment: {
  //   textarea: true,
  //   labelText: "Комментарий для водителя",
  //   placeHolder: "Комментарий для водителя",
  //   helpText: "Если есть особые пожелания, напишите их здесь.",
  //   errorLabel:
  //     "  Комментарий может содержать только русские или латинские символы, цифры и знаки пунктуации.",
  //   value: "",
  //   isValid: null,
  //   maxLen: 250,
  //   regEx: [/^[\u0400-\u04FFa-zA-Z0-9.,?!\-\n\r ]+$/],
  //   isYandex: false
  // }
};

export const buttons: IButtons = {
  ok: {
    labelText: "Заказать",
    disabled: false,
    bootStrapColor: "secondary",
    modal: true
  },
  help: {
    labelText: "Инструкция",
    disabled: false,
    bootStrapColor: "secondary",
    modal: false
  }
};

export const drivers: IDrivers = {
  0: {
    car_mark: "Hyundai",
    car_model: "Solaris",
    car_color: "белый",
    car_number: "Ф567АС",
    driver_name: "Петров Петр Петрович",
    driver_phone: "+7(123)456-78-90",
    lat: 0,
    lon: 0,
    distance: 0,
    address: "",
    isActive: false
  },
  1: {
    car_mark: "Hyundai",
    car_model: "Creta",
    car_color: "красный",
    car_number: "В675СА",
    driver_name: "Иванов Иван Иванович",
    driver_phone: "+7(123)123-43-34",
    lat: 0,
    lon: 0,
    distance: 0,
    address: "",
    isActive: false
  },
  2: {
    car_mark: "Hyundai",
    car_model: "Sonata",
    car_color: "черный",
    car_number: "У789ЛО",
    driver_name: "Семенов Семен Семенович",
    driver_phone: "+7(123)345-54-23",
    lat: 0,
    lon: 0,
    distance: 0,
    address: "",
    isActive: false
  },
  3: {
    car_mark: "Kia",
    car_model: "Cerato",
    car_color: "серебро",
    car_number: "МР678Т",
    driver_name: "Александров Александр Александрович",
    driver_phone: "+7(123)345-54-23",
    lat: 0,
    lon: 0,
    distance: 0,
    address: "",
    isActive: false
  }
};
