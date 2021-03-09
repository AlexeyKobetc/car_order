import { action, computed, makeObservable, observable } from "mobx";
import { inputs } from "../sharedcomponents/initComponents";

class InputsStore {
  inputsStore = inputs;
  isAllInputsValid: boolean = false;
  constructor() {
    makeObservable(this, {
      inputsStore: observable,
      isAllInputsValid: observable,

      getInputs: computed,

      checkInputsValid: action,
      isInputsValid: action,
      setInputValue: action,
      setIsValidInput: action,
      resetInputsValues: action
    });
  }

  get getInputs() {
    return this.inputsStore;
  }

  get getIsAllInputsValid() {
    return this.isAllInputsValid;
  }

  checkInputsValid = () => {
    let check = true;
    Object.keys(this.inputsStore).forEach((inputName: string) => {
      if (!this.inputsStore[inputName].isValid) {
        check = false;
      }
    });
    this.isAllInputsValid = check;
  };

  isInputsValid = () => {
    let check = true;

    Object.keys(this.inputsStore).forEach((inputName: string) => {
      if (!this.inputsStore[inputName].isValid) {
        check = false;

        this.inputsStore = {
          ...this.inputsStore,
          [inputName]: { ...this.inputsStore[inputName], isValid: false }
        };
      }
    });
    this.isAllInputsValid = check;

    return check;
  };

  resetInputsValues = () => {
    Object.keys(this.inputsStore).forEach(inputName => {
      this.inputsStore = {
        ...this.inputsStore,
        [inputName]: { ...this.inputsStore[inputName], value: "", isValid: null }
      };
    });
    this.isAllInputsValid = false;
  };

  setIsValidInput = (inputName: string, isValid: boolean) => {
    this.inputsStore = {
      ...this.inputsStore,
      [inputName]: {
        ...this.inputsStore[inputName],
        isValid
      }
    };
  };

  setInputValue = (inputName: string, inputValue: string, isValid: boolean) => {
    this.inputsStore = {
      ...this.inputsStore,
      [inputName]: {
        ...this.inputsStore[inputName],
        value: inputValue,
        isValid
      }
    };
    this.checkInputsValid();
  };
}

export default InputsStore;
